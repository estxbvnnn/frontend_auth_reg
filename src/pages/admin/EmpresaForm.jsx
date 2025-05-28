import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';

const EmpresaForm = () => {
    const [empresa, setEmpresa] = useState({ nombre: '', rut: '', direccion: '', comuna: '', email: '', telefono: '', productos: [] });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getDoc(doc(db, 'empresas', id)).then(docSnap => {
                if (docSnap.exists()) setEmpresa(docSnap.data());
            });
        }
    }, [id]);

    const handleChange = e => setEmpresa({ ...empresa, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        // Validaciones
        if (!empresa.nombre || !empresa.rut || !empresa.direccion || !empresa.comuna || !empresa.email || !empresa.telefono) {
            setError('Todos los campos son obligatorios');
            return;
        }
        if (!/^\d{7,8}-[kK\d]$/.test(empresa.rut)) {
            setError('RUT inválido');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa.email)) {
            setError('Email inválido');
            return;
        }
        if (!/^\d{8,15}$/.test(empresa.telefono)) {
            setError('Teléfono inválido');
            return;
        }
        try {
            if (id) {
                await setDoc(doc(db, 'empresas', id), empresa);
            } else {
                await addDoc(collection(db, 'empresas'), empresa);
            }
            navigate('/admin/empresas');
        } catch {
            setError('Error al guardar');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <input name="nombre" value={empresa.nombre} onChange={handleChange} placeholder="Nombre" required />
            <input name="rut" value={empresa.rut} onChange={handleChange} placeholder="RUT" required />
            <input name="direccion" value={empresa.direccion} onChange={handleChange} placeholder="Dirección" required />
            <input name="comuna" value={empresa.comuna} onChange={handleChange} placeholder="Comuna" required />
            <input name="email" value={empresa.email} onChange={handleChange} placeholder="Email" required />
            <input name="telefono" value={empresa.telefono} onChange={handleChange} placeholder="Teléfono" required />
            <button type="submit">{id ? 'Actualizar' : 'Crear'}</button>
        </form>
    );
};

export default EmpresaForm;