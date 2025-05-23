import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

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
            navigate('/home');
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