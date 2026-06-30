import React, { createContext, useState, useEffect, useCallback } from "react";
import type { User } from "firebase/auth";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getMe } from "@/api";

export interface UserData {
    id: string;
    display_name: string | null;
    email: string | null;
    coins: number;
    created_at: string;
}

interface ContextValue {
    user: User | null;
    userData: UserData | null;
    showData: string;
    setShowData: (key: string) => void;
    logout: () => Promise<void>;
    authLoading: boolean;
    refreshUserData: () => Promise<void>;
}

export const Context = createContext<ContextValue>({} as ContextValue);

export default function ContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
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
