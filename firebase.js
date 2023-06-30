import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.VITE_RAWG_KEY,
    authDomain: "gamesaver-52467.firebaseapp.com",
    projectId: "gamesaver-52467",
    storageBucket: "gamesaver-52467.appspot.com",
    messagingSenderId: "995477091855",
    appId: "1:995477091855:web:9a1628d8f66d17381f157a",
    measurementId: "G-WGHVZP9CB7"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };

export default firebaseApp;
