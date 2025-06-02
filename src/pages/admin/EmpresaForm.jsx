import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/config';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doc, setDoc, getDoc, addDoc, collection, getDocs } from 'firebase/firestore';

const EmpresaForm = () => {
    const [empresa, setEmpresa] = useState({
        nombre: '',
        rut: '',
        direccion: '',
        comuna: '',
        email: '',
        telefono: '',
        contacto: '',
        productos: []
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const formRef = useRef(null);

    useEffect(() => {
        if (id) {
            getDoc(doc(db, 'empresas', id)).then(docSnap => {
                if (docSnap.exists()) setEmpresa(docSnap.data());
            });
        }
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'nombre') newValue = value.slice(0, 60);
        if (name === 'direccion') newValue = value.slice(0, 80);
        if (name === 'comuna') newValue = value.slice(0, 40);
        if (name === 'email') newValue = value.slice(0, 60);
        if (name === 'telefono') newValue = value.replace(/\D/g, '').slice(0, 9); // Solo 9 dígitos
        if (name === 'contacto') newValue = value.slice(0, 50);
        if (name === 'rut') {
            // Solo permite dígitos y un guion, máximo 10 caracteres (8 dígitos, guion, 1 dígito/verificador)
            newValue = value.replace(/[^0-9kK-]/g, '').slice(0, 10);
            // Solo un guion y no al principio
            newValue = newValue.replace(/(?!^)-/g, match => (newValue.indexOf('-') === match ? '-' : ''));
            // Si hay más de un guion, elimina los extras
            const parts = newValue.split('-');
            if (parts.length > 2) newValue = parts[0] + '-' + parts[1];
        }
        setEmpresa({ ...empresa, [name]: newValue });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        // Validaciones
        if (
            !empresa.nombre ||
            !empresa.rut ||
            !empresa.direccion ||
            !empresa.comuna ||
            !empresa.email ||
            !empresa.telefono ||
            !empresa.contacto
        ) {
            setError('Todos los campos son obligatorios');
            scrollToError();
            return;
        }
        if (empresa.nombre.length < 3 || empresa.nombre.length > 60) {
            setError('El nombre de la empresa debe tener entre 3 y 60 caracteres');
            scrollToError();
            return;
        }
        if (empresa.contacto.length < 3 || empresa.contacto.length > 50) {
            setError('El nombre de la persona debe tener entre 3 y 50 caracteres');
            scrollToError();
            return;
        }
        if (!/^\d{7,8}-[kK\d]$/.test(empresa.rut)) {
            setError('RUT inválido. Ejemplo: 12345678-9');
            scrollToError();
            return;
        }
        if (empresa.direccion.length < 5 || empresa.direccion.length > 80) {
            setError('La dirección debe tener entre 5 y 80 caracteres');
            scrollToError();
            return;
        }
        if (empresa.comuna.length < 3 || empresa.comuna.length > 40) {
            setError('La comuna debe tener entre 3 y 40 caracteres');
            scrollToError();
            return;
        }
        // Validación estricta de email (solo uno, formato correcto, sin espacios, comas ni punto y coma)
        const emailTrim = empresa.email.trim();
        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim) ||
            emailTrim.includes(',') ||
            emailTrim.includes(';') ||
            emailTrim.includes(' ') ||
            emailTrim.split('@').length !== 2
        ) {
            setError('Solo se permite un correo electrónico válido');
            scrollToError();
            return;
        }
        // Teléfono chileno: 9 dígitos, empieza con 9
        if (!/^9\d{8}$/.test(empresa.telefono)) {
            setError('Teléfono inválido. Ejemplo válido: 956264642');
            scrollToError();
            return;
        }

        // --- VALIDACIÓN DE UNICIDAD DE EMAIL Y RUT ---
        try {
            let emailExists = false;
            let rutExists = false;

            // Buscar en empresas
            const empresasSnap = await getDocs(collection(db, 'empresas'));
            empresasSnap.forEach(docu => {
                if (id && docu.id === id) return; // Ignora el actual si está editando
                const data = docu.data();
                if (data.email === emailTrim) emailExists = true;
                if (data.rut === empresa.rut) rutExists = true;
            });

            // Buscar en usuarios (clientes y admins)
            const usuariosSnap = await getDocs(collection(db, 'usuarios'));
            usuariosSnap.forEach(docu => {
                const data = docu.data();
                if (data.email === emailTrim) emailExists = true;
                if (data.rut === empresa.rut) rutExists = true;
            });

            if (emailExists) {
                setError('El correo ya está registrado en otra empresa o usuario.');
                scrollToError();
                return;
            }
            if (rutExists) {
                setError('El RUT ya está registrado en otra empresa o usuario.');
                scrollToError();
                return;
            }

            if (id) {
                await setDoc(doc(db, 'empresas', id), empresa);
            } else {
                await addDoc(collection(db, 'empresas'), empresa);
            }
            navigate('/admin/empresas');
        } catch {
            setError('Error al guardar');
            scrollToError();
        }
    };

    // Scroll al error si existe
    const scrollToError = () => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="ecofood-form-container" style={{ maxWidth: 420, margin: '40px auto' }}>
            <form onSubmit={handleSubmit} ref={formRef}>
                <h2 style={{ color: '#388e3c', marginBottom: 18 }}>{id ? 'Editar Empresa' : 'Agregar Empresa'}</h2>
                {error && <p className="error">{error}</p>}
                <input
                    className="ecofood-input"
                    name="nombre"
                    value={empresa.nombre}
                    onChange={handleChange}
                    placeholder="Nombre de la empresa"
                    required
                    minLength={3}
                    maxLength={60}
                />
                <input
                    className="ecofood-input"
                    name="contacto"
                    value={empresa.contacto}
                    onChange={handleChange}
                    placeholder="Nombre de la persona de contacto"
                    required
                    minLength={3}
                    maxLength={50}
                />
                <input
                    className="ecofood-input"
                    name="rut"
                    value={empresa.rut}
                    onChange={handleChange}
                    placeholder="RUT (Ej: 12345678-9)"
                    required
                    maxLength={10}
                />
                <input
                    className="ecofood-input"
                    name="direccion"
                    value={empresa.direccion}
                    onChange={handleChange}
                    placeholder="Dirección"
                    required
                    minLength={5}
                    maxLength={80}
                />
                <input
                    className="ecofood-input"
                    name="comuna"
                    value={empresa.comuna}
                    onChange={handleChange}
                    placeholder="Comuna"
                    required
                    minLength={3}
                    maxLength={40}
                />
                <input
                    className="ecofood-input"
                    name="email"
                    value={empresa.email}
                    onChange={handleChange}
                    placeholder="Correo electrónico"
                    required
                    type="email"
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Ingresa un solo correo electrónico válido"
                    autoComplete="off"
                    maxLength={60}
                />
                <input
                    className="ecofood-input"
                    name="telefono"
                    value={empresa.telefono}
                    onChange={handleChange}
                    placeholder="Teléfono (9 dígitos, ej: 956264642)"
                    required
                    minLength={9}
                    maxLength={9}
                    type="tel"
                />
                <button type="submit" style={{ marginTop: 10 }}>{id ? 'Actualizar' : 'Crear'}</button>
                {id && (
                    <Link
                        to={`/admin/empresas/${id}/productos`}
                        className="admin-btn"
                        style={{ display: 'block', marginTop: 16, textAlign: 'center' }}
                    >
                        Ver productos
                    </Link>
                )}
            </form>
        </div>
    );
};

export default EmpresaForm;