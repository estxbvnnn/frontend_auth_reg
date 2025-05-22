import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Correo de restablecimiento enviado.');
            setError('');
        } catch (err) {
            setError('No se pudo enviar el correo.');
            setMessage('');
        }
    };

    return (
        <div className="ecofood-form-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    minLength={5}
                    maxLength={50}
                />
                <button type="submit">Enviar correo de restablecimiento</button>
            </form>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <p>
                <Link to="/login">Volver al login</Link>
            </p>
        </div>
    );
};

export default PasswordResetForm;