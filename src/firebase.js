// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";1
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: OPTO_KEY,
  authDomain: "opto-f4913.firebaseapp.com",
  projectId: "opto-f4913",
  storageBucket: "opto-f4913.firebasestorage.app",
  messagingSenderId: "929323026408",
  appId: "1:929323026408:web:18b436a7fafececad4865d",
  measurementId: "G-F7DYEST0YV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };

// const analytics = getAnalytics(app);