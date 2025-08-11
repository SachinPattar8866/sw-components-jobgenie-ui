import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

// Firebase config from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Ensure session is persisted in localStorage
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

// 🔐 Email login
export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  return idToken;
};

// 🔐 Email signup
export const signupWithEmail = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  return idToken;
};
