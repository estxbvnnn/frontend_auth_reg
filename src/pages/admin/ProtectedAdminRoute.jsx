import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { currentUser } = useAuth();
    if (!currentUser || currentUser.userType !== 'admin') {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedAdminRoute;