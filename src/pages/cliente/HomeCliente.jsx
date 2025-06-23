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
                <img
                    src={logo}
                    alt="EcoFood Logo"
                    style={{
                        width: 120,
                        marginBottom: 24,
                        filter: "drop-shadow(0 4px 16px #43e97b55)"
                    }}
                />
                <h1 className="fw-bold mb-2 text-center homecliente-title">
                    ¡Hola, {userData?.fullName || "Cliente"}!
                </h1>
                <p className="lead text-center mb-4 homecliente-subtitle">
                    Bienvenido a tu panel de <span className="text-ecofood">EcoFood</span>. Aquí puedes explorar productos, gestionar pedidos y editar tu perfil.
                </p>
                <div className="row g-4 mb-4 w-100 justify-content-center">
                    <div className="col-12 col-md-4">
                        <div className="card homecliente-card shadow border-0 h-100 text-center py-4 px-2">
                            <div className="mb-3">
                                <i className="bi bi-box-seam" style={{ fontSize: 48, color: "#43a047" }}></i>
                            </div>
                            <h5 className="fw-bold mb-2 homecliente-card-title">Ver Productos</h5>
                            <p className="mb-3 homecliente-card-desc">Descubre productos frescos, económicos y satisfactorios publicados por empresas responsables.</p>
                            <Link to="/cliente/productos" className="btn btn-gradient-ecofood btn-lg w-75 mx-auto">
                                <i className="bi bi-search me-2"></i>Explorar
                            </Link>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card homecliente-card shadow border-0 h-100 text-center py-4 px-2">
                            <div className="mb-3">
                                <i className="bi bi-list-check" style={{ fontSize: 48, color: "#1976d2" }}></i>
                            </div>
                            <h5 className="fw-bold mb-2 homecliente-card-title" style={{ color: "#1976d2" }}>Mis Pedidos</h5>
                            <p className="mb-3 homecliente-card-desc">Revisa el estado de tus solicitudes y gestiona tus pedidos fácilmente.</p>
                            <Link to="/cliente/pedidos" className="btn btn-gradient-ecofood btn-lg w-75 mx-auto">
                                <i className="bi bi-clipboard-check me-2"></i>Ver Pedidos
                            </Link>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card homecliente-card shadow border-0 h-100 text-center py-4 px-2">
                            <div className="mb-3">
                                <i className="bi bi-person" style={{ fontSize: 48, color: "#555" }}></i>
                            </div>
                            <h5 className="fw-bold mb-2 homecliente-card-title" style={{ color: "#555" }}>Editar Perfil</h5>
                            <p className="mb-3 homecliente-card-desc">Actualiza tus datos personales y mantén tu información al día.</p>
                            <Link to="/cliente/perfil" className="btn btn-gradient-ecofood btn-lg w-75 mx-auto">
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
                .homecliente-title {
                    color: #23272f;
                    font-size: 2.5rem;
                    letter-spacing: 1px;
                }
                .homecliente-subtitle {
                    max-width: 540px;
                    color: #444;
                    font-size: 1.25rem;
                }
                .text-ecofood {
                    color: #43a047;
                    font-weight: 600;
                }
                .homecliente-card {
                    border-radius: 22px;
                    background: linear-gradient(120deg, #f9fdfb 70%, #e0f2f1 100%);
                    box-shadow: 0 2px 12px rgba(67, 233, 123, 0.07);
                    transition: box-shadow 0.2s, transform 0.2s;
                    min-height: 340px;
                    display: flex;
                    flex-direction: column;
                    justify-content: stretch;
                }
                .homecliente-card:hover {
                    box-shadow: 0 8px 32px rgba(67,233,123,0.13);
                    transform: translateY(-4px) scale(1.03);
                }
                .homecliente-card-title {
                    font-size: 1.35rem;
                }
                .homecliente-card-desc {
                    color: #555;
                    font-size: 1.05rem;
                    min-height: 56px;
                }
                .btn-gradient-ecofood {
                    background: linear-gradient(90deg, #43e97b 0%, #388e3c 100%) !important;
                    color: #fff !important;
                    border: none !important;
                    font-weight: 600;
                    border-radius: 30px;
                    transition: background 0.2s;
                    box-shadow: 0 2px 8px rgba(67, 233, 123, 0.08);
                }
                .btn-gradient-ecofood:hover, .btn-gradient-ecofood:focus {
                    background: linear-gradient(90deg, #388e3c 0%, #43e97b 100%) !important;
                    color: #fff !important;
                }
                @media (max-width: 767px) {
                    .homecliente-title {
                        font-size: 2rem;
                    }
                    .homecliente-card {
                        min-height: 220px;
                        padding: 1.2rem !important;
                    }
                }
            `}</style>
        </div>
    );
}