// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-qvrqWS9CMwcTop0vmDx5YJM8rjDIBbg",
  authDomain: "ai-resume-f89a2.firebaseapp.com",
  projectId: "ai-resume-f89a2",
  storageBucket: "ai-resume-f89a2.firebasestorage.app",
  messagingSenderId: "176553162563",
  appId: "1:176553162563:web:b4eb06c811eb87e301a1f6",
  measurementId: "G-NVYE9ZSJZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);