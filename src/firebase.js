// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";1
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };

// const analytics = getAnalytics(app);