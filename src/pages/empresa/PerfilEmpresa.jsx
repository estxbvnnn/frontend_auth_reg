import React, { useState, useEffect } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import empresaAvatar from "../../assets/img/frutita.jpg";
import { regiones, regionesYComunas } from "../../components/regionesComunas";

export default function PerfilEmpresa() {
    const { userData, loading } = useAuth();
    const [empresa, setEmpresa] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const [error, setError] = useState("");
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({
        nombre: "",
        direccion: "",
        region: "",
        comuna: "",
        rut: "",
        email: "",
        telefono: "",
        contacto: ""
    });
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!userData || !userData.uid) {
            setLocalLoading(false);
            setError("No hay datos de usuario autenticado.");
            return;
        }
        setLocalLoading(true);
        getDoc(doc(db, "empresas", userData.uid))
            .then((docSnap) => {
                if (docSnap.exists()) {
                    setEmpresa(docSnap.data());
                    setError("");
                } else {
                    setEmpresa(null);
                    setError("No tienes perfil de empresa registrado.");
                }
                setLocalLoading(false);
            })
            .catch(() => {
                setError("Error al cargar datos de empresa.");
                setLocalLoading(false);
            });
    }, [userData, loading]);

    useEffect(() => {
        if (form.region) {
            setComunasDisponibles(regionesYComunas[form.region] || []);
        } else {
            setComunasDisponibles([]);
        }
    }, [form.region]);

    if (loading || localLoading) return <div style={{ color: "blue" }}>Cargando perfil empresa...</div>;
    if (error) return <div className="ecofood-form-container empresa-form-custom"><div className="error">{error}</div></div>;
    if (!empresa) return <div className="ecofood-form-container empresa-form-custom"><div className="error">No tienes perfil de empresa registrado.</div></div>;

    return (
        <div
            className="ecofood-form-container empresa-form-custom shadow-lg p-4 bg-white rounded-4"
            style={{ maxWidth: 900, margin: "40px auto", border: "1px solid #e0f2f1" }}
        >
            <div className="d-flex flex-column flex-md-row align-items-center mb-4 pb-3 border-bottom">
                <img
                    src={empresaAvatar}
                    alt="Logo Empresa"
                    className="rounded-circle shadow"
                    style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        border: "5px solid #43e97b",
                        marginRight: 36,
                        background: "#fff"
                    }}
                />
                <div>
                    <h2 className="mb-1 titulo-verde" style={{ fontWeight: 800, fontSize: 32 }}>{empresa.nombre}</h2>
                    <div className="text-muted mb-2" style={{ fontSize: 18 }}>
                        <i className="bi bi-geo-alt-fill me-2"></i>
                        {empresa.direccion}, {empresa.comuna}, {empresa.region}
                    </div>
                    <span className="badge bg-gradient-ecofood px-3 py-2" style={{ fontSize: 16, fontWeight: 500 }}>
                        <i className="bi bi-building me-1"></i> Empresa EcoFood
                    </span>
                </div>
            </div>
            {!edit ? (
                <>
                    <div className="row g-4 mb-3">
                        <div className="col-md-6">
                            <div className="mb-2"><b>RUT:</b> <span className="text-dark">{empresa.rut}</span></div>
                            <div className="mb-2"><b>Email:</b> <span className="text-dark">{empresa.email}</span></div>
                            <div className="mb-2"><b>Teléfono:</b> <span className="text-dark">{empresa.telefono}</span></div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-2"><b>Contacto:</b> <span className="text-dark">{empresa.contacto}</span></div>
                            <div className="mb-2"><b>Región:</b> <span className="text-dark">{empresa.region}</span></div>
                            <div className="mb-2"><b>Comuna:</b> <span className="text-dark">{empresa.comuna}</span></div>
                        </div>
                    </div>
                    <div className="d-flex gap-3 mt-3 justify-content-end">
                        <button className="btn btn-success empresa-form-btn px-4" onClick={() => {
                            setForm({
                                nombre: empresa.nombre,
                                direccion: empresa.direccion,
                                region: empresa.region,
                                comuna: empresa.comuna,
                                rut: empresa.rut,
                                email: empresa.email,
                                telefono: empresa.telefono,
                                contacto: empresa.contacto
                            });
                            setEdit(true);
                        }}>
                            <i className="bi bi-pencil-square me-1"></i>Editar Perfil
                        </button>
                        <button
                            className="btn btn-outline-secondary px-4"
                            onClick={() => navigate("/home")}
                        >
                            <i className="bi bi-arrow-left me-1"></i>Volver al inicio
                        </button>
                    </div>
                </>
            ) : (
                <form className="row g-3" onSubmit={async (e) => {
                    e.preventDefault();
                    await setDoc(doc(db, "empresas", userData.uid), { ...empresa, ...form });
                    setEmpresa({ ...empresa, ...form });
                    setEdit(false);
                    Swal.fire("Perfil actualizado", "", "success");
                }}>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-success">Nombre</label>
                        <div className="input-group">
                            <span className="input-group-text bg-success text-white">
                                <i className="bi bi-building"></i>
                            </span>
                            <input
                                className="form-control bg-white"
                                value={form.nombre}
                                onChange={e => setForm({ ...form, nombre: e.target.value })}
                                required
                                minLength={3}
                                maxLength={60}
                                placeholder="Nombre de la empresa"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-success">RUT</label>
                        <div className="input-group">
                            <span className="input-group-text bg-success text-white">
                                <i className="bi bi-credit-card-2-front"></i>
                            </span>
                            <input
                                className="form-control bg-white"
                                value={form.rut}
                                onChange={e => setForm({ ...form, rut: e.target.value })}
                                required
                                maxLength={10}
                                placeholder="RUT (Ej: 12345678-9)"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-success">Dirección</label>
                        <div className="input-group">
                            <span className="input-group-text bg-success text-white">
                                <i className="bi bi-geo-alt"></i>
                            </span>
                            <input
                                className="form-control bg-white"
                                value={form.direccion}
                                onChange={e => setForm({ ...form, direccion: e.target.value })}
                                required
                                minLength={5}
                                maxLength={80}
                                placeholder="Dirección"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-success">Región</label>
                        <div className="input-group">
                            <span className="input-group-text bg-success text-white">
                                <i className="bi bi-globe"></i>
                            </span>
                            <select
                                className="form-select bg-white"
                                value={form.region}
                                onChange={e => setForm({ ...form, region: e.target.value, comuna: "" })}
                                required
                            >
                                <option value="">Seleccione una región</option>
                                {regiones.map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-success">Comuna</label>
                        <div className="input-group">
                            <span className="input-group-text bg-success text-white">
                                <i className="bi bi-geo"></i>
                            </span>
                            <select
                                className="form-select bg-white"
                                value={form.comuna}
                                onChange={e => setForm({ ...form, comuna: e.target.value })}
                                required
                                disabled={!form.region}
                            >
                                <option value="">Seleccione una comuna</option>
                                {comunasDisponibles.map(comuna => (
                                    <option key={comuna} value={comuna}>{comuna}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-success">Correo electrónico</label>
                        <div className="input-group">
                            <span className="input-group-text bg-success text-white">
                                <i className="bi bi-envelope"></i>
                            </span>
                            <input
                                className="form-control bg-white"
                                type="email"
                                value={form.email}
                                readOnly
                                disabled
                                placeholder="Correo electrónico"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-success">Teléfono</label>
                        <div className="input-group">
                            <span className="input-group-text bg-success text-white">
                                <i className="bi bi-telephone"></i>
                            </span>
                            <input
                                className="form-control bg-white"
                                value={form.telefono}
                                onChange={e => setForm({ ...form, telefono: e.target.value })}
                                required
                                minLength={8}
                                maxLength={15}
                                placeholder="Teléfono"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-success">Contacto</label>
                        <div className="input-group">
                            <span className="input-group-text bg-success text-white">
                                <i className="bi bi-person"></i>
                            </span>
                            <input
                                className="form-control bg-white"
                                value={form.contacto}
                                onChange={e => setForm({ ...form, contacto: e.target.value })}
                                required
                                minLength={3}
                                maxLength={50}
                                placeholder="Nombre de contacto"
                            />
                        </div>
                    </div>
                    <div className="d-flex gap-3 mt-4 justify-content-end">
                        <button className="btn btn-success empresa-form-btn px-4" type="submit">
                            <i className="bi bi-save me-1"></i>Guardar
                        </button>
                        <button className="btn btn-secondary empresa-form-btn px-4" type="button" onClick={() => setEdit(false)}>
                            Cancelar
                        </button>
                        <button
                            className="btn btn-outline-secondary px-4"
                            type="button"
                            onClick={() => navigate("/home")}
                        >
                            <i className="bi bi-arrow-left me-1"></i>Volver al inicio
                        </button>
                    </div>
                </form>
            )}
            <style>{`
                .bg-gradient-ecofood {
                    background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%) !important;
                    color: #fff !important;
                    border: none;
                }
                .empresa-form-custom {
                    border-radius: 22px;
                    border: 1px solid #e0f2f1;
                }
                .titulo-verde {
                    color: #43a047;
                }
                .empresa-form-btn {
                    border-radius: 30px;
                    font-weight: 600;
                }
                .form-label {
                    font-size: 1rem;
                }
                .input-group-text {
                    border-radius: 30px 0 0 30px;
                }
                .form-control, .form-select, textarea {
                    border-radius: 0 30px 30px 0;
                }
            `}</style>
        </div>
    );
}