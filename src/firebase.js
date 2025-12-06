import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // <-- Added for Admin Panel

// IMPORTANT: Replace these placeholders with your ACTUAL Firebase Project Configuration
// You obtained this object when you created the web app in the Firebase Console (Step 2).
const firebaseConfig = {
  apiKey: "AIzaSyCIT5l1GIHhQ6Cp_oCj1Yx0_jUvpOYyLkg",
  authDomain: "login-page-128c4.firebaseapp.com",
  projectId: "login-page-128c4",
  storageBucket: "login-page-128c4.firebasestorage.app",
  messagingSenderId: "563759706638",
  appId: "1:563759706638:web:79af117e339bb97564825f"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app); // Database service
export const auth = getAuth(app);   // Authentication service

// You can import and use 'db' and 'auth' in any React component or hook.