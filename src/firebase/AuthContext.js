import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
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
}