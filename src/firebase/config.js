import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCOE0IzzvwFBY5B-n6Yzq6mtjWz8lE2f7c",
    authDomain: "ecofood-app-3a32a.firebaseapp.com",
    projectId: "ecofood-app-3a32a",
    storageBucket: "ecofood-app-3a32a.appspot.com", 
    messagingSenderId: "42760227219",
    appId: "1:42760227219:web:5afb1d63984e7ee2150066"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, firebaseConfig };
