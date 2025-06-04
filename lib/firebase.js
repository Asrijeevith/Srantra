// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6gDLVdLJSOdEMaOJZiLYJIHwC4_pgNc4",
  authDomain: "srantra-82c07.firebaseapp.com",
  projectId: "srantra-82c07",
  storageBucket: "srantra-82c07.firebasestorage.app",
  messagingSenderId: "456608244763",
  appId: "1:456608244763:web:ad5f59c50cb36219e504be",
  measurementId: "G-W5X9L4GE4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Analytics only on the client side
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { app, analytics, auth }; 