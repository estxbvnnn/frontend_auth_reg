import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth, db } from './config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null); // Firebase Auth user
    const [userData, setUserData] = useState(null); // Firestore user data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                try {
                    const docRef = doc(db, 'usuarios', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        setUserData(null);
                    }
                } catch (error) {
                    setUserData(null);
                }
            } else {
                setCurrentUser(null);
                setUserData(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, userData, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}