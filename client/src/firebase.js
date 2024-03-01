// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-ghar.firebaseapp.com",
  projectId: "mern-ghar",
  storageBucket: "mern-ghar.appspot.com",
  messagingSenderId: "823988101099",
  appId: "1:823988101099:web:94d017feeca6ce14e683ae"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);