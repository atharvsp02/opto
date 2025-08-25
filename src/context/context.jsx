// context.jsx
import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const Context = createContext();

export default function ContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showData, setShowData] = useState("all");

    useEffect(() => {
        // 🔹 Keeps user logged in even after refresh
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <Context.Provider value={{ user, setUser, showData, setShowData, logout }}>
            {!loading ? children : <p className="text-white">Loading...</p>}
        </Context.Provider>
    );
}
