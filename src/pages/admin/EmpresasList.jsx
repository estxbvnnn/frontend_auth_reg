import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const EmpresasList = () => {
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        const fetchEmpresas = async () => {
            const querySnapshot = await getDocs(collection(db, 'empresas'));
            setEmpresas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchEmpresas();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Seguro que deseas eliminar esta empresa?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#43a047',
            cancelButtonColor: '#d32f2f',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            await deleteDoc(doc(db, 'empresas', id));
            setEmpresas(empresas.filter(e => e.id !== id));
            Swal.fire('Eliminada', 'La empresa ha sido eliminada.', 'success');
        }
    };

    return (
        <div style={{
            maxWidth: 1100,
            margin: '40px auto',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(44,62,80,0.07)',
            padding: '32px 24px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: '#23272f', fontWeight: 700 }}>Empresas</h2>
                <Link to="/admin/empresas/nueva" className="admin-btn">+ Nueva Empresa</Link>
            </div>
            <div style={{ maxHeight: 480, overflowY: 'auto' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>RUT</th>
                            <th>Dirección</th>
                            <th>Comuna</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>No hay empresas registradas.</td>
                            </tr>
                        ) : empresas.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.nombre}</td>
                                <td>{emp.rut}</td>
                                <td>{emp.direccion}</td>
                                <td>{emp.comuna}</td>
                                <td>{emp.email}</td>
                                <td>{emp.telefono}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <Link to={`/admin/empresas/editar/${emp.id}`} className="admin-btn">
                                            Editar
                                        </Link>
                                        <Link
                                            to={`/admin/empresas/${emp.id}/productos`}
                                            className="admin-btn"
                                            style={{ background: '#1976d2' }}
                                        >
                                            Ver productos
                                        </Link>
                                        <button
                                            className="admin-btn admin-btn-danger"
                                            onClick={() => handleDelete(emp.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmpresasList;