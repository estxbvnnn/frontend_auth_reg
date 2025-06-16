import { db } from "../firebase/config";
import { collection, setDoc, getDocs, updateDoc, query, where, deleteDoc, doc, orderBy, limit, startAt, endAt, startAfter, getCountFromServer } from "firebase/firestore";

export const addProducto = async (producto) => {
  const ref = doc(collection(db, "productos"));
  const productoConId = { ...producto, id: ref.id };
  await setDoc(ref, productoConId);
};

export const deleteProducto = async (id) => await deleteDoc(doc(db, "productos", id));

export const updateProducto = async (id, data) => {
  const ref = doc(db, "productos", id);
  await updateDoc(ref, data);
};

export async function obtenerTotalProductos(empresaId, busqueda = "", estadoFiltro = "todos") {
  let q = query(collection(db, "productos"), where("empresaId", "==", empresaId));
  if (busqueda.trim() !== "") {
    const term = busqueda.toLowerCase();
    q = query(q, orderBy("nombre"), startAt(term), endAt(term + "\uf8ff"));
  }
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

export const getProductosByEmpresaPagina = async (empresaId, pagina = 0, nombre = "", estadoFiltro = "todos", orden = "nombre-asc", pageSize = 5) => {
  let ref = collection(db, "productos");
  let q = query(ref, where("empresaId", "==", empresaId));
  // Filtros
  if (nombre.trim() !== "") {
    const term = nombre.toLowerCase();
    q = query(q, orderBy("nombre"), startAt(term), endAt(term + "\uf8ff"));
  } else {
    if (orden.startsWith("nombre")) q = query(q, orderBy("nombre", orden.endsWith("desc") ? "desc" : "asc"));
    if (orden.startsWith("precio")) q = query(q, orderBy("precio", orden.endsWith("desc") ? "desc" : "asc"));
  }
  q = query(q, limit(pageSize));
  const snapshot = await getDocs(q);
  const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const sinMas = productos.length < pageSize;
  return { productos, sinMas };
};