import React from 'react';
import PasswordResetForm from '../components/PasswordResetForm';

const PasswordReset = () => {
    return (
        <div className="password-reset">
            <h2>Restablecer Contraseña</h2>
            <PasswordResetForm />
        </div>
    );
};

export default PasswordReset;