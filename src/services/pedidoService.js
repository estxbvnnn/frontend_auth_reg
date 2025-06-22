import { db } from "../firebase/config";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";

// Crear una solicitud de producto
export async function solicitarProducto({ producto, cantidad, userData, empresaNombre }) {
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