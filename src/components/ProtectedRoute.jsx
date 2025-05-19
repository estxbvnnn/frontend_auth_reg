import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            render={props =>
                currentUser ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default ProtectedRoute;