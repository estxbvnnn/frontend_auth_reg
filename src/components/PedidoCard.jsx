import React from "react";

const PedidoCard = ({ pedido, onCancelar }) => (
  <div className="card mb-3">
    <div className="card-body">
      <h5 className="card-title">{pedido.productoNombre}</h5>
      <p><b>Empresa:</b> {pedido.empresaNombre}</p>
      <p><b>Cantidad:</b> {pedido.cantidad}</p>
      <p><b>Estado:</b> {pedido.estado}</p>
      {pedido.estado === "pendiente" && onCancelar && (
        <button className="btn btn-danger btn-sm" onClick={() => onCancelar(pedido.id)}>
          Cancelar solicitud
        </button>
      )}
    </div>
  </div>
);

export default PedidoCard;