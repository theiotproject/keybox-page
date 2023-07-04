// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0699PeG2QUL5NUL7kmXlpVG7-HRGvd7E",
  authDomain: "keybox-project.firebaseapp.com",
  projectId: "keybox-project",
  storageBucket: "keybox-project.appspot.com",
  messagingSenderId: "765568439761",
  appId: "1:765568439761:web:367fd9c4b05b289b78bcf0",
  measurementId: "G-G44925YCKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);