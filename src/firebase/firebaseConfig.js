// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from 'firebase/auth';
import { getFirestore, } from 'firebase/firestore'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB_RL_NY_eJ5qRkSDReTEVudjfS0cigi74",
    authDomain: "yarin-levi-personal-trainer.firebaseapp.com",
    projectId: "yarin-levi-personal-trainer",
    storageBucket: "yarin-levi-personal-trainer.appspot.com",
    messagingSenderId: "771157110230",
    appId: "1:771157110230:web:55bee9a32227d54a2d4877",
    measurementId: "G-E2XGM7BKJK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);