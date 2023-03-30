// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   // apiKey: "AIzaSyBVtAqdPqVWpzsk2zI4ZjvQXRXH71I6nPI",
//   // authDomain: "data-dev-317710.firebaseapp.com",
//   // projectId: "data-dev-317710",
//   // storageBucket: "data-dev-317710.appspot.com",
//   // messagingSenderId: "329296342382",
//   // appId: "1:329296342382:web:41789864bba34c1806a57f"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBVtAqdPqVWpzsk2zI4ZjvQXRXH71I6nPI",
  authDomain: "data-dev-317710.firebaseapp.com",
  projectId: "data-dev-317710",
  storageBucket: "data-dev-317710",
  messagingSenderId: "329296342382",
  appId: "1:329296342382:web:62fce565297a0e9506a57f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export{ storage };
