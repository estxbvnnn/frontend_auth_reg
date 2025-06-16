import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Busca los datos de empresa en la colección "empresas"
        const empresaRef = doc(db, "empresas", user.uid);
        const empresaSnap = await getDoc(empresaRef);
        if (empresaSnap.exists()) {
          setUserData({ uid: user.uid, ...empresaSnap.data() });
        } else {
          setUserData({ uid: user.uid }); // Solo UID si no es empresa
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}