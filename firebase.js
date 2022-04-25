// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-dRgphMasNI-SvRkx3umpw9EOzIVD8lY",
    authDomain: "fir-auth-9f11c.firebaseapp.com",
    projectId: "fir-auth-9f11c",
    storageBucket: "fir-auth-9f11c.appspot.com",
    messagingSenderId: "238687370984",
    appId: "1:238687370984:web:2554b5084784fff433535d"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth();

export { auth };