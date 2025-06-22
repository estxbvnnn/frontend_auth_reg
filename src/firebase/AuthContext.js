import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config"; // <--- IMPORTA DESDE config.js

const AuthContext = createContext();

export function useAuth() {
<<<<<<< HEAD
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setCurrentUser(firebaseUser);
            if (firebaseUser) {
                // Siempre busca en la colección usuarios
                const docRef = doc(db, "usuarios", firebaseUser.uid);
                const docSnap = await getDoc(docRef);
                setUserData(docSnap.exists() ? { ...docSnap.data(), uid: firebaseUser.uid } : null);
            } else {
                setUserData(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, userData, loading }}>
            {children}
        </AuthContext.Provider>
    );
=======
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Busca primero en empresas
        const empresaRef = doc(db, "empresas", user.uid);
        const empresaSnap = await getDoc(empresaRef);
        if (empresaSnap.exists()) {
          setUserData({ uid: user.uid, ...empresaSnap.data() });
        } else {
          // Si no es empresa, busca en usuarios (admins y clientes)
          const userRef = doc(db, "usuarios", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData({ uid: user.uid, ...userSnap.data() });
          } else {
            setUserData({ uid: user.uid }); // Solo UID si no hay datos
          }
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
>>>>>>> ffed50f4faa853e53a0e91c6b7457e078ff561f0
}