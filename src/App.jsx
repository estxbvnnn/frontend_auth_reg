import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import PasswordReset from './pages/PasswordReset';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/password-reset" component={PasswordReset} />
                <ProtectedRoute path="/home" component={Home} />
                <Route path="/" exact component={Home} /> {/* Cambiado para que Home sea la raíz */}
            </Switch>
        </Router>
    );
};

export default App;