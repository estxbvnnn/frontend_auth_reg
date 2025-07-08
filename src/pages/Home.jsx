import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/img/Recurso 5.svg';
import frutita from '../assets/img/frutita.jpg';

const Home = () => {
    const { currentUser, userData, loading } = useAuth();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [fade, setFade] = useState(false);

    const mensajesMotivacionales = [
        "¡Cada alimento salvado es un paso hacia un planeta más verde!",
        "EcoFood: Donde cada producto cuenta para un mundo mejor.",
        "¡Juntos reducimos el desperdicio y alimentamos esperanza!",
        "Transforma excedentes en oportunidades con EcoFood.",
        "Tu acción hoy alimenta el futuro de todos.",
        "¡Haz la diferencia, elige comida sustentable!",
        "Cada producto rescatado es una victoria para el planeta.",
        "EcoFood conecta empresas y personas para un mundo sin hambre.",
        "¡Sé parte del cambio, únete a la revolución EcoFood!",
        "La comida no se bota, se comparte. ¡Súmate a EcoFood!"
    ];

    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        setFade(true);
        setMensaje(mensajesMotivacionales[Math.floor(Math.random() * mensajesMotivacionales.length)]);
        const fetchName = async () => {
            if (currentUser) {
                const docRef = doc(db, 'usuarios', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFullName(docSnap.data().fullName);
                } else {
                    setFullName(currentUser.email); // fallback
                }
            } else {
                setFullName('');
            }
        };
        fetchName();
    }, [currentUser]);

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            {/* Menú superior */}
            <header>
                <nav className="menu-superior flex-nav">
                    <ul className="nav-list">
                        <li><Link to="/home" className="boton-verde">Inicio</Link></li>
                        <li>
                            <Link to="/productos" className="boton-verde">
                                <i className="bi bi-box-seam me-1"></i>Productos publicados
                            </Link>
                        </li>
                        {!currentUser && (
                            <>
                                <li><Link to="/register" className="boton-verde">Registrarse</Link></li>
                                <li><Link to="/login" className="boton-verde">Iniciar Sesión</Link></li>
                            </>
                        )}
                    </ul>
                    {currentUser && userData && (
                        <div className="nav-user">
                            <span className="nav-username">
                                <span role="img" aria-label="user" className="nav-usericon">👤</span>
                                {fullName || 'Usuario'}
                            </span>
                            {/* Botones especiales solo para empresa */}
                            {(userData.userType === 'empresa' || userData.tipo === 'empresa') && (
                                <span style={{ marginLeft: 16 }}>
                                    <Link to="/empresa/perfil" className="btn btn-success me-2">
                                        <i className="bi bi-person-badge me-1"></i>Perfil Empresa
                                    </Link>
                                    <Link to="/empresa/productos" className="btn btn-primary me-2">
                                        <i className="bi bi-box-seam me-1"></i>Mis Productos
                                    </Link>
                                    <Link
                                        to="/empresa/solicitudes"
                                        className="btn btn-gradient-green"
                                        style={{
                                            background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
                                            color: "#fff",
                                            border: "none",
                                            fontWeight: 600
                                        }}
                                    >
                                        <i className="bi bi-list-check me-1"></i>Ver Solicitudes
                                    </Link>
                                </span>
                            )}
                            {/* Botón especial para admin */}
                            {(userData.userType === 'admin' || userData.tipo === 'admin') && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="admin-panel-btn"
                                >
                                    Panel Admin
                                </button>
                            )}
                            {/* Solo un botón para cliente */}
                            {(userData.userType === 'cliente' || userData.tipo === 'cliente') && (
                                <span style={{ marginLeft: 16 }}>
                                    <Link to="/cliente" className="btn btn-success btn-lg me-2">
                                        <i className="bi bi-house-door me-1"></i>Inicio Cliente
                                    </Link>
                                </span>
                            )}
                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </nav>
            </header>

            {/* Hero principal */}
            <section className={`hero fade-in-section${fade ? ' is-visible' : ''}`}>
                <div className="logo-centro">
                    <img src={logo} alt="EcoFood Logo" className="logo-animado" />
                </div>
                <div className="mensaje-centro">
                    <h1 className="titulo-verde hero-title">
                        Bienvenido a <span style={{ color: "#388e3c" }}>EcoFood</span>
                    </h1>
                    <p className="texto-negro hero-desc" style={{ fontSize: 20 }}>
                        Plataforma profesional para la gestión eficiente de excedentes alimentarios.<br />
                        Conectamos empresas y consumidores para reducir el desperdicio y potenciar la economía circular.
                    </p>
                    <div className="alert alert-success mt-3" style={{ fontSize: 18, fontWeight: 500 }}>
                        <i className="bi bi-emoji-smile me-2"></i>{mensaje}
                    </div>
                    {currentUser && (
                        <div className="saludo-animado saludo-ecofood">
                            ¡Hola, {fullName || 'usuario'}!
                        </div>
                    )}
                </div>
            </section>

            {/* Características profesionales */}
            <section className={`caracteristicas fade-in-section${fade ? ' is-visible' : ''}`}>
                <div className="caracteristica card-animada">
                    <div className="caracteristica-icon"><i className="bi bi-bar-chart-line"></i></div>
                    <h3 className="titulo-verde">Dashboard Inteligente</h3>
                    <p>Visualiza métricas clave de impacto, ventas y reducción de desperdicio en tiempo real.</p>
                </div>
                <div className="caracteristica card-animada">
                    <div className="caracteristica-icon"><i className="bi bi-people"></i></div>
                    <h3 className="titulo-verde">Gestión de Usuarios</h3>
                    <p>Administra empresas, clientes y administradores con roles y permisos avanzados.</p>
                </div>
                <div className="caracteristica card-animada">
                    <div className="caracteristica-icon"><i className="bi bi-shield-check"></i></div>
                    <h3 className="titulo-verde">Seguridad y Privacidad</h3>
                    <p>Protegemos tus datos con autenticación robusta y cifrado de información.</p>
                </div>
                <div className="caracteristica card-animada">
                    <div className="caracteristica-icon"><i className="bi bi-globe2"></i></div>
                    <h3 className="titulo-verde">Sustentabilidad Global</h3>
                    <p>Contribuye a los Objetivos de Desarrollo Sostenible (ODS) y reporta tu impacto ambiental.</p>
                </div>
                <div className="caracteristica card-animada">
                    <div className="caracteristica-icon"><i className="bi bi-graph-up-arrow"></i></div>
                    <h3 className="titulo-verde">Optimización de Inventario</h3>
                    <p>Reduce pérdidas y maximiza ganancias gestionando tus productos de forma eficiente.</p>
                </div>
            </section>

            {/* Impacto Global */}
            <section className={`impacto-global fade-in-section${fade ? ' is-visible' : ''}`}>
                <div className="contenido-impacto">
                    <div className="texto-impacto">
                        <h3>¿Por qué elegir EcoFood?</h3>
                        <ul>
                            <li><b>Reducción de costos:</b> Da salida a tus excedentes y mejora tu rentabilidad.</li>
                            <li><b>Responsabilidad social:</b> Apoya a comunidades y promueve el consumo responsable.</li>
                            <li><b>Transparencia:</b> Accede a reportes detallados de tu contribución ambiental.</li>
                            <li><b>Soporte dedicado:</b> Equipo profesional para ayudarte en cada paso.</li>
                        </ul>
                        <p>
                            Únete a la red de empresas y consumidores que están transformando la industria alimentaria.
                        </p>
                    </div>
                    <div className="imagen-impacto">
                        <img src={frutita} alt="Frutas EcoFood" className="impacto-img-animada" />
                    </div>
                </div>
            </section>

            {/* Llamado a la acción profesional */}
            <section className="cta-ecofood fade-in-section">
                <div className="container text-center py-5">
                    <h2 className="titulo-verde mb-3" style={{ fontWeight: 700 }}>
                        ¿Listo para profesionalizar tu gestión de alimentos?
                    </h2>
                    <p className="mb-4" style={{ fontSize: 18 }}>
                        Regístrate hoy y accede a herramientas avanzadas para potenciar tu empresa y cuidar el planeta.
                    </p>
                    {!currentUser && (
                        <Link to="/register" className="btn btn-success btn-lg px-5 py-3" style={{ fontSize: 20, fontWeight: 600 }}>
                            Comenzar ahora
                        </Link>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="ecofood-footer">
                <p>
                    EcoFood &copy; 2025 - Todos los derechos reservados | 
                    <span style={{ marginLeft: 8 }}>Desarrollado por profesionales en tecnología y sustentabilidad</span>
                </p>
            </footer>
            <style>{`
                .btn-gradient-green {
                    background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%) !important;
                    color: #fff !important;
                    border: none !important;
                    font-weight: 600;
                }
                .btn-gradient-green:hover, .btn-gradient-green:focus {
                    background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%) !important;
                    color: #fff !important;
                }
            `}</style>
        </div>
    );
};

export default Home;