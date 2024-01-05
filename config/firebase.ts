import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBMWOkD_WhkFO2PXghx7Js1mb1qae9kzw",
  authDomain: "traseeeficienteromania.firebaseapp.com",
  projectId: "traseeeficienteromania",
  storageBucket: "traseeeficienteromania.appspot.com",
  messagingSenderId: "430180292133",
  appId: "1:430180292133:web:8b62f975dddaf4d0b491cc",
  measurementId: "G-G1GJJ62TZJ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const adaugaAtractie = (title, address, rating) => {
  const newAttraction = { title: title, address: address, rating: rating };

  // Adăugare atracție nouă în baza de date Firebase
    // Adăugare atracție nouă în colecția 'attractions' din Firestore
  db.collection('attractions').add(newAttraction)
  .then((docRef) => {
    console.log('Atracție adăugată cu succes în Firestore cu ID-ul:', docRef.id);
    // Poți face alte acțiuni aici după adăugarea cu succes în Firestore
  })
  .catch((error) => {
    console.error('Eroare la adăugarea atracției în Firestore:', error);
  });

};