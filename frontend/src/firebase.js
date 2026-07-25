import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDNW5K9IflVblKL6AJcY7Hdhsqd4gEvFYs",
  authDomain: "lost-and-found-hub-dfdf2.firebaseapp.com",
  projectId: "lost-and-found-hub-dfdf2",
  storageBucket: "lost-and-found-hub-dfdf2.firebasestorage.app",
  messagingSenderId: "739896672619",
  appId: "1:739896672619:web:8e56fa0cbcf55f3e480c2e",
  measurementId: "G-LJ7TM9EMGK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
