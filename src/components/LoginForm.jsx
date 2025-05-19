import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showVerifyMessage, setShowVerifyMessage] = useState(false);
    const history = useHistory();

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
            history.push('/home');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="ecofood-form-container">
            <form onSubmit={handleLogin}>
                <h2 className="ecofood-login-title">Login</h2>
                {error && <p className="error">{error}</p>}
                {showVerifyMessage && (
                    <div className="success">
                        <p>Tu correo electrónico ha sido verificado.</p>
                        <p>Puedes ingresar con tu cuenta.</p>
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
                            onClick={() => history.push('/')}
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
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Login</button>
                    </>
                )}
            </form>
            <p>
                <a href="/password-reset">¿Olvidaste tu contraseña?</a>
            </p>
            <p>
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
        </div>
    );
};

export default LoginForm;