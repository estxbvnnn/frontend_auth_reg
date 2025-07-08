import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import { db } from "../../firebase/config";
import Swal from "sweetalert2";
import { cancelarSolicitud, obtenerSolicitudesClientePaginadas } from "../../services/pedidoService";

export default function MisPedidos() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastDocs, setLastDocs] = useState([]); // Para paginación
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const pageSize = 10;
  const totalPaginas = useRef(1);

  useEffect(() => {
    if (!userData) return;
    setLoading(true);
    obtenerSolicitudesClientePaginadas({ clienteId: userData.uid, pageSize }).then(snap => {
      setPedidos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLastDocs([snap.docs[snap.docs.length - 1] || null]);
      setLoading(false);
    });
  }, [userData]);

  const handlePage = async (dir) => {
    if (!userData) return;
    setLoading(true);
    let newLastDocs = [...lastDocs];
    let snap;
    if (dir === 1) {
      // Siguiente página
      snap = await obtenerSolicitudesClientePaginadas({ clienteId: userData.uid, pageSize, lastDoc: lastDocs[lastDocs.length - 1] });
      if (snap.docs.length > 0) {
        setPedidos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        newLastDocs.push(snap.docs[snap.docs.length - 1]);
        setLastDocs(newLastDocs);
        setPagina(pagina + 1);
      }
    } else if (dir === -1 && pagina > 1) {
      // Página anterior
      newLastDocs.pop();
      snap = await obtenerSolicitudesClientePaginadas({ clienteId: userData.uid, pageSize, lastDoc: newLastDocs[newLastDocs.length - 2] });
      setPedidos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLastDocs(newLastDocs);
      setPagina(pagina - 1);
    }
    setLoading(false);
  };

  const handleCancelar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Cancelar solicitud?",
      text: "¿Estás seguro de cancelar esta solicitud?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#3085d6",
    });
    if (confirm.isConfirmed) {
      try {
        await cancelarSolicitud(id);
        setPedidos(pedidos => pedidos.map(p => p.id === id ? { ...p, estado: "cancelado" } : p));
        Swal.fire("Cancelada", "La solicitud ha sido cancelada.", "success");
      } catch {
        Swal.fire("Error", "No se pudo cancelar la solicitud", "error");
      }
    }
  };

  // Calcular resumen de estados
  const resumenEstados = pedidos.reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {});

  // Filtrar pedidos por estado
  const pedidosFiltrados = estadoFiltro === "todos"
    ? pedidos
    : pedidos.filter(p => p.estado === estadoFiltro);

  return (
    <div className="container py-5">
      <button
        className="btn btn-outline-success mb-4"
        onClick={() => navigate("/cliente")}
      >
        <i className="bi bi-arrow-left me-2"></i>Volver al Panel Cliente
      </button>
      <div className="card shadow border-0 p-4 rounded-4">
        <h2 className="text-success fw-bold mb-3 text-center">
          <i className="bi bi-list-check me-2"></i>Mis Pedidos
        </h2>
        {/* Resumen de estados */}
        <div className="mb-3 d-flex flex-wrap gap-2 justify-content-center">
          <span className="badge bg-warning text-dark">Pendientes: {resumenEstados["pendiente"] || 0}</span>
          <span className="badge bg-success">Aprobados: {resumenEstados["aprobado"] || 0}</span>
          <span className="badge bg-danger">Rechazados: {resumenEstados["rechazado"] || 0}</span>
          <span className="badge bg-secondary">Cancelados: {resumenEstados["cancelado"] || 0}</span>
        </div>
        {/* Filtros por estado */}
        <div className="mb-3 d-flex flex-wrap gap-2 justify-content-center">
          <button className={`btn btn-sm ${estadoFiltro === "todos" ? "btn-success" : "btn-outline-success"}`} onClick={() => setEstadoFiltro("todos")}>Todos</button>
          <button className={`btn btn-sm ${estadoFiltro === "pendiente" ? "btn-warning text-dark" : "btn-outline-warning"}`} onClick={() => setEstadoFiltro("pendiente")}>Pendientes</button>
          <button className={`btn btn-sm ${estadoFiltro === "aprobado" ? "btn-success" : "btn-outline-success"}`} onClick={() => setEstadoFiltro("aprobado")}>Aprobados</button>
          <button className={`btn btn-sm ${estadoFiltro === "rechazado" ? "btn-danger" : "btn-outline-danger"}`} onClick={() => setEstadoFiltro("rechazado")}>Rechazados</button>
          <button className={`btn btn-sm ${estadoFiltro === "cancelado" ? "btn-secondary" : "btn-outline-secondary"}`} onClick={() => setEstadoFiltro("cancelado")}>Cancelados</button>
        </div>
        {loading ? (
          <div className="text-center py-4"><span className="spinner-border text-success"></span></div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center text-muted py-4">No tienes pedidos en este estado.</div>
        ) : (
          <>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map(p => (
                  <tr key={p.id}>
                    <td>{p.productoNombre}</td>
                    <td>{p.cantidad}</td>
                    <td>
                      <span className={
                        p.estado === "aprobado" ? "badge bg-success" :
                        p.estado === "rechazado" ? "badge bg-danger" :
                        p.estado === "cancelado" ? "badge bg-secondary" :
                        "badge bg-warning text-dark"
                      }>
                        {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                      </span>
                    </td>
                    <td>{p.fecha && p.fecha.seconds ? new Date(p.fecha.seconds * 1000).toLocaleDateString() : ""}</td>
                    <td>
                      {p.estado === "pendiente" && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancelar(p.id)}>
                          Cancelar
                        </button>
                      )}
                      {p.estado === "cancelado" && (
                        <span className="badge bg-secondary">Cancelado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
            <button className="btn btn-outline-success" onClick={() => handlePage(-1)} disabled={pagina === 1 || loading}>
              &lt; Anterior
            </button>
            <span>Página {pagina}</span>
            <button className="btn btn-outline-success" onClick={() => handlePage(1)} disabled={pedidosFiltrados.length < pageSize || loading}>
              Siguiente &gt;
            </button>
          </div>
          </>
        )}
      </div>
    </div>
  );
}