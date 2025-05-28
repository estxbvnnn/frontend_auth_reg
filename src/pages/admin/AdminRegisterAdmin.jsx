import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, firebaseConfig } from '../../firebase/config';

const secondaryApp = initializeApp(firebaseConfig, "SecondaryAdmin");
const secondaryAuth = getAuth(secondaryApp);

const AdminRegisterAdmin = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isMain, setIsMain] = useState(false);
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

        try {
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'usuarios', user.uid), {
                fullName,
                email,
                isMain,
                userType: 'admin'
            });

            await sendEmailVerification(user);
            setSuccess('Administrador registrado exitosamente. El administrador debe verificar su correo.');
            setFullName('');
            setEmail('');
            setPassword('');
            setIsMain(false);
            await secondaryAuth.signOut();
        } catch (error) {
            setError('No se pudo registrar. Intenta con otro correo.');
        }
    };

    return (
        <div className="ecofood-form-container">
            <h2>Registrar Administrador</h2>
            <form onSubmit={handleRegister}>
                {error && <p className="error">{error}</p>}
                {success && <div className="success">{success}</div>}
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
                        <label style={{ display: 'block', margin: '10px 0', textAlign: 'left' }}>
                            <input
                                type="checkbox"
                                checked={isMain}
                                onChange={e => setIsMain(e.target.checked)}
                                style={{ marginRight: 8 }}
                            />
                            Administrador principal (no se podrá eliminar)
                        </label>
                        <button type="submit">Registrar Administrador</button>
                    </>
                )}
            </form>
        </div>
    );
};

export default AdminRegisterAdmin;