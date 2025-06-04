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
        <nav className="admin-nav-bar">
            <div className="admin-nav-logo">
                <i className="bi bi-shield-lock-fill"></i> EcoFood Admin
            </div>
            <ul className="admin-nav-links">
                <li>
                    <Link to="/admin" className="admin-nav-link">
                        <i className="bi bi-speedometer2"></i> Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/admin/empresas" className="admin-nav-link">
                        <i className="bi bi-building"></i> Empresas
                    </Link>
                </li>
                <li>
                    <Link to="/admin/clientes" className="admin-nav-link">
                        <i className="bi bi-people"></i> Clientes
                    </Link>
                </li>
                <li>
                    <Link to="/admin/administradores" className="admin-nav-link">
                        <i className="bi bi-person-badge"></i> Administradores
                    </Link>
                </li>
                <li>
                    <button
                        onClick={() => navigate('/home')}
                        className="admin-nav-btn admin-nav-btn-green"
                    >
                        <i className="bi bi-house-door"></i> Ir al Inicio
                    </button>
                </li>
            </ul>
            <button
                onClick={handleLogout}
                className="admin-nav-btn admin-nav-btn-red"
            >
                <i className="bi bi-box-arrow-right"></i> Cerrar sesión
            </button>
        </nav>
    );
};

export default AdminNav;