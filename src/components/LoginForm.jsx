import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showVerifyMessage, setShowVerifyMessage] = useState(false);
    const [loadingUserData, setLoadingUserData] = useState(false);
    const navigate = useNavigate();

    const fetchUserDataWithRetry = async (uid, retries = 3, delay = 500) => {
        for (let i = 0; i < retries; i++) {
            const docRef = doc(db, 'usuarios', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) return docSnap.data();
            await new Promise(res => setTimeout(res, delay));
        }
        return null;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setShowVerifyMessage(false);
        setLoadingUserData(false);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified) {
                await signOut(auth);
                setShowVerifyMessage(true);
                return;
            }
            setLoadingUserData(true);

            const datos = await fetchUserDataWithRetry(userCredential.user.uid, 3, 500);

            setLoadingUserData(false);

            if (datos) {
                if (datos.userType === "admin" || datos.tipo === "admin") {
                    navigate("/admin");
                } else if (datos.userType === "cliente" || datos.tipo === "cliente") {
                    navigate("/home");
                } else if (datos.userType === "empresa" || datos.tipo === "empresa") {
                    navigate("/home");
                } else {
                    setError("Tipo de usuario no permitido.");
                }
            } else {
                setError("No se encontraron datos de usuario. Si recién te registraste, espera unos segundos y vuelve a intentar.");
            }
        } catch (err) {
            setError('Usuario o contraseña incorrectos. Si ya te registraste, revisa tu correo y confirma tu cuenta.');
        }
    };

    return (
        <div className="ecofood-form-container empresa-form-custom">
            <form onSubmit={handleLogin}>
                <h2 className="empresa-form-title">Login</h2>
                {error && <div className="error">{error}</div>}
                {showVerifyMessage && (
                    <div className="success">
                        <p>Verifica tu correo antes de ingresar.</p>
                        <button
                            style={{
                                background: '#388e3c',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '10px 24px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                marginTop: '12px'
                            }}
                            type="button"
                            onClick={() => navigate('/')}
                        >
                            Ir al inicio
                        </button>
                    </div>
                )}
                {loadingUserData && (
                    <div className="success">
                        <p>Cargando datos de usuario...</p>
                    </div>
                )}
                {!showVerifyMessage && !loadingUserData && (
                    <>
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
                                    minLength={6}
                                    maxLength={30}
                                    placeholder="Contraseña"
                                />
                            </div>
                        </div>
                        <button type="submit" className="empresa-form-btn">
                            <i className="bi bi-box-arrow-in-right me-2"></i>Login
                        </button>
                    </>
                )}
            </form>
            <div style={{ marginTop: 16 }}>
                <Link to="/password-reset"><i className="bi bi-question-circle me-1"></i>¿Olvidaste tu contraseña?</Link>
                <br />
                ¿No tienes cuenta? <Link to="/register"><i className="bi bi-person-plus-fill me-1"></i>Regístrate</Link>
                <br />
                <Link to="/" style={{ fontWeight: "bold" }}><i className="bi bi-house-door-fill me-1"></i>Ir al inicio</Link>
            </div>
        </div>
    );
};

export default LoginForm;