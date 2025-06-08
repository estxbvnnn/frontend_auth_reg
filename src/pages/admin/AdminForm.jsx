import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const AdminForm = () => {
    const [admin, setAdmin] = useState({ fullName: '', email: '', isMain: false, userType: 'admin' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getDoc(doc(db, 'usuarios', id)).then(docSnap => {
                if (docSnap.exists()) setAdmin(docSnap.data());
            });
        }
    }, [id]);

    const handleChange = e => setAdmin({ ...admin, [e.target.name]: e.target.value });
    const handleCheckbox = e => setAdmin({ ...admin, isMain: e.target.checked });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (!admin.fullName || !admin.email) {
            setError('Nombre y email son obligatorios');
            setLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) {
            setError('Email inválido');
            setLoading(false);
            return;
        }
        if (admin.fullName.length < 3 || admin.fullName.length > 50) {
            setError('El nombre debe tener entre 3 y 50 caracteres');
            setLoading(false);
            return;
        }
        try {
            if (id) {
                await setDoc(doc(db, 'usuarios', id), admin);
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: 'Administrador actualizado correctamente.',
                    confirmButtonColor: '#43a047'
                }).then(() => navigate('/admin/administradores'));
            } else {
                await addDoc(collection(db, 'usuarios'), admin);
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: '¡Creado!',
                    text: 'Administrador creado correctamente.',
                    confirmButtonColor: '#43a047'
                }).then(() => navigate('/admin/administradores'));
            }
        } catch {
            setError('Error al guardar');
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="ecofood-form-container empresa-form-custom shadow-lg p-4 bg-white rounded" style={{ maxWidth: 600, margin: "40px auto" }}>
                <h2 className="empresa-form-title mb-4">{id ? 'Editar Administrador' : 'Registrar Administrador'}</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="ecofood-form-container error">{error}</div>}
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-success">Nombre completo</label>
                            <div className="input-group">
                                <span className="input-group-text bg-success text-white">
                                    <i className="bi bi-person-fill"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-white"
                                    name="fullName"
                                    value={admin.fullName}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    maxLength={50}
                                    placeholder="Nombre completo"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-success">Correo electrónico</label>
                            <div className="input-group">
                                <span className="input-group-text bg-success text-white">
                                    <i className="bi bi-envelope-fill"></i>
                                </span>
                                <input
                                    type="email"
                                    className="form-control bg-white"
                                    name="email"
                                    value={admin.email}
                                    onChange={handleChange}
                                    required
                                    minLength={5}
                                    maxLength={50}
                                    placeholder="Correo electrónico"
                                    disabled={!!id}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 d-flex align-items-center">
                            <input
                                className="form-check-input me-2"
                                type="checkbox"
                                id="isMain"
                                checked={admin.isMain}
                                onChange={handleCheckbox}
                                disabled={!!id}
                            />
                            <label className="form-check-label fw-bold text-success" htmlFor="isMain">
                                Administrador principal
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-success empresa-form-btn w-100 mt-4"
                        disabled={loading}
                    >
                        {loading ? (
                            <span>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Guardando...
                            </span>
                        ) : (
                            <>
                                <i className="bi bi-person-plus-fill me-2"></i>
                                {id ? 'Actualizar' : 'Registrar'}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminForm;