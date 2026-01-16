
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2u3-jxnyCRbEu-wjX1DFAKQ6hw2CfItE",
  authDomain: "cruzeai.firebaseapp.com",
  projectId: "cruzeai",
  storageBucket: "cruzeai.firebasestorage.app",
  messagingSenderId: "48791641517",
  appId: "1:48791641517:web:246d0e0e7fb4cc858c1524",
  measurementId: "G-49JZYPSQT2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
};
