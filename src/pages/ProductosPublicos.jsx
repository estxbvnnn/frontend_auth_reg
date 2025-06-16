import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const ProductosPublicos = () => {
    const [productosPorEmpresa, setProductosPorEmpresa] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductos = async () => {
            const productosSnap = await getDocs(collection(db, "productos"));
            const empresasSnap = await getDocs(collection(db, "empresas"));
            const empresasMap = {};
            empresasSnap.forEach(docu => {
                empresasMap[docu.id] = docu.data().nombre || "Desconocida";
            });

            // Agrupar productos por empresa
            const agrupados = {};
            productosSnap.docs.forEach(docu => {
                const data = docu.data();
                const empresaId = data.empresaId || "sin_empresa";
                const empresaNombre = empresasMap[empresaId] || "Desconocida";
                if (!agrupados[empresaNombre]) agrupados[empresaNombre] = [];
                agrupados[empresaNombre].push({
                    ...data,
                    id: docu.id,
                });
            });
            setProductosPorEmpresa(agrupados);
            setLoading(false);
        };
        fetchProductos();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando productos...</span>
            </div>
        </div>
    );

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h2 className="text-success fw-bold mb-0" style={{ letterSpacing: 1 }}>
                    <i className="bi bi-box-seam-fill me-2"></i>Productos Públicos a vender
                </h2>
                <button
                    className="btn btn-outline-success btn-lg d-flex align-items-center gap-2"
                    style={{
                        borderRadius: "2rem",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        padding: "0.5rem 1.5rem"
                    }}
                    onClick={() => navigate("/home")}
                >
                    <i className="bi bi-house-door"></i>
                    Volver al inicio
                </button>
            </div>
            {Object.keys(productosPorEmpresa).length === 0 && (
                <div className="text-center text-muted">No hay productos publicados.</div>
            )}
            <div className="row g-5">
                {Object.entries(productosPorEmpresa).map(([empresaNombre, productos]) => (
                    <div className="col-12" key={empresaNombre}>
                        <div className="empresa-productos-card shadow-sm mb-4 p-4 rounded-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="empresa-avatar me-3">
                                    <i className="bi bi-building text-success" style={{ fontSize: 32 }}></i>
                                </div>
                                <h4 className="mb-0 text-success fw-bold" style={{ letterSpacing: 1 }}>
                                    {empresaNombre}
                                </h4>
                            </div>
                            <div className="row g-4">
                                {productos.map(producto => (
                                    <div className="col-md-6 col-lg-4" key={producto.id}>
                                        <div className="card producto-publico-card h-100 border-0">
                                            <div className="card-body d-flex flex-column">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="producto-avatar me-2">
                                                        <i className="bi bi-basket2-fill text-success" style={{ fontSize: 26 }}></i>
                                                    </div>
                                                    <h5 className="card-title text-success mb-0" style={{ fontWeight: 700 }}>
                                                        {producto.nombre}
                                                    </h5>
                                                </div>
                                                <p className="card-text mb-2" style={{ color: "#333", minHeight: 40 }}>
                                                    {producto.descripcion}
                                                </p>
                                                <ul className="list-group list-group-flush mb-3">
                                                    <li className="list-group-item px-0 py-1 border-0">
                                                        <b>Precio:</b> <span className="text-success">${producto.precio}</span>
                                                    </li>
                                                    <li className="list-group-item px-0 py-1 border-0">
                                                        <b>Cantidad:</b> <span>{producto.cantidad}</span>
                                                    </li>
                                                    <li className="list-group-item px-0 py-1 border-0">
                                                        <b>Vence:</b> <span>{producto.vencimiento}</span>
                                                    </li>
                                                </ul>
                                                <div className="mt-auto text-end">
                                                    <span className="badge bg-gradient-ecofood px-3 py-2" style={{ fontSize: 14 }}>
                                                        Publicado por {empresaNombre}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                .empresa-productos-card {
                    background: linear-gradient(120deg, #f9fdfb 80%, #e0f2f1 100%);
                    border-radius: 22px;
                    border: 1px solid #e0f2f1;
                }
                .empresa-avatar {
                    width: 54px;
                    height: 54px;
                    background: #e8f5e9;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(56, 142, 60, 0.09);
                }
                .producto-publico-card {
                    border-radius: 16px;
                    background: linear-gradient(120deg, #f9fdfb 70%, #e0f2f1 100%);
                    transition: box-shadow 0.2s, transform 0.2s;
                    min-height: 260px;
                    display: flex;
                    flex-direction: column;
                    justify-content: stretch;
                }
                .producto-publico-card:hover {
                    box-shadow: 0 8px 32px rgba(56, 142, 60, 0.13);
                    transform: translateY(-4px) scale(1.02);
                }
                .producto-avatar {
                    width: 38px;
                    height: 38px;
                    background: #e8f5e9;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(56, 142, 60, 0.07);
                }
                .bg-gradient-ecofood {
                    background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
                    color: #fff;
                    border: none;
                }
                @media (max-width: 767px) {
                    .empresa-productos-card {
                        padding: 1.2rem !important;
                    }
                    .producto-publico-card {
                        min-height: 200px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductosPublicos;