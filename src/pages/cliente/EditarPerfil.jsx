import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import Swal from "sweetalert2";
import { regionesYComunas } from "../../components/regionesComunas";
import { db } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";

export default function EditarPerfil() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: userData?.fullName || "",
    email: userData?.email || "",
    telefono: userData?.telefono || "",
    direccion: userData?.direccion || "",
    region: userData?.region || "",
    comuna: userData?.comuna || "",
  });
  const [comunas, setComunas] = useState([]);

  useEffect(() => {
    if (form.region) {
      setComunas(regionesYComunas[form.region] || []);
    } else {
      setComunas([]);
    }
  }, [form.region]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "usuarios", userData.uid), {
        fullName: form.fullName,
        telefono: form.telefono,
        direccion: form.direccion,
        region: form.region,
        comuna: form.comuna,
      });
      Swal.fire("Perfil actualizado", "", "success");
      navigate("/cliente");
    } catch {
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  return (
    <div className="container py-5">
      <button
        className="btn btn-outline-success mb-4"
        onClick={() => navigate("/cliente")}
      >
        <i className="bi bi-arrow-left me-2"></i>Volver al Panel Cliente
      </button>
      <div className="mx-auto" style={{ maxWidth: 520 }}>
        <div className="card shadow border-0 p-4 rounded-4">
          <h2 className="text-success fw-bold mb-3 text-center">
            <i className="bi bi-person-circle me-2"></i>Editar Perfil
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Nombre completo</label>
              <input
                className="form-control"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                required
                minLength={3}
                maxLength={50}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Correo electrónico</label>
              <input
                className="form-control"
                value={form.email}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Teléfono</label>
              <input
                className="form-control"
                value={form.telefono}
                onChange={e => setForm({ ...form, telefono: e.target.value.replace(/\D/g, "") })}
                minLength={8}
                maxLength={15}
                placeholder="Ej: 912345678"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Dirección</label>
              <input
                className="form-control"
                value={form.direccion}
                onChange={e => setForm({ ...form, direccion: e.target.value })}
                minLength={5}
                maxLength={60}
                placeholder="Ej: Av. Siempre Viva 123"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Región</label>
              <select
                className="form-select"
                value={form.region}
                onChange={e => setForm({ ...form, region: e.target.value, comuna: "" })}
                required
              >
                <option value="">Selecciona una región</option>
                {Object.keys(regionesYComunas).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Comuna</label>
              <select
                className="form-select"
                value={form.comuna}
                onChange={e => setForm({ ...form, comuna: e.target.value })}
                required
                disabled={!form.region}
              >
                <option value="">Selecciona una comuna</option>
                {comunas.map(comuna => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-success btn-lg w-100 mt-2" type="submit">
              <i className="bi bi-save me-2"></i>Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}