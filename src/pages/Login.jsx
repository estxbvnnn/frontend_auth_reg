import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = () => {
    return (
        <div className="login-container">
            <h2 className="ecofood-login-title">Iniciar Sesión</h2>
            <LoginForm />
        </div>
    );
};

export default Login;