import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCKJjSw1QLRIEXlTgv133O6VTRXR3ZU6aI",
    authDomain: "gamesaver-52467.firebaseapp.com",
    projectId: "gamesaver-52467",
    storageBucket: "gamesaver-52467.appspot.com",
    messagingSenderId: "995477091855",
    appId: "1:995477091855:web:9a1628d8f66d17381f157a",
    measurementId: "G-WGHVZP9CB7"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
