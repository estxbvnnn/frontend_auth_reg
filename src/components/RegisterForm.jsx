import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { regiones, regionesYComunas } from './regionesComunas';

const RegisterForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [region, setRegion] = useState('');
    const [commune, setCommune] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial.');
            return;
        }
        if (phone && !/^\d{8,15}$/.test(phone)) {
            setError('El teléfono debe contener solo números y tener entre 8 y 15 dígitos.');
            return;
        }
        if (!region || !commune) {
            setError('Debes seleccionar una región y una comuna.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
            setSuccess('Registro exitoso. Verifica tu correo.');
        } catch (error) {
            setError('No se pudo registrar. Intenta con otro correo.');
        }
    };

    return (
        <div className="ecofood-form-container empresa-form-custom">
            <form onSubmit={handleRegister}>
                <h2 className="empresa-form-title">Registro</h2>
                {error && <div className="error">{error}</div>}
                {success && (
                    <div className="success">
                        {success}
                        <br />
                        <Link to="/login" style={{ color: '#388e3c', fontWeight: 'bold' }}>
                            <i className="bi bi-box-arrow-in-right me-1"></i>Ir a iniciar sesión
                        </Link>
                    </div>
                )}
                {!success && (
                    <>
                        <div className="mb-3">
                            <label className="form-label fw-bold text-success">Nombre completo</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="bi bi-person-fill text-success"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-white"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    minLength={3}
                                    maxLength={50}
                                    placeholder="Nombre completo"
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold text-success">Correo electrónico</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="bi bi-envelope-fill text-success"></i>
                                </span>
                                <input
                                    type="email"
                                    className="form-control bg-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    minLength={5}
                                    maxLength={50}
                                    placeholder="Correo electrónico"
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold text-success">Contraseña</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="bi bi-lock-fill text-success"></i>
                                </span>
                                <input
                                    type="password"
                                    className="form-control bg-white"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    maxLength={30}
                                    placeholder="Contraseña"
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold text-success">Dirección</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="bi bi-geo-alt-fill text-success"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-white"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    minLength={5}
                                    maxLength={60}
                                    placeholder="Dirección"
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold text-success">Región</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="bi bi-globe text-success"></i>
                                </span>
                                <select
                                    className="form-select"
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
                        <div className="mb-3">
                            <label className="form-label fw-bold text-success">Comuna</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="bi bi-geo-fill text-success"></i>
                                </span>
                                <select
                                    className="form-select"
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
                        <div className="mb-3">
                            <label className="form-label fw-bold text-success">Teléfono (opcional)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="bi bi-telephone-fill text-success"></i>
                                </span>
                                <input
                                    type="tel"
                                    className="form-control bg-white"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                    minLength={8}
                                    maxLength={15}
                                    placeholder="Teléfono"
                                />
                            </div>
                        </div>
                        <button type="submit" className="empresa-form-btn">
                            <i className="bi bi-person-plus-fill me-2"></i>Registrar
                        </button>
                    </>
                )}
            </form>
            <div style={{ marginTop: 16 }}>
                ¿Ya tienes cuenta? <Link to="/login"><i className="bi bi-box-arrow-in-right me-1"></i>Inicia sesión</Link>
                <br />
                <Link to="/" style={{ fontWeight: "bold" }}><i className="bi bi-house-door-fill me-1"></i>Ir al inicio</Link>
            </div>
        </div>
    );
};

export default RegisterForm;