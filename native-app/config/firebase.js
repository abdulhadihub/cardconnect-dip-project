// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "firebase/auth"; // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEmY03Ct_70UqQzdbWDsgeAjzrrRyXtRQ",
  authDomain: "madterminal-2d095.firebaseapp.com",
  projectId: "madterminal-2d095",
  storageBucket: "madterminal-2d095.appspot.com",
  messagingSenderId: "910969477164",
  appId: "1:910969477164:web:565f1eaccfc40ccf8b9989"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const Storage = getStorage(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
