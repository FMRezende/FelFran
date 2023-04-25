import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
    apiKey: "AIzaSyA20yUCotPhVT_3hGWiurpDhgoq3fEevVM",
    authDomain: "todolistfinalproject-2fb4f.firebaseapp.com",
    projectId: "todolistfinalproject-2fb4f",
    storageBucket: "todolistfinalproject-2fb4f.appspot.com",
    messagingSenderId: "969027310069",
    appId: "1:969027310069:web:5077e13a59f664d8ebd0bc"
  };
  
  initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getFirestore();
  
  export {auth,db};