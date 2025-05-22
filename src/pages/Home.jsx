import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/img/Recurso 5.svg';
import frutita from '../assets/img/frutita.jpg';

const Home = () => {
    const { currentUser } = useAuth();
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
        navigate('/Home');
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

            {/* Contenido principal */}
            <main>
                <section className="hero">
                    <div className="logo-centro">
                        <img src={logo} alt="Logo EcoFood" />
                    </div>
                    <div className="mensaje-centro">
                        <p className="texto-negro">
                            Somos una organización comprometida en la reducción del desperdicio alimentario mediante puntos educativos, tecnológicos y prácticos.
                        </p>
                        <p className="texto-negro">
                            Nuestro propósito es promover la sostenibilidad, empoderando a las personas y comunidades para optimizar el uso de alimentos y minimizar residuos, protegiendo así nuestro planeta.
                        </p>
                    </div>
                </section>

                {/* Características */}
                <section className="caracteristicas" id="sobre-nosotros">
                    <div className="caracteristica">
                        <h2 className="titulo-verde">Educación</h2>
                        <p>Materiales educativos gratuitos y talleres comunitarios para fomentar prácticas sostenibles en el consumo de alimentos y reducir el desperdicio.</p>
                    </div>
                    <div className="caracteristica">
                        <h2 className="titulo-verde">Conexión</h2>
                        <p>Alianzas con productores, comerciantes y consumidores para reducir excedentes y aprovechar al máximo la disponibilidad de alimentos.</p>
                    </div>
                    <div className="caracteristica">
                        <h2 className="titulo-verde">Innovación</h2>
                        <p>Tecnología para soluciones prácticas, como aplicaciones, webs y redes comunitarias que facilitan la reducción del desperdicio alimentario.</p>
                    </div>
                </section>

                {/* Impacto Global */}
                <section className="impacto-global">
                    <div className="contenido-impacto">
                        <div className="texto-impacto">
                            <h3>El Desperdicio de Alimentos</h3>
                            <p>El desperdicio de alimentos no solo es un problema económico, sino también ambiental y social. Tiene un impacto negativo significativo en el medio ambiente.</p>
                            <h3>Impacto Global</h3>
                            <p>El desperdicio alimentario es un problema global que afecta la sostenibilidad y la seguridad alimentaria en todo el planeta.</p>
                            <h3>Un Reto que Impacta a Todos</h3>
                            <p>El desperdicio de alimentos afecta tanto al medio ambiente como a la seguridad alimentaria global, siendo un desafío que debemos abordar juntos.</p>
                        </div>
                        <div className="imagen-impacto">
                            <img src={frutita} alt="Frutita" />
                        </div>
                    </div>
                </section>
            </main>

            {/* Pie de Página */}
            <footer>
                <p>&copy; 2025 EcoFood. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Home;