// context.jsx
import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const Context = createContext();

export default function ContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showData, setShowData] = useState("all");

    async function saveOpinion(userId, questionId, answer) {
        const ref = doc(db, "portfolios", userId);

        // Save user’s opinion for that question
        await setDoc(
            ref,
            {
                [questionId]: { answer, status: "pending" } // pending = waiting for result
            },
            { merge: true }
        );
    }


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
