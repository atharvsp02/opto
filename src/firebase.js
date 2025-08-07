// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";1
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEClaWb6EXj_cQlraG3Pu7QEkV_p0Vhfo",
  authDomain: "opto-c6e8e.firebaseapp.com",
  projectId: "opto-c6e8e",
  storageBucket: "opto-c6e8e.firebasestorage.app",
  messagingSenderId: "711868333085",
  appId: "1:711868333085:web:4b5e3b890f405d1f121af4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };