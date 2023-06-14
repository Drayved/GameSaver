// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKJjSw1QLRIEXlTgv133O6VTRXR3ZU6aI",
  authDomain: "gamesaver-52467.firebaseapp.com",
  projectId: "gamesaver-52467",
  storageBucket: "gamesaver-52467.appspot.com",
  messagingSenderId: "995477091855",
  appId: "1:995477091855:web:9a1628d8f66d17381f157a",
  measurementId: "G-WGHVZP9CB7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);