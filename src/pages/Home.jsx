import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/img/Recurso 5.svg';
import frutita from '../assets/img/frutita.jpg';

const Home = () => {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');

    useEffect(() => {
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

    return (
        <div>
            {/* Menú superior */}
            <header>
                <nav className="menu-superior" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ul style={{ display: 'flex', margin: 0, padding: 0 }}>
                        <li><Link to="/home" className="boton-verde">Inicio</Link></li>
                        {!currentUser && (
                            <>
                                <li><Link to="/register" className="boton-verde">Registrarse</Link></li>
                                <li><Link to="/login" className="boton-verde">Iniciar Sesión</Link></li>
                            </>
                        )}
                    </ul>
                    {currentUser && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '24px' }}>
                            <span style={{ color: '#fff', fontWeight: 'bold' }}>
                                {fullName || 'Usuario'}
                            </span>
                            {/* Botón solo para admin */}
                            {userData && (userData.userType === 'admin' || userData.tipo === 'admin') && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    style={{
                                        background: '#23272f',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Panel Admin
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: '#d32f2f',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </nav>
            </header>

            {/* Hero principal */}
            <section className="hero">
                <div className="logo-centro">
                    <img src={logo} alt="EcoFood Logo" />
                </div>
                <div className="mensaje-centro">
                    <h1 className="titulo-verde">¡Bienvenido a EcoFood!</h1>
                    <p className="texto-negro">
                        La plataforma que conecta empresas y clientes para combatir el desperdicio de alimentos y cuidar el planeta.
                    </p>
                </div>
            </section>

            {/* Características */}
            <section className="caracteristicas">
                <div className="caracteristica">
                    <h3 className="titulo-verde">Compra Inteligente</h3>
                    <p>Accede a productos de calidad a precios reducidos y ayuda a reducir el desperdicio.</p>
                </div>
                <div className="caracteristica">
                    <h3 className="titulo-verde">Empresas Comprometidas</h3>
                    <p>Las empresas pueden publicar sus excedentes y llegar a más clientes responsables.</p>
                </div>
                <div className="caracteristica">
                    <h3 className="titulo-verde">Impacto Ambiental</h3>
                    <p>Juntos generamos un impacto positivo en la sociedad y el medio ambiente.</p>
                </div>
            </section>
            {/* Impacto Global */}
            <section className="impacto-global">
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
                        <img src={frutita} alt="Frutas EcoFood" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <p>EcoFood &copy; 2024 - Todos los derechos reservados</p>
            </footer>
        </div>
    );
};

export default Home;