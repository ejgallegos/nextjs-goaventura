
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration - client side only
// Use environment variables for sensitive data
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// Validate required Firebase configuration
const requiredConfigVars = [
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_API_KEY'
];

const missingConfig = requiredConfigVars.filter(varName => !process.env[varName]);

if (missingConfig.length > 0 && process.env.NODE_ENV === 'production') {
  throw new Error(`Missing required Firebase configuration: ${missingConfig.join(', ')}`);
}

// Provide fallback for development only
if (!firebaseConfig.projectId) {
  console.warn('Firebase project ID not found. Using fallback for development.');
  firebaseConfig.projectId = 'goaventura-web';
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
