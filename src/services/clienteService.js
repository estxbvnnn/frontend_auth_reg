import { db } from "../firebase/config";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

export async function obtenerEmpresas() {
  const snapshot = await getDocs(collection(db, "empresas"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function obtenerProductos() {
  const snapshot = await getDocs(collection(db, "productos"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

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