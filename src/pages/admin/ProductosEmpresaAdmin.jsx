import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import ProductoCard from "../../components/ProductoCard";
import ProductoModal from "../../components/ProductoModal";
import Swal from "sweetalert2";
import { deleteProducto } from "../../services/productoService";

export default function ProductosEmpresaAdmin() {
    const { id } = useParams(); // id de la empresa
    const [empresa, setEmpresa] = useState(null);
    const [loading, setLoading] = useState(true);
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
        setLoading(true);
        getDoc(doc(db, "empresas", id))
            .then((docSnap) => {
                if (docSnap.exists()) {
                    setEmpresa({ ...docSnap.data(), uid: id });
                    setError("");
                } else {
                    setEmpresa(null);
                    setError("No existe la empresa.");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Error al cargar datos de empresa.");
                setLoading(false);
            });
    }, [id]);

    const handleRefresh = () => setRefreshTick(t => t + 1);

    const eliminar = async (prodId) => {
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
                await deleteProducto(prodId);
                handleRefresh();
                Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
            }
        } catch (e) {
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

    if (loading) return <div className="text-center mt-5">Cargando...</div>;
    if (error) return <div className="alert alert-danger mt-4">{error}</div>;
    if (!empresa) return <div className="alert alert-warning mt-4">No existe la empresa.</div>;

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow border-0 rounded-4 p-4">
                        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
                            <div>
                                <h2 className="mb-1 text-success fw-bold">
                                    <i className="bi bi-box-seam-fill me-2"></i>Gestión de Productos de {empresa.nombre}
                                </h2>
                                <p className="text-muted mb-0" style={{ fontSize: 16 }}>
                                    Administra los productos de esta empresa.
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
                                    onClick={() => navigate("/admin/empresas")}
                                >
                                    <i className="bi bi-arrow-left me-1"></i> Volver a empresas
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <ProductoCard
                                    key={refreshTick}
                                    busqueda={busqueda}
                                    userData={empresa}
                                    eliminar={eliminar}
                                    abrirModal={abrirModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProductoModal
                show={showModal}
                setShow={setShowModal}
                userData={empresa}
                formData={formData}
                setFormData={setFormData}
                handleRefresh={handleRefresh}
            />
        </div>
    );
}