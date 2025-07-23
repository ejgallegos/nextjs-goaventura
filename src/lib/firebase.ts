
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "goaventura-web",
  "appId": "1:172319170728:web:854211790cb334dd2fa29d",
  "storageBucket": "goaventura-web.firebasestorage.app",
  "apiKey": "AIzaSyB1W3UhchQeohnlBTuAd_YAjJlPOyOI96w",
  "authDomain": "goaventura-web.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "172319170728"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
