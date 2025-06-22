import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../firebase/AuthContext";
import { aprobarSolicitud, rechazarSolicitud } from "../../services/pedidoService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function SolicitudesEmpresa() {
  const { userData } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;
    const fetchSolicitudes = async () => {
      setLoading(true);
      const q = query(
        collection(db, "solicitudes"),
        where("empresaId", "==", userData.uid),
        where("estado", "==", "pendiente")
      );
      const snap = await getDocs(q);
      setSolicitudes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchSolicitudes();
  }, [userData]);

  const handleAprobar = async (id) => {
    await aprobarSolicitud(id);
    setSolicitudes(solicitudes.filter(s => s.id !== id));
    Swal.fire("Solicitud aprobada", "El stock ha sido descontado.", "success");
  };

  const handleRechazar = async (id) => {
    await rechazarSolicitud(id);
    setSolicitudes(solicitudes.filter(s => s.id !== id));
    Swal.fire("Solicitud rechazada", "", "info");
  };

  if (loading) return <div>Cargando solicitudes...</div>;

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-success mb-4"
        onClick={() => navigate("/empresa/productos")}
      >
        <i className="bi bi-arrow-left me-2"></i>Volver a Mis Productos
      </button>
      <h2 className="mb-4">Solicitudes pendientes</h2>
      {solicitudes.length === 0 && <div>No hay solicitudes pendientes.</div>}
      <div className="row">
        {solicitudes.map(s => (
          <div className="col-md-6 mb-3" key={s.id}>
            <div className="card shadow border-0">
              <div className="card-body">
                <h5 className="fw-bold">{s.productoNombre}</h5>
                <p><b>Cliente:</b> {s.clienteNombre}</p>
                <p><b>Cantidad solicitada:</b> {s.cantidad}</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-success" onClick={() => handleAprobar(s.id)}>
                    <i className="bi bi-check-circle me-1"></i>Aprobar
                  </button>
                  <button className="btn btn-danger" onClick={() => handleRechazar(s.id)}>
                    <i className="bi bi-x-circle me-1"></i>Rechazar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}