/**
 * Firebase Configuration
 * Initialize Firebase services for the application
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
const auth = getAuth(app);

// Connect to Auth Emulator in development
if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR) {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { app, auth };

export function getFirebaseAuth() {
  return auth;
}

export function getFirebaseApp() {
  return app;
}