import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSowoYmeJ0Ljlc-2EAfi0iqC36gVSYTS4",
  authDomain: "traseueficientlocatiiromania.firebaseapp.com",
  projectId: "traseueficientlocatiiromania",
  storageBucket: "traseueficientlocatiiromania.appspot.com",
  messagingSenderId: "309928929675",
  appId: "1:309928929675:web:cfb7212589c63f4031678e",
  measurementId: "G-DHYEWR524C"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
