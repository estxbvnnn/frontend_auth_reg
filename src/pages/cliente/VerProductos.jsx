import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { useAuth } from "../../firebase/AuthContext";
import { solicitarProducto, tieneSolicitudPendiente } from "../../services/pedidoService";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const VerProductos = () => {
  const [productos, setProductos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [filtros, setFiltros] = useState({
    empresa: "todas",
    estado: "todos",
    orden: "nombre",
  });
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [pendientes, setPendientes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const productosSnap = await getDocs(collection(db, "productos"));
      const empresasSnap = await getDocs(collection(db, "empresas"));
      setProductos(productosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setEmpresas(empresasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!userData) return;
    // Para cada producto, verificar si hay solicitud pendiente
    const checkPendientes = async () => {
      const result = {};
      for (const prod of productos) {
        if (prod.cantidad === 1) {
          result[prod.id] = await tieneSolicitudPendiente({ productoId: prod.id, clienteId: userData.uid });
        }
      }
      setPendientes(result);
    };
    checkPendientes();
  }, [productos, userData]);

  // Filtros y orden
  const productosFiltrados = productos
    .filter(p => p.cantidad > 0)
    .filter(p => filtros.empresa === "todas" || p.empresaId === filtros.empresa)
    .filter(p => {
      if (filtros.estado === "gratis") return Number(p.precio) === 0;
      if (filtros.estado === "pago") return Number(p.precio) > 0;
      return true;
    })
    .sort((a, b) => {
      if (filtros.orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (filtros.orden === "precio-asc") return Number(a.precio) - Number(b.precio);
      if (filtros.orden === "precio-desc") return Number(b.precio) - Number(a.precio);
      return 0;
    });

  const solicitarProductoCliente = async (producto) => {
    const { value: cantidad } = await Swal.fire({
      title: `Solicitar "${producto.nombre}"`,
      input: "number",
      inputLabel: `Stock disponible: ${producto.cantidad}`,
      inputAttributes: {
        min: 1,
        max: producto.cantidad,
        step: 1,
      },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "Solicitar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value || value < 1 || value > producto.cantidad) {
          return "Cantidad inválida";
        }
      },
    });
    if (cantidad) {
      try {
        await solicitarProducto({
          producto,
          cantidad,
          userData,
          empresaNombre: empresas.find(e => e.id === producto.empresaId)?.nombre || "",
        });
        Swal.fire("Solicitud enviada", "Tu solicitud está pendiente de aprobación.", "success");
      } catch (e) {
        Swal.fire("Stock insuficiente", e.message || "No se pudo enviar la solicitud.", "error");
      }
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success" role="status"></div></div>;

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-success mb-4"
        type="button"
        onClick={() => navigate("/cliente")}
      >
        <i className="bi bi-arrow-left me-2"></i>Volver al Panel Cliente
      </button>
      <h2 className="mb-4 fw-bold" style={{ letterSpacing: 1, color: "#2e7d32" }}>
        <i className="bi bi-bag-heart-fill me-2"></i>Productos Disponibles
      </h2>
      {/* Barra de filtros */}
      <div className="row g-3 mb-4 filtros-bar">
        <div className="col-12 col-md-4">
          <label className="form-label fw-bold">Empresa</label>
          <select className="form-select" value={filtros.empresa} onChange={e => setFiltros(f => ({ ...f, empresa: e.target.value }))}>
            <option value="todas">Todas</option>
            {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label fw-bold">Estado</label>
          <select className="form-select" value={filtros.estado} onChange={e => setFiltros(f => ({ ...f, estado: e.target.value }))}>
            <option value="todos">Todos</option>
            <option value="gratis">Gratuito</option>
            <option value="pago">Pago</option>
          </select>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label fw-bold">Ordenar por</label>
          <select className="form-select" value={filtros.orden} onChange={e => setFiltros(f => ({ ...f, orden: e.target.value }))}>
            <option value="nombre">Nombre (A-Z)</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>
      {/* Grid de productos */}
      <div className="row g-4">
        {productosFiltrados.length === 0 && (
          <div className="col-12 text-center text-muted py-5">
            <i className="bi bi-emoji-frown" style={{ fontSize: 40 }}></i>
            <div className="mt-2">No hay productos disponibles.</div>
          </div>
        )}
        {productosFiltrados.map((prod) => {
          const empresa = empresas.find(e => e.id === prod.empresaId);
          const venceEn = dayjs(prod.fechaVencimiento).diff(dayjs(), 'day');
          let estado = "";
          if (venceEn < 0) estado = "vencido";
          else if (venceEn <= 3) estado = "por-vencer";
          else estado = "disponible";
          const sinStock = prod.cantidad === 0;
          const pendienteUnico = prod.cantidad === 1 && pendientes[prod.id];
          return (
            <div className="col-12 col-md-6 col-lg-4" key={prod.id}>
              <div className="card producto-publico-card h-100 border-0 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <div className="producto-avatar me-2">
                      <i className="bi bi-bag-heart-fill" style={{ fontSize: 26, color: "#388e3c" }}></i>
                    </div>
                    <h5 className="card-title mb-0" style={{ fontWeight: 700, color: "#23272f" }}>
                      {prod.nombre}
                    </h5>
                    <span className={`ms-auto badge badge-estado badge-estado-${estado}`} style={{ fontSize: 13, marginLeft: 8 }}>
                      {estado === "vencido" && "Vencido"}
                      {estado === "por-vencer" && "Por vencer"}
                      {estado === "disponible" && "Disponible"}
                    </span>
                  </div>
                  <p className="card-text mb-2" style={{ color: "#444", minHeight: 40 }}>
                    {prod.descripcion}
                  </p>
                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item px-0 py-1 border-0">
                      <b>Precio:</b>{" "}
                      <span className={Number(prod.precio) === 0 ? "text-gradient fw-bold" : "fw-bold"} style={{ fontSize: 18 }}>
                        {Number(prod.precio) === 0 ? "Gratis" : `$${prod.precio}`}
                      </span>
                    </li>
                    <li className="list-group-item px-0 py-1 border-0">
                      <b>Stock:</b> <span>{prod.cantidad}</span>
                      {sinStock && (
                        <span className="badge badge-sin-stock ms-2">Agotado</span>
                      )}
                    </li>
                    <li className="list-group-item px-0 py-1 border-0">
                      <b>Vence:</b> <span>{dayjs(prod.fechaVencimiento).format("DD/MM/YYYY")}</span>
                    </li>
                  </ul>
                  <div className="mt-auto d-flex flex-column gap-2">
                    <span className="badge badge-empresa px-3 py-2 mb-2" style={{ fontSize: 14 }}>
                      <i className="bi bi-building me-1"></i>
                      {empresa?.nombre || "Empresa"}
                    </span>
                    <button
                      className="btn btn-gradient-ecofood btn-lg"
                      disabled={prod.cantidad === 0 || estado === "vencido" || pendienteUnico}
                      onClick={() => solicitarProductoCliente(prod)}
                    >
                      <i className="bi bi-cart-plus me-2"></i>Solicitar
                    </button>
                    {pendienteUnico && (
                      <span className="badge bg-warning text-dark">Ya tienes una solicitud pendiente para este producto</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        .producto-publico-card {
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 2px 12px rgba(44,62,80,0.07);
          transition: box-shadow 0.2s, transform 0.2s;
          min-height: 340px;
          display: flex;
          flex-direction: column;
          justify-content: stretch;
        }
        .producto-publico-card:hover {
          box-shadow: 0 8px 32px rgba(56, 142, 60, 0.13);
          transform: translateY(-4px) scale(1.02);
        }
        .producto-avatar {
          width: 38px;
          height: 38px;
          background: #e8f5e9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(56, 142, 60, 0.07);
        }
        .badge-empresa {
          background: #388e3c;
          color: #fff;
          border: none;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .badge-estado {
          border-radius: 12px;
          font-weight: 600;
          padding: 6px 14px;
        }
        .badge-estado-disponible {
          background: #e8f5e9;
          color: #388e3c;
          border: 1px solid #43a047;
        }
        .badge-estado-por-vencer {
          background: #fffde7;
          color: #b26a00;
          border: 1px solid #ffe082;
        }
        .badge-estado-vencido {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #e57373;
        }
        .badge-sin-stock {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #e57373;
          font-weight: 600;
          border-radius: 12px;
          font-size: 0.95rem;
          padding: 4px 12px;
        }
        .btn-gradient-ecofood {
          background: linear-gradient(90deg, #43e97b 0%, #388e3c 100%) !important;
          color: #fff !important;
          border: none !important;
          font-weight: 600;
          border-radius: 30px;
          transition: background 0.2s;
          box-shadow: 0 2px 8px rgba(67, 233, 123, 0.08);
        }
        .btn-gradient-ecofood:hover, .btn-gradient-ecofood:focus {
          background: linear-gradient(90deg, #388e3c 0%, #43e97b 100%) !important;
          color: #fff !important;
        }
        .text-gradient {
          background: linear-gradient(90deg, #43e97b 0%, #388e3c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .filtros-bar .form-label {
          font-weight: 600;
          color: #388e3c;
        }
        @media (max-width: 767px) {
          .producto-publico-card {
            min-height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default VerProductos;