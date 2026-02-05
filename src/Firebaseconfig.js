// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // ✅ Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyBNx2wykP2EMly8-bEubviiq60rKSLHIIk",
  authDomain: "cryptography-d876a.firebaseapp.com",
  projectId: "cryptography-d876a",
  storageBucket: "cryptography-d876a.appspot.com",
  messagingSenderId: "506916977814",
  appId: "1:506916977814:web:33f8141252201fc7f096b7",
  measurementId: "G-WRW251R897"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);        // Firestore
export const rtdb = getDatabase(app);       // ✅ Realtime Database
export const storage = getStorage(app);

// ✅ Safe Analytics initialization
export let analytics = null;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export default app;
