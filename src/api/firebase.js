import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For security, these should be stored in environment variables
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID
// };
const firebaseConfig = {
  apiKey: "AIzaSyCCyd7fVIyu-6MffkvIDqLWXulXqfIqGnc",
  authDomain: "fitness-6b841.firebaseapp.com",
  projectId: "fitness-6b841",
  storageBucket: "fitness-6b841.firebasestorage.app",
  messagingSenderId: "805695162103",
  appId: "1:805695162103:web:c5ce0c5476736c2024b5f2",
  measurementId: "G-7ZD3SW2J49"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.appId;

export { auth, db, appId };