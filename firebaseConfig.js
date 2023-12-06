import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDckzfJ8Oj9daCalvpHPqyeZht9QaGfqWU",
  authDomain: "homiehub-2f321.firebaseapp.com",
  projectId: "homiehub-2f321",
  storageBucket: "homiehub-2f321.appspot.com",
  messagingSenderId: "310676333279",
  appId: "1:310676333279:web:a758df8ff6c09d78d7ff6a"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);


