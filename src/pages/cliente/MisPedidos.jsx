import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function MisPedidos() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (!userData) return;
    const fetchPedidos = async () => {
      const q = query(collection(db, "solicitudes"), where("clienteId", "==", userData.uid));
      const snap = await getDocs(q);
      setPedidos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPedidos();
  }, [userData]);

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
        {pedidos.length === 0 ? (
          <div className="text-center text-muted py-4">No tienes pedidos aÃºn.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(p => (
                  <tr key={p.id}>
                    <td>{p.productoNombre}</td>
                    <td>{p.cantidad}</td>
                    <td>
                      <span className={
                        p.estado === "aprobado" ? "badge bg-success" :
                        p.estado === "rechazado" ? "badge bg-danger" :
                        "badge bg-warning text-dark"
                      }>
                        {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                      </span>
                    </td>
                    <td>{p.fecha && p.fecha.seconds ? new Date(p.fecha.seconds * 1000).toLocaleDateString() : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}