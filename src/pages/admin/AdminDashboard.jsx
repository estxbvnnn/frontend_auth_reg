import React from 'react';
import { Link } from 'react-router-dom';

const cardStyle = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
    padding: '32px 24px',
    margin: '18px',
    minWidth: 220,
    flex: '1 1 220px',
    textAlign: 'center',
    border: '1px solid #e0e0e0',
    transition: 'box-shadow 0.2s',
};

const cardTitle = {
    color: '#23272f',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 600,
};

const cardLink = {
    display: 'inline-block',
    marginTop: 12,
    color: '#388e3c',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: 16,
};

const AdminDashboard = () => (
    <div style={{
        maxWidth: 1100,
        margin: '40px auto',
        padding: '32px 0',
        background: '#f8fafc',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(44,62,80,0.07)'
    }}>
        <h2 style={{ color: '#23272f', textAlign: 'center', marginBottom: 8, fontSize: 32, fontWeight: 700 }}>
            Panel de Administración
        </h2>
        <p style={{ color: '#555', textAlign: 'center', marginBottom: 36, fontSize: 18 }}>
            Bienvenido al módulo administrativo de EcoFood. Usa el menú superior o las tarjetas para gestionar el sistema.
        </p>
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 24,
        }}>
            <div style={cardStyle}>
                <div style={cardTitle}>Empresas</div>
                <div>Gestiona las empresas registradas, edita sus datos y asocia productos.</div>
                <Link to="/admin/empresas" style={cardLink}>Ir a Empresas</Link>
            </div>
            <div style={cardStyle}>
                <div style={cardTitle}>Clientes</div>
                <div>Visualiza y elimina clientes registrados en el sistema.</div>
                <Link to="/admin/clientes" style={cardLink}>Ir a Clientes</Link>
            </div>
            <div style={cardStyle}>
                <div style={cardTitle}>Administradores</div>
                <div>Administra los usuarios con rol administrador.</div>
                <Link to="/admin/administradores" style={cardLink}>Ir a Administradores</Link>
            </div>
        </div>
    </div>
);

export default AdminDashboard;