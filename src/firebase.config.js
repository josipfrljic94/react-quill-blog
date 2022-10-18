// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfplQzrHUos_ji9k5aKw7-6vMiSqzou68",
  authDomain: "blogg-app-514f5.firebaseapp.com",
  projectId: "blogg-app-514f5",
  storageBucket: "blogg-app-514f5.appspot.com",
  messagingSenderId: "70286887762",
  appId: "1:70286887762:web:94b2927ec0f275dd37488b",
  measurementId: "G-TNL99X811G"
  // storageBucket: 'my-blog',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);
