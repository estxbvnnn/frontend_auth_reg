import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import PasswordReset from './pages/PasswordReset';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedByRole from './components/ProtectedByRole';

// Importa los componentes del módulo admin
import AdminNav from './pages/admin/AdminNav';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmpresasList from './pages/admin/EmpresasList';
import EmpresaForm from './pages/admin/EmpresaForm';
import ClientesList from './pages/admin/ClientesList';
import AdminsList from './pages/admin/AdminList';
import AdminForm from './pages/admin/AdminForm';
import AdminRegisterClient from './pages/admin/AdminRegisterClient';
import AdminRegisterAdmin from './pages/admin/AdminRegisterAdmin';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />

                {/* Rutas administrativas protegidas */}
                <Route path="/admin" element={
                    <ProtectedByRole allowed={["admin"]}>
                        <AdminNav />
                        <AdminDashboard />
                    </ProtectedByRole>
                } />
                <Route path="/admin/empresas" element={
                    <ProtectedByRole allowed={["admin"]}>
                        <AdminNav />
                        <EmpresasList />
                    </ProtectedByRole>
                } />
                <Route path="/admin/empresas/nueva" element={
                    <ProtectedByRole allowed={["admin"]}>
                        <AdminNav />
                        <EmpresaForm />
                    </ProtectedByRole>
                } />
                <Route path="/admin/empresas/editar/:id" element={
                    <ProtectedByRole allowed={["admin"]}>
                        <AdminNav />
                        <EmpresaForm />
                    </ProtectedByRole>
                } />
                <Route path="/admin/clientes" element={
                    <ProtectedByRole allowed={["admin"]}>
                        <AdminNav />
                        <ClientesList />
                    </ProtectedByRole>
                } />
                <Route path="/admin/clientes/nuevo" element={
                    <ProtectedByRole allowed={["admin"]}>
                        <AdminNav />
                        <AdminRegisterClient />
                    </ProtectedByRole>
                } />
                <Route path="/admin/administradores" element={
                    <ProtectedByRole allowed={["admin"]}>
                        <AdminNav />
                        <AdminsList />
                    </ProtectedByRole>
                } />
                <Route path="/admin/administradores/nuevo" element={
                    <ProtectedByRole allowed={["admin"]}>
                        <AdminNav />
                        <AdminRegisterAdmin />
                    </ProtectedByRole>
                } />
                <Route path="/admin/administradores/editar/:id" element={
                    <ProtectedByRole allowed={["admin"]}>
                        <AdminNav />
                        <AdminForm />
                    </ProtectedByRole>
                } />
            </Routes>
        </Router>
    );
};

export default App;