import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import logo from "../../assets/img/Recurso 5.svg";

export default function HomeCliente() {
    const { userData } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="container py-5">
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
                <img src={logo} alt="EcoFood Logo" style={{ width: 120, marginBottom: 24, filter: "drop-shadow(0 4px 16px #43e97b55)" }} />
                <h1 className="fw-bold mb-2" style={{ color: "#388e3c", letterSpacing: 1, fontSize: 36 }}>
                    ¡Hola, {userData?.fullName || "Cliente"}!
                </h1>
                <p className="lead text-center mb-4" style={{ maxWidth: 540, color: "#444", fontSize: 20 }}>
                    Bienvenido a tu panel de <span style={{ color: "#43a047", fontWeight: 600 }}>EcoFood</span>. Aquí puedes explorar productos, gestionar tus pedidos y editar tu perfil.
                </p>
                <div className="row g-4 mb-4 w-100 justify-content-center">
                    <div className="col-12 col-md-4">
                        <div className="card shadow border-0 h-100 text-center py-4 homecliente-card">
                            <div className="mb-3">
                                <i className="bi bi-box-seam text-success" style={{ fontSize: 38 }}></i>
                            </div>
                            <h5 className="fw-bold mb-2" style={{ color: "#388e3c" }}>Ver Productos</h5>
                            <p className="mb-3" style={{ color: "#555" }}>Descubre productos frescos y económicos publicados por empresas responsables.</p>
                            <Link to="/cliente/productos" className="btn btn-success btn-lg w-75 mx-auto">
                                <i className="bi bi-search me-2"></i>Explorar
                            </Link>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card shadow border-0 h-100 text-center py-4 homecliente-card">
                            <div className="mb-3">
                                <i className="bi bi-list-check text-primary" style={{ fontSize: 38 }}></i>
                            </div>
                            <h5 className="fw-bold mb-2" style={{ color: "#1976d2" }}>Mis Pedidos</h5>
                            <p className="mb-3" style={{ color: "#555" }}>Revisa el estado de tus solicitudes y gestiona tus pedidos fácilmente.</p>
                            <Link to="/cliente/pedidos" className="btn btn-outline-primary btn-lg w-75 mx-auto">
                                <i className="bi bi-clipboard-check me-2"></i>Ver Pedidos
                            </Link>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card shadow border-0 h-100 text-center py-4 homecliente-card">
                            <div className="mb-3">
                                <i className="bi bi-person text-secondary" style={{ fontSize: 38 }}></i>
                            </div>
                            <h5 className="fw-bold mb-2" style={{ color: "#555" }}>Editar Perfil</h5>
                            <p className="mb-3" style={{ color: "#555" }}>Actualiza tus datos personales y mantén tu información al día.</p>
                            <Link to="/cliente/perfil" className="btn btn-outline-secondary btn-lg w-75 mx-auto">
                                <i className="bi bi-pencil-square me-2"></i>Editar Perfil
                            </Link>
                        </div>
                    </div>
                </div>
                <button
                    className="btn btn-lg btn-outline-success mt-3"
                    onClick={() => navigate("/home")}
                >
                    <i className="bi bi-house-door me-2"></i>Volver al Inicio
                </button>
            </div>
            <style>{`
                .homecliente-card {
                    border-radius: 22px;
                    transition: box-shadow 0.2s, transform 0.2s;
                }
                .homecliente-card:hover {
                    box-shadow: 0 8px 32px rgba(67,233,123,0.13);
                    transform: translateY(-4px) scale(1.03);
                }
            `}</style>
        </div>
    );
}