import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';

const AdminForm = () => {
    const [admin, setAdmin] = useState({ fullName: '', email: '', isMain: false, userType: 'admin' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getDoc(doc(db, 'usuarios', id)).then(docSnap => {
                if (docSnap.exists()) setAdmin(docSnap.data());
            });
        }
    }, [id]);

    const handleChange = e => setAdmin({ ...admin, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        if (!admin.fullName || !admin.email) {
            setError('Nombre y email son obligatorios');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) {
            setError('Email inválido');
            return;
        }
        try {
            if (id) {
                await setDoc(doc(db, 'usuarios', id), admin);
            } else {
                await addDoc(collection(db, 'usuarios'), admin);
            }
            navigate('/admin/administradores');
        } catch {
            setError('Error al guardar');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <input name="fullName" value={admin.fullName} onChange={handleChange} placeholder="Nombre completo" required />
            <input name="email" value={admin.email} onChange={handleChange} placeholder="Email" required />
            <label>
                <input
                    type="checkbox"
                    checked={admin.isMain}
                    onChange={e => setAdmin({ ...admin, isMain: e.target.checked })}
                    disabled={!!id}
                />
                Administrador principal
            </label>
            <button type="submit">{id ? 'Actualizar' : 'Crear'}</button>
        </form>
    );
};

export default AdminForm;