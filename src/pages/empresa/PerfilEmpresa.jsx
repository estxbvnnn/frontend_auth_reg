import { addProducto, updateProducto } from '../services/productoService';
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import dayjs from "dayjs";

export default function ProductoModal({ show, setShow, userData, handleRefresh, formData = {}, setFormData }) {
  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!formData.nombre?.trim() || !formData.vencimiento || formData.cantidad < 1) {
      Swal.fire("Completa todos los campos obligatorios", "", "warning");
      return;
    }
    if (formData.precio > 9999999) {
      Swal.fire("El precio no puede ser mayor a 9.999.999", "", "error");
      return;
    }
    if (formData.cantidad > 999999) {
      Swal.fire("La cantidad no puede ser mayor a 999.999", "", "error");
      return;
    }
    if (dayjs(formData.vencimiento).isBefore(dayjs(), 'day')) {
      Swal.fire("La fecha de vencimiento no puede ser anterior a hoy", "", "error");
      return;
    }
    if (formData.id) {
      await updateProducto(formData.id, formData);
      Swal.fire("Actualizado correctamente", "", "success");
    } else {
      await addProducto({ ...formData, empresaId: userData.uid });
      Swal.fire("Agregado correctamente", "", "success");
    }
    handleRefresh();
    setShow(false);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered backdrop="static" keyboard={false}>
      <form onSubmit={guardarProducto}>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            {formData.id ? "Editar Producto" : "Agregar Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="table-responsive">
            <table className="table align-middle table-bordered table-form-producto mb-0">
              <tbody>
                <tr>
                  <th className="bg-success text-white" style={{ width: 180 }}>Nombre</th>
                  <td>
                    <input
                      className="form-control"
                      placeholder="Ej: Tomate Cherry"
                      value={formData.nombre || ""}
                      onChange={e => setFormData(f => ({ ...f, nombre: e.target.value }))}
                      required
                      minLength={3}
                      maxLength={60}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="bg-success text-white">Descripción</th>
                  <td>
                    <textarea
                      className="form-control"
                      placeholder="Describe brevemente el producto"
                      value={formData.descripcion || ""}
                      onChange={e => setFormData(f => ({ ...f, descripcion: e.target.value }))}
                      rows={2}
                      maxLength={200}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="bg-success text-white">Precio</th>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Precio"
                      value={formData.precio || ""}
                      min={0}
                      max={9999999}
                      step={0.01}
                      onChange={e => {
                        let value = e.target.value;
                        if (value > 9999999) value = 9999999;
                        setFormData(f => ({ ...f, precio: Number(value) }));
                      }}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th className="bg-success text-white">Cantidad</th>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Cantidad"
                      value={formData.cantidad || ""}
                      min={1}
                      max={999999}
                      onChange={e => {
                        let value = e.target.value;
                        if (value > 999999) value = 999999;
                        setFormData(f => ({ ...f, cantidad: Number(value) }));
                      }}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th className="bg-success text-white">Fecha de vencimiento</th>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.vencimiento || ""}
                      onChange={e => setFormData(f => ({ ...f, vencimiento: e.target.value }))}
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-light d-flex justify-content-between flex-wrap gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => setShow(false)}>
            <i className="bi bi-x-circle me-1"></i> Cancelar
          </button>
          <button type="submit" className="btn btn-success">
            <i className="bi bi-save me-1"></i> {formData.id ? "Guardar Cambios" : "Agregar Producto"}
          </button>
        </Modal.Footer>
      </form>
      <style>{`
        .table-form-producto th {
          vertical-align: middle;
          font-size: 1rem;
          width: 180px;
          background: #43a047 !important;
          color: #fff !important;
          border-radius: 8px 0 0 8px;
        }
        .table-form-producto td {
          background: #fff;
          border-radius: 0 8px 8px 0;
        }
        .table-form-producto input,
        .table-form-producto textarea {
          border-radius: 8px;
          font-size: 1rem;
        }
        .table-form-producto tr {
          border-radius: 8px;
        }
        @media (max-width: 600px) {
          .table-form-producto th, .table-form-producto td {
            font-size: 0.97rem;
            padding: 8px 6px;
          }
        }
      `}</style>
    </Modal>
    );
}
