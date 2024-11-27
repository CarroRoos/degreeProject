import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhY4zWwoVzn9lKoLtOmkn5Y2BSyvAExww",
  authDomain: "degreeproject-24.firebaseapp.com",
  projectId: "degreeproject-24",
  storageBucket: "degreeproject-24.firebasestorage.app",
  messagingSenderId: "788933669319",
  appId: "1:788933669319:web:8408dae2d4774db36029e2",
  measurementId: "G-EX4FKHRGG1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
