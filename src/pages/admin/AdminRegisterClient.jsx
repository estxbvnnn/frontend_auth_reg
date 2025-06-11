import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, firebaseConfig } from '../../firebase/config';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { regiones, regionesYComunas } from '../../components/regionesComunas';

const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

const AdminRegisterClient = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [region, setRegion] = useState('');
    const [commune, setCommune] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            setEditMode(true);
            getDoc(doc(db, 'usuarios', id)).then(docSnap => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFullName(data.fullName || '');
                    setEmail(data.email || '');
                    setAddress(data.address || '');
                    setRegion(data.region || '');
                    setCommune(data.commune || '');
                    setPhone(data.phone || '');
                }
            });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!fullName || !email || (!editMode && !password) || !address || !region || !commune) {
            setError('Todos los campos son obligatorios (excepto teléfono).');
            setLoading(false);
            return;
        }
        if (fullName.length < 3 || fullName.length > 50) {
            setError('El nombre debe tener entre 3 y 50 caracteres.');
            setLoading(false);
            return;
        }
        if (address.length < 5 || address.length > 60) {
            setError('La dirección debe tener entre 5 y 60 caracteres.');
            setLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Email inválido');
            setLoading(false);
            return;
        }
        if (phone && !/^\d{8,15}$/.test(phone)) {
            setError('El teléfono debe contener solo números y tener entre 8 y 15 dígitos.');
            setLoading(false);
            return;
        }
        if (!editMode) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
            if (!passwordRegex.test(password)) {
                setError('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial.');
                setLoading(false);
                return;
            }
        }

        try {
            if (editMode) {
                await setDoc(doc(db, 'usuarios', id), {
                    fullName,
                    email,
                    address,
                    region,
                    commune,
                    phone,
                    userType: 'cliente'
                });
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: 'Usuario actualizado correctamente.',
                    confirmButtonColor: '#43a047'
                }).then(() => navigate('/admin/clientes'));
            } else {
                const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
                const user = userCredential.user;
                await setDoc(doc(db, 'usuarios', user.uid), {
                    fullName,
                    email,
                    address,
                    region,
                    commune,
                    phone,
                    userType: 'cliente'
                });
                await sendEmailVerification(user);
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: '¡Creado!',
                    text: 'Cliente registrado exitosamente. El cliente debe verificar su correo.',
                    confirmButtonColor: '#43a047'
                }).then(() => {
                    setFullName('');
                    setEmail('');
                    setPassword('');
                    setAddress('');
                    setRegion('');
                    setCommune('');
                    setPhone('');
                    secondaryAuth.signOut();
                    navigate('/admin/clientes');
                });
            }
        } catch (error) {
            setError('No se pudo registrar/actualizar. Intenta con otro correo.');
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="ecofood-form-container empresa-form-custom shadow-lg p-4 bg-white rounded" style={{ maxWidth: 600, margin: "40px auto" }}>
                <h2 className="empresa-form-title mb-4">{editMode ? 'Editar Usuario' : 'Registrar Usuario'}</h2>
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
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
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
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    minLength={5}
                                    maxLength={50}
                                    placeholder="Correo electrónico"
                                    disabled={editMode}
                                />
                            </div>
                        </div>
                        {!editMode && (
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-success">Contraseña</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-success text-white">
                                        <i className="bi bi-lock-fill"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control bg-white"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        maxLength={30}
                                        placeholder="Contraseña"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-success">Dirección</label>
                            <div className="input-group">
                                <span className="input-group-text bg-success text-white">
                                    <i className="bi bi-geo-alt-fill"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-white"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    required
                                    minLength={5}
                                    maxLength={60}
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
                                    value={region}
                                    onChange={e => {
                                        setRegion(e.target.value);
                                        setCommune('');
                                    }}
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
                                    className="form-select bg-white"
                                    value={commune}
                                    onChange={e => setCommune(e.target.value)}
                                    required
                                    disabled={!region}
                                >
                                    <option value="">Selecciona una comuna</option>
                                    {region && regionesYComunas[region].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-success">Teléfono (opcional)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-success text-white">
                                    <i className="bi bi-telephone-fill"></i>
                                </span>
                                <input
                                    type="tel"
                                    className="form-control bg-white"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                                    minLength={8}
                                    maxLength={15}
                                    placeholder="Teléfono"
                                />
                            </div>
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
                                {editMode ? 'Actualizar' : 'Registrar'}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminRegisterClient;