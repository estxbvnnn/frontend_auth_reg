import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { obtenerTotalProductos, getProductosByEmpresaPagina } from '../services/productoService';
import dayjs from "dayjs";
import '../styles/main.css';

export default function ProductoCard({ userData, eliminar, abrirModal, orden, pageSize: initialPageSize = 6 }) {
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Filtros
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [precioFiltro, setPrecioFiltro] = useState("todos");
  const [busquedaPrecio, setBusquedaPrecio] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPaginas = Math.ceil(total / pageSize);

  useEffect(() => {
    setPagina(0);
  }, [busquedaNombre, estadoFiltro, orden, pageSize, precioFiltro, busquedaPrecio, userData]);

  useEffect(() => {
    if (!userData) return;
    obtenerTotalProductos(userData.uid, busquedaNombre, estadoFiltro).then(setTotal);
  }, [userData, busquedaNombre, estadoFiltro]);

  useEffect(() => {
    if (!userData) return;
    setCargando(true);
    getProductosByEmpresaPagina(
      userData.uid,
      pagina,
      busquedaNombre,
      estadoFiltro,
      orden,
      pageSize
    ).then((res) => {
      let filtrados = res.productos || [];
      if (precioFiltro === "mayor1000") filtrados = filtrados.filter(p => Number(p.precio) > 1000);
      if (precioFiltro === "menor1000") filtrados = filtrados.filter(p => Number(p.precio) < 1000);
      if (precioFiltro === "gratis") filtrados = filtrados.filter(p => Number(p.precio) === 0);
      if (busquedaPrecio !== "") {
        const val = Number(busquedaPrecio);
        if (!isNaN(val)) {
          filtrados = filtrados.filter(p => Number(p.precio) === val);
        }
      }
      setProductos(filtrados);
      setCargando(false);
    });
  }, [pagina, userData, busquedaNombre, estadoFiltro, orden, pageSize, precioFiltro, busquedaPrecio]);

  return (
    <div className="productos-container">
      {/* Filtros decorados */}
      <div className="filtros-bar">
        <div className="filtro-group">
          <label className="filtro-label">Buscar nombre</label>
          <input
            type="text"
            className="filtro-input"
            value={busquedaNombre}
            onChange={e => setBusquedaNombre(e.target.value)}
            placeholder="Nombre del producto"
          />
        </div>
        <div className="filtro-group">
          <label className="filtro-label">Filtrar por estado</label>
          <select
            className="filtro-select"
            value={estadoFiltro}
            onChange={e => setEstadoFiltro(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="disponible">Disponible</option>
            <option value="por-vencer">Por vencer</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>
        <div className="filtro-group">
          <label className="filtro-label">Filtrar por precio</label>
          <select
            className="filtro-select"
            value={precioFiltro}
            onChange={e => setPrecioFiltro(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="gratis">Gratis</option>
            <option value="mayor1000">Mayor a $1000</option>
            <option value="menor1000">Menor a $1000</option>
          </select>
        </div>
        <div className="filtro-group">
          <label className="filtro-label">Buscar precio</label>
          <input
            type="number"
            min={0}
            className="filtro-input"
            value={busquedaPrecio}
            onChange={e => setBusquedaPrecio(e.target.value)}
            placeholder="Precio exacto"
          />
        </div>
        <div className="filtro-group">
          <label className="filtro-label">Mostrar</label>
          <select
            className="filtro-select"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
      {productos.length === 0 && !cargando && <div className="no-productos">No hay productos.</div>}
      <div className="productos-grid">
        {productos.map((producto) => {
          // Estado del producto
          const hoy = dayjs();
          const venceEn = dayjs(producto.fechaVencimiento).diff(hoy, 'day');
          let estado = "";
          if (venceEn < 0) estado = "vencido";
          else if (venceEn <= 3) estado = "por-vencer";
          else estado = "disponible";
          // Filtrado por estado (frontend)
          if (estadoFiltro !== "todos" && estado !== estadoFiltro) return null;
          return (
            <div className="producto-card" key={producto.id}>
              <h3>{producto.nombre}</h3>
              <p className="descripcion">{producto.descripcion}</p>
              <p>
                <b>Precio:</b>{" "}
                {Number(producto.precio) === 0 ? (
                  <span style={{ color: "#388e3c", fontWeight: "bold" }}>Gratis</span>
                ) : (
                  `$${producto.precio}`
                )}
              </p>
              <p>
                <b>Stock:</b> {producto.cantidad}
                {Number(producto.cantidad) === 0 && (
                  <span className="badge-sin-stock ms-2">Sin stock</span>
                )}
              </p>
              <p>
                <b>Vence:</b> {dayjs(producto.fechaVencimiento).format("DD/MM/YYYY")}
                {estado === "vencido" && (
                  <span className="badge bg-danger ms-2">Vencido</span>
                )}
                {estado === "por-vencer" && (
                  <span className="badge bg-warning text-dark ms-2">Por vencer</span>
                )}
              </p>
              <div className="acciones">
                <button className="btn-editar" onClick={() => abrirModal(producto)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminar(producto.id)}>Eliminar</button>
              </div>
            </div>
          );
        })}
      </div>
      {cargando && <div className="cargando">Cargando...</div>}
      {/* Paginador centrado */}
      <div className="paginacion" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1.5rem" }}>
        <button
          className="btn-editar"
          onClick={() => setPagina(p => Math.max(0, p - 1))}
          disabled={pagina === 0}
        >
          &lt; Anterior
        </button>
        <span style={{ margin: "0 1rem" }}>
          Página {pagina + 1} de {totalPaginas || 1}
        </span>
        <button
          className="btn-editar"
          onClick={() => setPagina(p => (p + 1 < totalPaginas ? p + 1 : p))}
          disabled={pagina + 1 >= totalPaginas}
        >
          Siguiente &gt;
        </button>
      </div>
      <div className="total-productos">Total productos: {total}</div>
      <style>{`
        .badge-sin-stock {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #e57373;
          font-weight: 600;
          border-radius: 12px;
          font-size: 0.95rem;
          padding: 4px 12px;
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
}

ProductoCard.propTypes = {
  userData: PropTypes.object,
  eliminar: PropTypes.func,
  abrirModal: PropTypes.func,
  orden: PropTypes.string,
  pageSize: PropTypes.number,
};