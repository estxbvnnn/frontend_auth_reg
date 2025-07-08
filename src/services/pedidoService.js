import { db } from "../firebase/config";
import { collection, addDoc, doc, updateDoc, getDoc, deleteDoc, query, where, orderBy, limit, startAfter, getDocs } from "firebase/firestore";

// Crear una solicitud de producto con validación de stock
export async function solicitarProducto({ producto, cantidad, userData, empresaNombre }) {
  // Validar stock actual en base de datos
  const productoRef = doc(db, "productos", producto.id);
  const productoSnap = await getDoc(productoRef);
  const stockActual = productoSnap.data().cantidad;

  // Calcular solicitudes pendientes para este producto
  const pendientesQ = query(
    collection(db, "solicitudes"),
    where("productoId", "==", producto.id),
    where("estado", "==", "pendiente")
  );
  const pendientesSnap = await getDocs(pendientesQ);
  const cantidadPendiente = pendientesSnap.docs.reduce((acc, doc) => acc + (Number(doc.data().cantidad) || 0), 0);
  const stockDisponible = stockActual - cantidadPendiente;

  if (Number(cantidad) > stockDisponible) {
    throw new Error(`Stock insuficiente. Solo quedan ${stockDisponible} unidades disponibles considerando solicitudes pendientes.`);
  }

  // Si el stock disponible es 1, verificar si el cliente ya tiene una solicitud pendiente para este producto
  if (stockDisponible === 1) {
    const q = query(
      collection(db, "solicitudes"),
      where("productoId", "==", producto.id),
      where("clienteId", "==", userData.uid),
      where("estado", "==", "pendiente")
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      throw new Error("Ya tienes una solicitud pendiente para este producto. Espera a que sea aprobada o rechazada antes de volver a solicitar.");
    }
  }
  return await addDoc(collection(db, "solicitudes"), {
    productoId: producto.id,
    productoNombre: producto.nombre,
    empresaId: producto.empresaId,
    empresaNombre: empresaNombre,
    clienteId: userData.uid,
    clienteNombre: userData.fullName,
    cantidad: Number(cantidad),
    estado: "pendiente",
    fecha: new Date(),
  });
}

// Cancelar solicitud (ahora solo cambia el estado a 'cancelado')
export async function cancelarSolicitud(solicitudId) {
  const solicitudRef = doc(db, "solicitudes", solicitudId);
  await updateDoc(solicitudRef, { estado: "cancelado" });
}

// Aprobar solicitud y descontar stock
export async function aprobarSolicitud(solicitudId) {
  const solicitudRef = doc(db, "solicitudes", solicitudId);
  await updateDoc(solicitudRef, { estado: "aprobado" });

  const solicitudSnap = await getDoc(solicitudRef);
  const { productoId, cantidad } = solicitudSnap.data();

  const productoRef = doc(db, "productos", productoId);
  const productoSnap = await getDoc(productoRef);
  const stockActual = productoSnap.data().cantidad;
  await updateDoc(productoRef, { cantidad: stockActual - cantidad });
}

// Rechazar solicitud (no cambia stock)
export async function rechazarSolicitud(solicitudId) {
  const solicitudRef = doc(db, "solicitudes", solicitudId);
  await updateDoc(solicitudRef, { estado: "rechazado" });
}

// Obtener solicitudes paginadas por cliente
export async function obtenerSolicitudesClientePaginadas({ clienteId, pageSize = 10, lastDoc = null }) {
  let q = query(
    collection(db, "solicitudes"),
    where("clienteId", "==", clienteId),
    orderBy("fecha", "desc"),
    limit(pageSize)
  );
  if (lastDoc) {
    q = query(
      collection(db, "solicitudes"),
      where("clienteId", "==", clienteId),
      orderBy("fecha", "desc"),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }
  const snap = await getDocs(q);
  return snap;
}

// Verificar si el usuario ya tiene una solicitud pendiente para un producto
export async function tieneSolicitudPendiente({ productoId, clienteId }) {
  const q = query(
    collection(db, "solicitudes"),
    where("productoId", "==", productoId),
    where("clienteId", "==", clienteId),
    where("estado", "==", "pendiente")
  );
  const snap = await getDocs(q);
  return !snap.empty;
}