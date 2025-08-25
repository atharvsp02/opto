// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_OPTO_KEY,
  authDomain: import.meta.env.VITE_OPTO_AUTHDOMAIN,
  projectId: import.meta.env.VITE_OPTO_PROJECTID,
  storageBucket: import.meta.env.VITE_OPTO_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_OPTO_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_OPTO_APPID,
  measurementId: import.meta.env.VITE_OPTO_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Firestore
const db = getFirestore(app);

export { app, auth, provider, db };
