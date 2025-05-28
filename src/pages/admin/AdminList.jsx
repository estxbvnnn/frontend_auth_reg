import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const AdminsList = () => {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const fetchAdmins = async () => {
            const q = query(collection(db, 'usuarios'), where('userType', '==', 'admin'));
            const querySnapshot = await getDocs(q);
            setAdmins(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchAdmins();
    }, []);

    const handleDelete = async (admin) => {
        if (admin.isMain) {
            alert('No se puede eliminar el administrador principal.');
            return;
        }
        if (window.confirm('¿Seguro que deseas eliminar este administrador?')) {
            await deleteDoc(doc(db, 'usuarios', admin.id));
            setAdmins(admins.filter(a => a.id !== admin.id));
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
                <h2 style={{ color: '#23272f', fontWeight: 700 }}>Administradores</h2>
                <Link to="/admin/administradores/nuevo" className="admin-btn">+ Nuevo Administrador</Link>
            </div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '28px',
                justifyContent: 'center'
            }}>
                {admins.length === 0 ? (
                    <div style={{
                        color: '#888',
                        fontSize: 18,
                        background: '#fff',
                        borderRadius: 12,
                        padding: '32px 48px',
                        boxShadow: '0 2px 12px rgba(44,62,80,0.08)'
                    }}>
                        No hay administradores registrados.
                    </div>
                ) : admins.map(adm => (
                    <div key={adm.id} style={{
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
                            {adm.fullName || '-'}
                        </div>
                        <div style={{ color: '#23272f', marginBottom: 6 }}>
                            <b>Email:</b> <span style={{ color: '#555' }}>{adm.email}</span>
                        </div>
                        <div style={{ color: '#23272f', marginBottom: 6 }}>
                            <b>Rol:</b> <span style={{ color: '#555' }}>{adm.isMain ? 'Administrador Principal' : 'Administrador'}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12, width: '100%' }}>
                            <Link
                                to={`/admin/administradores/editar/${adm.id}`}
                                className="admin-btn"
                                style={{ flex: 1, textAlign: 'center' }}
                            >
                                Editar
                            </Link>
                            <button
                                className="admin-btn admin-btn-danger"
                                style={{ flex: 1 }}
                                onClick={() => handleDelete(adm)}
                                disabled={adm.isMain}
                                title={adm.isMain ? "No se puede eliminar el administrador principal" : ""}
                            >
                                Eliminar
                            </button>
                        </div>
                        {adm.isMain && (
                            <div style={{
                                color: '#d32f2f',
                                fontWeight: 'bold',
                                fontSize: 13,
                                marginTop: 10,
                                textAlign: 'center'
                            }}>
                                (No se puede eliminar)
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminsList;