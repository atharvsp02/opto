import React, { createContext, useState, useEffect, useCallback } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getMe } from "../api";
import SkeletonLoader from "../components/AnimatedComponents/SkeletonLoader";

export const Context = createContext();

export default function ContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [showData, setShowData] = useState("all");

    const refreshUserData = useCallback(async () => {
        if (!auth.currentUser) return;
        try {
            setUserData(await getMe());
        } catch {
            setUserData(null);
        }
    }, []);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                await refreshUserData();
            } else {
                setUser(null);
                setUserData(null);
            }
            setAuthLoading(false);
        });

        return () => unsubscribeAuth();
    }, [refreshUserData]);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <Context.Provider value={{ user, userData, showData, setShowData, logout, authLoading, refreshUserData }}>
            {children}
        </Context.Provider>
    );
}
