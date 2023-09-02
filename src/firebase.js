import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCaoGMcSu9M8aDgAvGPIqwWn2ADJEXhrfY",
    authDomain: "sipa-a272a.firebaseapp.com",
    projectId: "sipa-a272a",
    storageBucket: "sipa-a272a.appspot.com",
    messagingSenderId: "155447689441",
    appId: "1:155447689441:web:b5a792bd522a7ee87cb7a0",
    measurementId: "G-0GB8467H0D",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
