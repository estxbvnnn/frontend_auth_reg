import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import PasswordReset from './pages/PasswordReset';
import ProductosPublicos from './pages/ProductosPublicos';

import ProtectedByRole from './components/ProtectedByRole';

import ProductosEmpresa from './pages/empresa/ProductosEmpresa';
import SolicitudesEmpresa from './pages/empresa/SolicitudesEmpresa';
import PerfilEmpresa from './pages/empresa/PerfilEmpresa'; // <-- Nuevo import

import HomeCliente from './pages/cliente/HomeCliente';
import VerProductos from './pages/cliente/VerProductos';
import MisPedidos from './pages/cliente/MisPedidos';
import EditarPerfil from './pages/cliente/EditarPerfil';

import AdminNav from './pages/admin/AdminNav';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmpresasList from './pages/admin/EmpresasList';
import EmpresaForm from './pages/admin/EmpresaForm';
import ClientesList from './pages/admin/ClientesList';
import AdminsList from './pages/admin/AdminList';
import AdminForm from './pages/admin/AdminForm';
import AdminRegisterClient from './pages/admin/AdminRegisterClient';
import AdminRegisterAdmin from './pages/admin/AdminRegisterAdmin';
import ProductosEmpresaAdmin from './pages/admin/ProductosEmpresaAdmin'; 

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
                <Route path="/productos" element={<ProductosPublicos />} />

                {/* Rutas protegidas para empresa */}
                <Route
                    path="/empresa/perfil"
                    element={
                        <ProtectedByRole allowed={["empresa"]}>
                            <PerfilEmpresa /> {/* Solo datos de la empresa */}
                        </ProtectedByRole>
                    }
                />
                <Route
                    path="/empresa/productos"
                    element={
                        <ProtectedByRole allowed={["empresa"]}>
                            <ProductosEmpresa /> {/* Gestión de productos */}
                        </ProtectedByRole>
                    }
                />
                <Route
                    path="/empresa/solicitudes"
                    element={
                        <ProtectedByRole allowed={["empresa"]}>
                            <SolicitudesEmpresa />
                        </ProtectedByRole>
                    }
                />

                {/* Rutas protegidas para cliente */}
                <Route
                    path="/cliente"
                    element={
                        <ProtectedByRole allowed={["cliente"]}>
                            <HomeCliente />
                        </ProtectedByRole>
                    }
                />
                <Route
                    path="/cliente/productos"
                    element={
                        <ProtectedByRole allowed={["cliente"]}>
                            <VerProductos />
                        </ProtectedByRole>
                    }
                />
                <Route
                    path="/cliente/pedidos"
                    element={
                        <ProtectedByRole allowed={["cliente"]}>
                            <MisPedidos />
                        </ProtectedByRole>
                    }
                />
                <Route
                    path="/cliente/perfil"
                    element={
                        <ProtectedByRole allowed={["cliente"]}>
                            <EditarPerfil />
                        </ProtectedByRole>
                    }
                />

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
                <Route path="/admin/empresas/:id/productos" element={
                    <ProtectedByRole allowed={["admin"]}>
                        <AdminNav />
                        <ProductosEmpresaAdmin />
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
                <Route path="/admin/clientes/editar/:id" element={
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
                        <AdminRegisterAdmin />
                    </ProtectedByRole>
                } />
            </Routes>
        </Router>
    );
};

export default App;