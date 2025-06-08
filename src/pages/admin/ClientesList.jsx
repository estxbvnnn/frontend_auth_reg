import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const ClientesList = () => {
    const [clientes, setClientes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientes = async () => {
            const q = query(collection(db, 'usuarios'), where('userType', '==', 'cliente'));
            const querySnapshot = await getDocs(q);
            setClientes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchClientes();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Seguro que deseas eliminar este cliente?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#43a047',
            cancelButtonColor: '#d32f2f',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            await deleteDoc(doc(db, 'usuarios', id));
            setClientes(clientes.filter(c => c.id !== id));
            Swal.fire('Eliminado', 'El cliente ha sido eliminado.', 'success');
        }
    };

    return (
        <div style={{
            maxWidth: 1100,
            margin: '40px auto',
            background: '#f8fafc',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(44,62,80,0.07)',
            padding: '32px 24px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: '#23272f', fontWeight: 700 }}>Clientes Registrados</h2>
                <button
                    className="admin-btn"
                    onClick={() => navigate('/admin/clientes/nuevo')}
                >
                    + Nuevo Cliente
                </button>
            </div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '28px',
                justifyContent: 'center'
            }}>
                {clientes.length === 0 ? (
                    <div style={{
                        color: '#888',
                        fontSize: 18,
                        background: '#fff',
                        borderRadius: 12,
                        padding: '32px 48px',
                        boxShadow: '0 2px 12px rgba(44,62,80,0.08)'
                    }}>
                        No hay clientes registrados.
                    </div>
                ) : clientes.map(cli => (
                    <div key={cli.id} style={{
                        background: '#fff',
                        borderRadius: 12,
                        boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
                        padding: '28px 32px',
                        minWidth: 260,
                        maxWidth: 320,
                        flex: '1 1 260px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        <div style={{ fontWeight: 600, fontSize: 20, color: '#388e3c', marginBottom: 8 }}>
                            {cli.fullName || '-'}
                        </div>
                        <div style={{ color: '#23272f', marginBottom: 6 }}>
                            <b>Email:</b> <span style={{ color: '#555' }}>{cli.email}</span>
                        </div>
                        <div style={{ color: '#23272f', marginBottom: 6 }}>
                            <b>Dirección:</b> <span style={{ color: '#555' }}>{cli.address || '-'}</span>
                        </div>
                        <div style={{ color: '#23272f', marginBottom: 6 }}>
                            <b>Comuna:</b> <span style={{ color: '#555' }}>{cli.commune || '-'}</span>
                        </div>
                        <div style={{ color: '#23272f', marginBottom: 14 }}>
                            <b>Teléfono:</b> <span style={{ color: '#555' }}>{cli.phone || '-'}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                            <Link
                                to={`/admin/clientes/editar/${cli.id}`}
                                className="admin-btn"
                                style={{ flex: 1, textAlign: 'center' }}
                            >
                                Editar
                            </Link>
                            <button
                                className="admin-btn admin-btn-danger"
                                style={{ flex: 1 }}
                                onClick={() => handleDelete(cli.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientesList;