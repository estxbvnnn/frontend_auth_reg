import React, { useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import ProductoCard from "../../components/ProductoCard";
import ProductoModal from "../../components/ProductoModal";
import { useNavigate } from "react-router-dom";

export default function ProductosEmpresa() {
  const { userData } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [refreshTick, setRefreshTick] = useState(0);
  const navigate = useNavigate();

  const handleRefresh = () => setRefreshTick(t => t + 1);

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

  if (!userData) return <div className="text-center py-5">Cargando...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="text-success fw-bold mb-0" style={{ letterSpacing: 1 }}>
          <i className="bi bi-box-seam-fill me-2"></i>Mis Productos
        </h2>
        <button
          className="btn btn-gradient-ecofood btn-lg d-flex align-items-center gap-2"
          style={{
            borderRadius: "2rem",
            fontWeight: 600,
            fontSize: "1.1rem",
            padding: "0.5rem 1.5rem"
          }}
          onClick={() => abrirModal()}
        >
          <i className="bi bi-plus-circle fs-4"></i>
          <span>Agregar Producto</span>
        </button>
      </div>
      <ProductoCard
        key={refreshTick}
        userData={userData}
        abrirModal={abrirModal}
      />
      <ProductoModal
        show={showModal}
        setShow={setShowModal}
        userData={userData}
        formData={formData}
        setFormData={setFormData}
        handleRefresh={handleRefresh}
      />
      <button
        className="btn btn-outline-success mt-4"
        onClick={() => navigate("/home")}
      >
        <i className="bi bi-house-door me-2"></i>Volver al inicio
      </button>
    </div>
  );
}