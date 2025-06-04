import React from 'react';
import { Link } from 'react-router-dom';

const cardStyle = {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #fffde4 100%)',
    borderRadius: 18,
    boxShadow: '0 6px 32px rgba(56, 142, 60, 0.13)',
    padding: '38px 28px 28px 28px',
    margin: '18px',
    minWidth: 260,
    flex: '1 1 260px',
    textAlign: 'center',
    border: '2px solid #81c784',
    transition: 'box-shadow 0.2s, transform 0.2s, border 0.2s',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
};

const cardTitle = {
    color: '#2e7d32',
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textShadow: '0 2px 8px #c8e6c9'
};

const cardLink = {
    display: 'inline-block',
    marginTop: 18,
    color: '#fff',
    background: 'linear-gradient(90deg, #43a047 0%, #66bb6a 100%)',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: 17,
    borderRadius: 8,
    padding: '12px 32px',
    boxShadow: '0 2px 8px rgba(56, 142, 60, 0.10)',
    transition: 'background 0.2s, color 0.2s'
};

const iconCircle = {
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #43a047 0%, #81c784 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 18px auto',
    fontSize: 32,
    color: '#fff',
    boxShadow: '0 2px 12px rgba(56, 142, 60, 0.13)'
};

const AdminDashboard = () => (
    <div style={{
        maxWidth: 1200,
        margin: '48px auto',
        padding: '40px 0 32px 0',
        background: 'linear-gradient(120deg, #f8fafc 60%, #e8f5e9 100%)',
        borderRadius: 22,
        boxShadow: '0 8px 36px rgba(44,62,80,0.13)',
        border: '2px solid #388e3c'
    }}>
        <h2 style={{
            color: '#2e7d32',
            textAlign: 'center',
            marginBottom: 8,
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: 2,
            textShadow: '0 2px 12px #c8e6c9'
        }}>
            Panel de Administración
        </h2>
        <p style={{
            color: '#388e3c',
            textAlign: 'center',
            marginBottom: 36,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: 1
        }}>
            Bienvenido al módulo administrativo de <b>EcoFood</b>. Usa el menú superior o las tarjetas para gestionar el sistema.
        </p>
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 32,
        }}>
            <div
                style={cardStyle}
                className="admin-dashboard-card"
            >
                <div style={iconCircle}>
                    <i className="bi bi-building"></i>
                </div>
                <div style={cardTitle}>Empresas</div>
                <div style={{ color: '#333', fontSize: 17, marginBottom: 10 }}>
                    Gestiona las empresas registradas, edita sus datos y asocia productos.
                </div>
                <Link to="/admin/empresas" style={cardLink}>
                    Ir a Empresas
                </Link>
            </div>
            <div
                style={cardStyle}
                className="admin-dashboard-card"
            >
                <div style={iconCircle}>
                    <i className="bi bi-people"></i>
                </div>
                <div style={cardTitle}>Clientes</div>
                <div style={{ color: '#333', fontSize: 17, marginBottom: 10 }}>
                    Visualiza y elimina clientes registrados en el sistema.
                </div>
                <Link to="/admin/clientes" style={cardLink}>
                    Ir a Clientes
                </Link>
            </div>
            <div
                style={cardStyle}
                className="admin-dashboard-card"
            >
                <div style={iconCircle}>
                    <i className="bi bi-person-badge"></i>
                </div>
                <div style={cardTitle}>Administradores</div>
                <div style={{ color: '#333', fontSize: 17, marginBottom: 10 }}>
                    Administra los usuarios con rol administrador.
                </div>
                <Link to="/admin/administradores" style={cardLink}>
                    Ir a Administradores
                </Link>
            </div>
        </div>
    </div>
);

export default AdminDashboard;