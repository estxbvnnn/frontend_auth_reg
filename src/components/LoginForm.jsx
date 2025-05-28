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
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setShowVerifyMessage(false);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified) {
                await signOut(auth);
                setShowVerifyMessage(true);
                return;
            }
            // Obtener datos de Firestore
            const docRef = doc(db, 'usuarios', userCredential.user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const datos = docSnap.data();
                if (datos.userType === "admin" || datos.tipo === "admin") {
                    navigate("/admin");
                } else if (datos.userType === "cliente" || datos.tipo === "cliente") {
                    navigate("/home");
                } else {
                    setError("Tipo de usuario no permitido.");
                }
            } else {
                setError("No se encontraron datos de usuario.");
            }
        } catch (err) {
            setError('Usuario o contraseña incorrectos. Si ya te registraste, revisa tu correo y confirma tu cuenta.');
        }
    };

    return (
        <div className="ecofood-form-container">
            <form onSubmit={handleLogin}>
                <h2 className="ecofood-login-title">Login</h2>
                {error && <p className="error">{error}</p>}
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
                {!showVerifyMessage && (
                    <>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                minLength={5}
                                maxLength={50}
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                maxLength={30}
                            />
                        </div>
                        <button type="submit">Login</button>
                    </>
                )}
            </form>
            <p>
                <Link to="/password-reset">¿Olvidaste tu contraseña?</Link>
            </p>
            <p>
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
            <p>
                <Link to="/" style={{ fontWeight: "bold" }}>Ir al inicio</Link>
            </p>
        </div>
    );
};

export default LoginForm;