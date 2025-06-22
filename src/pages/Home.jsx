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

    useEffect(() => {
        setFade(true);
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
                        ¡Bienvenido a EcoFood!
                    </h1>
                    <p className="texto-negro hero-desc">
                        La plataforma que conecta empresas y clientes para combatir el desperdicio de alimentos y cuidar el planeta.
                    </p>
                    {currentUser && (
                        <div className="saludo-animado saludo-ecofood">
                            ¡Hola, {fullName || 'usuario'}!
                        </div>
                    )}
                </div>
            </section>

            {/* Características */}
            <section className={`caracteristicas fade-in-section${fade ? ' is-visible' : ''}`}>
                <div className="caracteristica card-animada">
                    <div className="caracteristica-icon">🛒</div>
                    <h3 className="titulo-verde">Compra Inteligente</h3>
                    <p>Accede a productos de calidad a precios reducidos y ayuda a reducir el desperdicio.</p>
                </div>
                <div className="caracteristica card-animada">
                    <div className="caracteristica-icon">🏢</div>
                    <h3 className="titulo-verde">Empresas Comprometidas</h3>
                    <p>Las empresas pueden publicar sus excedentes y llegar a más clientes responsables.</p>
                </div>
                <div className="caracteristica card-animada">
                    <div className="caracteristica-icon">🌎</div>
                    <h3 className="titulo-verde">Impacto Ambiental</h3>
                    <p>Juntos generamos un impacto positivo en la sociedad y el medio ambiente.</p>
                </div>
            </section>

            {/* Impacto Global */}
            <section className={`impacto-global fade-in-section${fade ? ' is-visible' : ''}`}>
                <div className="contenido-impacto">
                    <div className="texto-impacto">
                        <h3>¿Sabías que...?</h3>
                        <p>
                            Cada año se desperdician millones de toneladas de alimentos en el mundo. EcoFood te ayuda a ser parte de la solución.
                        </p>
                        <ul>
                            <li>Reduce tu huella ecológica</li>
                            <li>Apoya a empresas responsables</li>
                            <li>Accede a productos frescos y económicos</li>
                        </ul>
                    </div>
                    <div className="imagen-impacto">
                        <img src={frutita} alt="Frutas EcoFood" className="impacto-img-animada" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="ecofood-footer">
                <p>EcoFood &copy; 2025 - Todos los derechos reservados</p>
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