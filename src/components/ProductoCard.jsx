import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { obtenerTotalProductos, getProductosByEmpresaPagina } from '../services/productoService';
import dayjs from "dayjs";

export default function ProductoCard({ userData, busqueda, eliminar, abrirModal, estadoFiltro, orden, pageSize }) {
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [productos, setProductos] = useState([]);
  const [sinMas, setSinMas] = useState(false);

  useEffect(() => {
    if (!userData) return;
    obtenerTotalProductos(userData.uid, busqueda, estadoFiltro).then(setTotal);
  }, [userData, busqueda, estadoFiltro]);

  useEffect(() => {
    if (!userData) return;
    getProductosByEmpresaPagina(userData.uid, pagina, busqueda, estadoFiltro, orden, pageSize).then(({ productos: nuevos, sinMas }) => {
      setProductos(nuevos);
      setSinMas(sinMas);
    });
  }, [pagina, userData, busqueda, estadoFiltro, orden, pageSize]);

  const hoy = dayjs();

  return (
    <div className="row mt-4">
      {productos.length === 0 && <div className="text-center text-muted">No hay productos.</div>}
      {productos.map((p, i) => {
        const venceEn = dayjs(p.vencimiento).diff(hoy, 'day');
        let estado = "";
        if (venceEn < 0) estado = "vencido";
        else if (venceEn <= 3) estado = "por-vencer";
        else estado = "disponible";
        return (
          <div key={i} className="col-md-4 mb-3">
            <div className={`card h-100 border-${estado === "vencido" ? "danger" : estado === "por-vencer" ? "warning" : "success"}`}>
              <div className="card-body">
                <h5 className="card-title">{p.nombre} {p.precio === 0 && <span className="badge bg-info">Gratuito</span>}</h5>
                <p className="card-text">{p.descripcion}</p>
                <p className="card-text mb-1"><b>Precio:</b> ${p.precio}</p>
                <p className="card-text mb-1"><b>Cantidad:</b> {p.cantidad}</p>
                <p className="card-text mb-1"><b>Vence:</b> {p.vencimiento} {estado === "vencido" && <span className="badge bg-danger ms-2">Vencido</span>} {estado === "por-vencer" && <span className="badge bg-warning text-dark ms-2">Por vencer</span>}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-warning btn-sm" onClick={() => abrirModal(p)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminar(p.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="col-12 mt-3">
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pagina < 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPagina(p => p - 1)}>&lt;</button>
            </li>
            <li className={`page-item ${sinMas ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPagina(p => p + 1)}>&gt;</button>
            </li>
          </ul>
        </nav>
        <p className="text-center">Total de productos: {total}</p>
      </div>
    </div>
  );
}