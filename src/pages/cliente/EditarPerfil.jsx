import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import Swal from "sweetalert2";
import { regionesYComunas } from "../../components/regionesComunas";
import { db } from "../../firebase/config";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export default function EditarPerfil() {
  const { userData, setUserData } = useAuth();
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
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (form.region) {
      setComunas(regionesYComunas[form.region] || []);
    } else {
      setComunas([]);
    }
  }, [form.region]);

  // Sincroniza el formulario con los cambios en userData
  useEffect(() => {
    setForm({
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      telefono: userData?.telefono || "",
      direccion: userData?.direccion || "",
      region: userData?.region || "",
      comuna: userData?.comuna || "",
    });
  }, [userData]);

  // Validación de campos
  const validar = () => {
    const nuevosErrores = {};
    if (!form.fullName || form.fullName.length < 3) {
      nuevosErrores.fullName = "El nombre debe tener al menos 3 caracteres.";
    }
    if (!form.telefono || !/^\d{8,15}$/.test(form.telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener entre 8 y 15 dígitos y solo números.";
    }
    if (!form.direccion || form.direccion.length < 5) {
      nuevosErrores.direccion = "La dirección debe tener al menos 5 caracteres.";
    }
    if (!form.region) {
      nuevosErrores.region = "Selecciona una región.";
    }
    if (!form.comuna) {
      nuevosErrores.comuna = "Selecciona una comuna.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "usuarios", userData.uid), {
        fullName: form.fullName,
        telefono: form.telefono,
        direccion: form.direccion,
        region: form.region,
        comuna: form.comuna,
      });
      // Refrescar datos del usuario en el contexto
      const userRef = doc(db, "usuarios", userData.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && setUserData) {
        setUserData({ uid: userData.uid, ...userSnap.data() });
      }
      setLoading(false);
      Swal.fire("Perfil actualizado", "", "success");
      navigate("/cliente");
    } catch {
      setLoading(false);
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  return (
    <div className="container py-5">
      <button
        className="btn btn-outline-success mb-4"
        onClick={() => navigate("/cliente")}
      >
        <i className="bi bi-arrow-left me-2"></i>Panel Cliente
      </button>
      <div className="mx-auto" style={{ maxWidth: 520 }}>
        <div className="card shadow border-0 p-4 rounded-4">
          <h2 className="text-success fw-bold mb-3 text-center">
            <i className="bi bi-person-circle me-2"></i>Perfil
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-bold">Nombre completo</label>
              <input
                className={`form-control${errores.fullName ? " is-invalid" : ""}`}
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                required
                minLength={3}
                maxLength={50}
              />
              {errores.fullName && <div className="invalid-feedback">{errores.fullName}</div>}
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
                className={`form-control${errores.telefono ? " is-invalid" : ""}`}
                value={form.telefono}
                onChange={e => setForm({ ...form, telefono: e.target.value.replace(/\D/g, "") })}
                minLength={8}
                maxLength={15}
                placeholder="Ej: 912345678"
              />
              {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Dirección</label>
              <input
                className={`form-control${errores.direccion ? " is-invalid" : ""}`}
                value={form.direccion}
                onChange={e => setForm({ ...form, direccion: e.target.value })}
                minLength={5}
                maxLength={60}
                placeholder="Ej: Av. Siempre Viva 123"
              />
              {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Región</label>
              <select
                className={`form-select${errores.region ? " is-invalid" : ""}`}
                value={form.region}
                onChange={e => setForm({ ...form, region: e.target.value, comuna: "" })}
                required
              >
                <option value="">Selecciona una región</option>
                {Object.keys(regionesYComunas).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {errores.region && <div className="invalid-feedback">{errores.region}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Comuna</label>
              <select
                className={`form-select${errores.comuna ? " is-invalid" : ""}`}
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
              {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
            </div>
            <button className="btn btn-success btn-lg w-100 mt-2" type="submit" disabled={loading || Object.keys(errores).length > 0}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-save me-2"></i>}
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}