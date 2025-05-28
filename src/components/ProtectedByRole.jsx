import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

const ProtectedByRole = ({ allowed, children }) => {
    const { userData, loading } = useAuth();
    if (loading) return <p>Cargando...</p>;
    if (!userData || !allowed.includes(userData.userType || userData.tipo)) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedByRole;