import React, { useState, useEffect, useRef } from 'react';
import { db, firebaseConfig } from '../../firebase/config';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { regiones, regionesYComunas } from '../../components/regionesComunas';

const secondaryApp = initializeApp(firebaseConfig, "SecondaryEmpresa");
const secondaryAuth = getAuth(secondaryApp);

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
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        setError('');
        setSuccess('');

        if (
            !empresa.nombre ||
            !empresa.rut ||
            !empresa.direccion ||
            !empresa.region ||
            !empresa.comuna ||
            !empresa.email ||
            !empresa.telefono ||
            !empresa.contacto ||
            (!id && !password)
        ) {
            setError('Todos los campos son obligatorios');
            scrollToError();
            return;
        }
        if (!id) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
            if (!passwordRegex.test(password)) {
                setError('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial.');
                scrollToError();
                return;
            }
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
                setError('El correo ya está registrado en otra empresa o usuario.');
                scrollToError();
                return;
            }
            if (rutExists) {
                setError('El RUT ya está registrado en otra empresa o usuario.');
                scrollToError();
                return;
            }

            if (id) {
                await setDoc(doc(db, 'empresas', id), empresa);
                Swal.fire('¡Éxito!', 'Empresa actualizada correctamente.', 'success')
                    .then(() => navigate('/admin/empresas'));
            } else {
                // 1. Crear usuario en Auth
                const userCredential = await createUserWithEmailAndPassword(secondaryAuth, empresa.email, password);
                const user = userCredential.user;

                // 2. Guardar empresa en Firestore con el UID
                await setDoc(doc(db, 'empresas', user.uid), {
                    ...empresa,
                    userType: 'empresa'
                });

                // 3. Guardar también en la colección usuarios (para login y saludo)
                await setDoc(doc(db, 'usuarios', user.uid), {
                    fullName: empresa.contacto,
                    email: empresa.email,
                    userType: 'empresa',
                    rut: empresa.rut,
                    direccion: empresa.direccion,
                    region: empresa.region,
                    comuna: empresa.comuna,
                    telefono: empresa.telefono,
                    contacto: empresa.contacto
                });

                // 4. Enviar correo de verificación
                await sendEmailVerification(user);

                await Swal.fire({
                    icon: 'success',
                    title: '¡Empresa registrada!',
                    text: 'Verifica el correo de la empresa para poder ingresar.',
                    confirmButtonColor: '#43a047'
                });

                setEmpresa({
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
                setPassword('');
                await secondaryAuth.signOut();
                navigate('/admin/empresas');
            }
        } catch (err) {
            setError('No se pudo registrar. Intenta con otro correo.');
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
                    {error && <div className="ecofood-form-container error">{error}</div>}
                    {success && <div className="ecofood-form-container success">{success}</div>}
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-success">Nombre de la empresa</label>
                            <div className="input-group">
                                <span className="input-group-text bg-success text-white">
                                    <i className="bi bi-building"></i>
                                </span>
                                <input
                                    className="form-control bg-white"
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
                                    className="form-control bg-white"
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
                                    className="form-control bg-white"
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
                                    className="form-control bg-white"
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
                                    className="form-select bg-white"
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
                                    className="form-select bg-white"
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
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-success">Correo electrónico</label>
                            <div className="input-group">
                                <span className="input-group-text bg-success text-white">
                                    <i className="bi bi-envelope"></i>
                                </span>
                                <input
                                    className="form-control bg-white"
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
                                    className="form-control bg-white"
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
                        {!id && (
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
                                        placeholder="Contraseña para acceso a EcoFood"
                                    />
                                </div>
                            </div>
                        )}
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