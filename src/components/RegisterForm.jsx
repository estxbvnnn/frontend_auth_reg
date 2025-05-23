import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const RegisterForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [commune, setCommune] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validación de contraseña robusta
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial.');
            return;
        }

        // Validación de teléfono (opcional)
        if (phone && !/^\d{8,15}$/.test(phone)) {
            setError('El teléfono debe contener solo números y tener entre 8 y 15 dígitos.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'usuarios', user.uid), {
                fullName,
                email,
                address,
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
        <div className="ecofood-form-container">
            <form onSubmit={handleRegister}>
                {error && <p className="error">{error}</p>}
                {success && (
                    <div className="success">
                        {success}
                        <br />
                        <Link to="/login" style={{ color: '#388e3c', fontWeight: 'bold' }}>
                            Ir a iniciar sesión
                        </Link>
                    </div>
                )}
                {!success && (
                    <>
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            minLength={3}
                            maxLength={50}
                        />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            minLength={5}
                            maxLength={50}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            maxLength={30}
                        />
                        <input
                            type="text"
                            placeholder="Dirección"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            minLength={5}
                            maxLength={60}
                        />
                        <input
                            type="text"
                            placeholder="Comuna"
                            value={commune}
                            onChange={(e) => setCommune(e.target.value)}
                            required
                            minLength={3}
                            maxLength={30}
                        />
                        <input
                            type="tel"
                            placeholder="Teléfono (opcional)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            minLength={8}
                            maxLength={15}
                        />
                        <button type="submit">Registrar</button>
                    </>
                )}
            </form>
            <p>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
            <p>
                <Link to="/" style={{ fontWeight: "bold" }}>Ir al inicio</Link>
            </p>
        </div>
    );
};

export default RegisterForm;