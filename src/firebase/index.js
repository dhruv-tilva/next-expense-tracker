// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6UdMyZ4jMajfK8B9cwUpR27ep6F75kRk",
  authDomain: "expanse-traker-b8dc3.firebaseapp.com",
  projectId: "expanse-traker-b8dc3",
  storageBucket: "expanse-traker-b8dc3.appspot.com",
  messagingSenderId: "440888901626",
  appId: "1:440888901626:web:56a230e9194b1a686dae43",
  measurementId: "G-8WKXS4L259",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
