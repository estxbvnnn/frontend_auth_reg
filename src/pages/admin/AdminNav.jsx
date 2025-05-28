import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';

const AdminNav = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };
    return (
        <nav style={{
            background: '#23272f',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            height: '60px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
            <div style={{ fontWeight: 'bold', color: '#fff', fontSize: 22, letterSpacing: 1, marginRight: 40 }}>
                EcoFood Admin
            </div>
            <div style={{ flex: 1 }}>
                <Link to="/admin" style={navLinkStyle}>Dashboard</Link>
                <Link to="/admin/empresas" style={navLinkStyle}>Empresas</Link>
                <Link to="/admin/clientes" style={navLinkStyle}>Clientes</Link>
                <Link to="/admin/administradores" style={navLinkStyle}>Administradores</Link>
                <button
                    onClick={() => navigate('/home')}
                    style={{
                        background: '#388e3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '8px 18px',
                        fontWeight: 'bold',
                        fontSize: 16,
                        cursor: 'pointer',
                        marginLeft: 16
                    }}
                >
                    Ir al Inicio
                </button>
            </div>
            <button
                onClick={handleLogout}
                style={{
                    background: '#d32f2f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 20px',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: 'pointer',
                    marginLeft: 16
                }}
            >
                Cerrar sesión
            </button>
        </nav>
    );
};

const navLinkStyle = {
    color: '#fff',
    textDecoration: 'none',
    marginRight: 28,
    fontSize: 17,
    fontWeight: 500,
    padding: '8px 0',
    borderBottom: '2px solid transparent',
    transition: 'border 0.2s',
};

export default AdminNav;