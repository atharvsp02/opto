import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import SkeletonLoader from "../Components/AnimatedComponents/SkeletonLoader";

export const Context = createContext();

export default function ContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); // 👈 renamed for clarity
    const [showData, setShowData] = useState("all");

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                setTimeout(() => setAuthLoading(false), 100); // 👈 small debounce
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                    setUserData(docSnap.exists() ? docSnap.data() : null);
                });
                return () => unsubscribeSnapshot();
            } else {
                setUser(null);
                setUserData(null);
                setTimeout(() => setAuthLoading(false), 100); // 👈 same here
            }

        });

        return () => unsubscribeAuth();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <Context.Provider value={{ user, userData, showData, setShowData, logout, authLoading }}>
            {children}
        </Context.Provider>
    );
}
