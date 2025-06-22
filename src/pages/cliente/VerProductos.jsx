import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { useAuth } from "../../firebase/AuthContext";
import { solicitarProducto } from "../../services/pedidoService";
import { useNavigate } from "react-router-dom";

const VerProductos = () => {
  const [productos, setProductos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [filtros, setFiltros] = useState({
    empresa: "todas",
    region: "todas",
    estado: "todos",
    orden: "nombre",
  });
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const navigate = useNavigate();

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

  // Filtros y orden
  const productosFiltrados = productos
    .filter(p => p.cantidad > 0)
    .filter(p => filtros.empresa === "todas" || p.empresaId === filtros.empresa)
    .filter(p => filtros.region === "todas" || p.region === filtros.region)
    .filter(p => {
      if (filtros.estado === "gratis") return Number(p.precio) === 0;
      if (filtros.estado === "pago") return Number(p.precio) > 0;
      return true;
    })
    .sort((a, b) => {
      if (filtros.orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (filtros.orden === "precio") return Number(a.precio) - Number(b.precio);
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
        Swal.fire("Error", "No se pudo enviar la solicitud.", "error");
      }
    }
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-success mb-4"
        onClick={() => navigate("/cliente")}
      >
        <i className="bi bi-arrow-left me-2"></i>Volver al Panel Cliente
      </button>
      <h2>Productos disponibles</h2>
      <div className="row mb-3">
        <div className="col-md-3">
          <label>Empresa</label>
          <select className="form-select" value={filtros.empresa} onChange={e => setFiltros(f => ({ ...f, empresa: e.target.value }))}>
            <option value="todas">Todas</option>
            {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label>Región</label>
          <select className="form-select" value={filtros.region} onChange={e => setFiltros(f => ({ ...f, region: e.target.value }))}>
            <option value="todas">Todas</option>
            {[...new Set(productos.map(p => p.region))].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label>Estado</label>
          <select className="form-select" value={filtros.estado} onChange={e => setFiltros(f => ({ ...f, estado: e.target.value }))}>
            <option value="todos">Todos</option>
            <option value="gratis">Gratuito</option>
            <option value="pago">Pago</option>
          </select>
        </div>
        <div className="col-md-3">
          <label>Ordenar por</label>
          <select className="form-select" value={filtros.orden} onChange={e => setFiltros(f => ({ ...f, orden: e.target.value }))}>
            <option value="nombre">Nombre</option>
            <option value="precio">Precio</option>
          </select>
        </div>
      </div>
      <div className="row">
        {productosFiltrados.length === 0 && <div>No hay productos disponibles.</div>}
        {productosFiltrados.map((prod) => (
          <div className="col-md-4 mb-4" key={prod.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{prod.nombre}</h5>
                <p className="card-text">{prod.descripcion}</p>
                <p><b>Precio:</b> {Number(prod.precio) === 0 ? "Gratis" : `$${prod.precio}`}</p>
                <p><b>Stock:</b> {prod.cantidad}</p>
                <button
                  className="btn btn-success"
                  disabled={prod.cantidad === 0}
                  onClick={() => solicitarProductoCliente(prod)}
                >
                  Solicitar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerProductos;