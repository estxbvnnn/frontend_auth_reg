import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/config';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doc, setDoc, getDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const regionesYComunas = {
    "Región de Coquimbo": [
        "La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña",
        "Illapel", "Canela", "Los Vilos", "Salamanca",
        "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"
    ],
    "Región de Valparaíso": [
        "Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "Quillota", "San Antonio",
        "Los Andes", "San Felipe", "La Ligua", "Petorca", "Papudo", "Zapallar", "Puchuncaví",
        "Casablanca", "Juan Fernández", "Isla de Pascua"
    ],
    "Región Metropolitana de Santiago": [
        "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia",
        "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea",
        "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia",
        "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón",
        "Santiago", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil",
        "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto",
        "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"
    ]
};
const regiones = Object.keys(regionesYComunas);

const EmpresaForm = () => {
    const [empresa, setEmpresa] = useState({
        nombre: '',
        rut: '',
        direccion: '',
        region: '',
        comuna: '',
        email: '',
        telefono: '',
        contacto: '',
        productos: []
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const formRef = useRef(null);

    useEffect(() => {
        if (id) {
            getDoc(doc(db, 'empresas', id)).then(docSnap => {
                if (docSnap.exists()) setEmpresa(docSnap.data());
            });
        }
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'nombre') newValue = value.slice(0, 60);
        if (name === 'direccion') newValue = value.slice(0, 80);
        if (name === 'email') newValue = value.slice(0, 60);
        if (name === 'telefono') newValue = value.replace(/\D/g, '').slice(0, 9); 
        if (name === 'contacto') newValue = value.slice(0, 50);
        if (name === 'rut') newValue = value.replace(/[^0-9kK-]/g, '').slice(0, 10);
        if (name === 'region') {
            setEmpresa({ ...empresa, region: newValue, comuna: '' });
            return;
        }
        setEmpresa({ ...empresa, [name]: newValue });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (
            !empresa.nombre ||
            !empresa.rut ||
            !empresa.direccion ||
            !empresa.region ||
            !empresa.comuna ||
            !empresa.email ||
            !empresa.telefono ||
            !empresa.contacto
        ) {
            Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
            scrollToError();
            return;
        }
        try {
            let emailExists = false;
            let rutExists = false;

            const empresasSnap = await getDocs(collection(db, 'empresas'));
            empresasSnap.forEach(docu => {
                if (id && docu.id === id) return;
                const data = docu.data();
                if (data.email === empresa.email.trim()) emailExists = true;
                if (data.rut === empresa.rut) rutExists = true;
            });

            const usuariosSnap = await getDocs(collection(db, 'usuarios'));
            usuariosSnap.forEach(docu => {
                const data = docu.data();
                if (data.email === empresa.email.trim()) emailExists = true;
                if (data.rut === empresa.rut) rutExists = true;
            });

            if (emailExists) {
                Swal.fire('Error', 'El correo ya está registrado en otra empresa o usuario.', 'error');
                scrollToError();
                return;
            }
            if (rutExists) {
                Swal.fire('Error', 'El RUT ya está registrado en otra empresa o usuario.', 'error');
                scrollToError();
                return;
            }

            if (id) {
                await setDoc(doc(db, 'empresas', id), empresa);
            } else {
                await addDoc(collection(db, 'empresas'), empresa);
            }
            Swal.fire('¡Éxito!', id ? 'Empresa actualizada correctamente.' : 'Empresa creada correctamente.', 'success')
                .then(() => navigate('/admin/empresas'));
        } catch {
            Swal.fire('Error', 'Error al guardar', 'error');
            scrollToError();
        }
    };

    const scrollToError = () => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div
                className="ecofood-form-container empresa-form-custom shadow-lg p-4 bg-white rounded"
                style={{
                    maxWidth: 1000,
                    margin: "40px auto",
                    padding: "56px 48px 40px 48px"
                }}
            >
                <form onSubmit={handleSubmit} ref={formRef}>
                    <h2 className="empresa-form-title mb-4">{id ? 'Editar Empresa' : 'Registrar Nueva Empresa'}</h2>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-success">Nombre de la empresa</label>
                            <div className="input-group">
                                <span className="input-group-text bg-success text-white">
                                    <i className="bi bi-building"></i>
                                </span>
                                <input
                                    className="form-control"
                                    name="nombre"
                                    value={empresa.nombre}
                                    onChange={handleChange}
                                    placeholder="Nombre de la empresa"
                                    required
                                    minLength={3}
                                    maxLength={60}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-success">Persona de contacto</label>
                            <div className="input-group">
                                <span className="input-group-text bg-success text-white">
                                    <i className="bi bi-person"></i>
                                </span>
                                <input
                                    className="form-control"
                                    name="contacto"
                                    value={empresa.contacto}
                                    onChange={handleChange}
                                    placeholder="Nombre de la persona de contacto"
                                    required
                                    minLength={3}
                                    maxLength={50}
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
                                    className="form-control"
                                    name="rut"
                                    value={empresa.rut}
                                    onChange={handleChange}
                                    placeholder="RUT (Ej: 12345678-9 o 123456789)"
                                    required
                                    maxLength={10}
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
                                    className="form-control"
                                    name="direccion"
                                    value={empresa.direccion}
                                    onChange={handleChange}
                                    placeholder="Dirección"
                                    required
                                    minLength={5}
                                    maxLength={80}
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
                                    className="form-select"
                                    name="region"
                                    value={empresa.region}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona una región</option>
                                    {regiones.map(r => (
                                        <option key={r} value={r}>{r}</option>
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
                                    className="form-select"
                                    name="comuna"
                                    value={empresa.comuna}
                                    onChange={handleChange}
                                    required
                                    disabled={!empresa.region}
                                >
                                    <option value="">Selecciona una comuna</option>
                                    {empresa.region && regionesYComunas[empresa.region].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Agrupamos correo y teléfono en una fila para que se vean igual que los demás */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-success">Correo electrónico</label>
                            <div className="input-group">
                                <span className="input-group-text bg-success text-white">
                                    <i className="bi bi-envelope"></i>
                                </span>
                                <input
                                    className="form-control"
                                    name="email"
                                    value={empresa.email}
                                    onChange={handleChange}
                                    placeholder="Correo electrónico"
                                    required
                                    type="email"
                                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                    title="Ingresa un solo correo electrónico válido"
                                    autoComplete="off"
                                    maxLength={60}
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
                                    className="form-control"
                                    name="telefono"
                                    value={empresa.telefono}
                                    onChange={handleChange}
                                    placeholder="Teléfono (9 dígitos, ej: 956264642)"
                                    required
                                    minLength={9}
                                    maxLength={9}
                                    type="tel"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column flex-md-row gap-3 mt-4">
                        <button type="submit" className="btn btn-success empresa-form-btn flex-fill">
                            {id ? 'Actualizar' : 'Registrar Empresa'}
                        </button>
                        {id && (
                            <Link
                                to={`/admin/empresas/${id}/productos`}
                                className="btn btn-outline-primary empresa-form-btn flex-fill"
                                style={{ textAlign: 'center' }}
                            >
                                Ver productos
                            </Link>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmpresaForm;