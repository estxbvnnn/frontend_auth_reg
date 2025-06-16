import React, { useState, useEffect } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import ProductoCard from "../../components/ProductoCard";
import ProductoModal from "../../components/ProductoModal";
import Swal from "sweetalert2";
import { deleteProducto } from "../../services/productoService";
import { useNavigate } from "react-router-dom";

export default function ProductosEmpresa() {
    const { userData, loading } = useAuth();
    const [empresa, setEmpresa] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const [error, setError] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [refreshTick, setRefreshTick] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: 0,
        cantidad: 1,
        vencimiento: "",
        id: null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!userData || !userData.uid) {
            setLocalLoading(false);
            setError("No hay datos de usuario autenticado.");
            return;
        }
        setLocalLoading(true);
        getDoc(doc(db, "empresas", userData.uid))
            .then((docSnap) => {
                if (docSnap.exists()) {
                    setEmpresa(docSnap.data());
                    setError("");
                } else {
                    setEmpresa(null);
                    setError("No tienes perfil de empresa registrado.");
                }
                setLocalLoading(false);
            })
            .catch(() => {
                setError("Error al cargar datos de empresa.");
                setLocalLoading(false);
            });
    }, [userData, loading]);

    if (loading || localLoading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando productos empresa...</span>
            </div>
        </div>
    );
    if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
    if (!empresa) return <div className="container mt-4"><div className="alert alert-warning">No tienes perfil de empresa registrado.</div></div>;

    const handleRefresh = () => setRefreshTick(t => t + 1);

    const eliminar = async (id) => {
        try {
            const confirm = await Swal.fire({
                title: "¿Eliminar producto?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
            });
            if (confirm.isConfirmed) {
                await deleteProducto(id);
                handleRefresh();
                Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
            }
        } catch (e) {
            console.error(e);
            Swal.fire("Error al eliminar", "", "error");
        }
    };

    const abrirModal = (producto = null) => {
        if (producto) {
            setFormData({ ...producto });
        } else {
            setFormData({
                nombre: "",
                descripcion: "",
                precio: 0,
                cantidad: 1,
                vencimiento: "",
                id: null,
            });
        }
        setShowModal(true);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow border-0 rounded-4 p-4">
                        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
                            <div>
                                <h2 className="mb-1 text-success fw-bold">
                                    <i className="bi bi-box-seam-fill me-2"></i>Gestión de Productos
                                </h2>
                                <p className="text-muted mb-0" style={{ fontSize: 16 }}>
                                    Administra tus productos, agrégalos, edítalos o elimínalos fácilmente.
                                </p>
                            </div>
                            <button
                                className="btn btn-gradient-green btn-lg mt-3 mt-md-0 shadow-sm d-flex align-items-center gap-2"
                                style={{
                                    background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "2rem",
                                    fontWeight: 600,
                                    fontSize: "1.15rem",
                                    boxShadow: "0 4px 16px rgba(67,233,123,0.15)",
                                    padding: "0.75rem 2rem",
                                    transition: "background 0.2s"
                                }}
                                onClick={() => abrirModal()}
                            >
                                <i className="bi bi-plus-circle fs-4"></i>
                                <span>Agregar Producto</span>
                            </button>
                        </div>
                        <div className="row g-3 align-items-center mb-4">
                            <div className="col-md-8">
                                <div className="input-group">
                                    <span className="input-group-text bg-success text-white">
                                        <i className="bi bi-search"></i>
                                    </span>
                                    <input
                                        className="form-control"
                                        type="search"
                                        placeholder="Buscar producto por nombre"
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 text-end d-flex justify-content-end gap-2">
                                <button className="btn btn-outline-success" onClick={handleRefresh}>
                                    <i className="bi bi-arrow-clockwise"></i> Actualizar
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate("/home")}
                                >
                                    <i className="bi bi-house-door me-1"></i> Volver al inicio
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <ProductoCard
                                    key={refreshTick}
                                    busqueda={busqueda}
                                    userData={userData}
                                    eliminar={eliminar}
                                    abrirModal={abrirModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProductoModal
                id={"productoModal"}
                show={showModal}
                setShow={setShowModal}
                userData={userData}
                formData={formData}
                setFormData={setFormData}
                abrirModal={abrirModal}
                handleRefresh={handleRefresh}
            />
            <style>{`
                .card {
                    background: #f9fdfb;
                }
                .btn-success, .btn-outline-success, .btn-gradient-green {
                    border-radius: 30px;
                }
                .btn-gradient-green:hover, .btn-gradient-green:focus {
                    background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
                    color: #fff;
                }
                .input-group-text {
                    border-radius: 30px 0 0 30px;
                }
                .form-control, .form-select {
                    border-radius: 0 30px 30px 0;
                }
                .bi-box-seam-fill {
                    font-size: 1.5rem;
                    vertical-align: -0.2em;
                }
                @media (max-width: 767px) {
                    .btn-lg, .btn-gradient-green {
                        width: 100%;
                    }
                    .text-end {
                        text-align: left !important;
                        margin-top: 10px;
                    }
                }
            `}</style>
        </div>
    );
}
