// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// import firebase from "firebase/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import "firebase/storage";
// import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAbr1X5txzj-dACMF2olJu-cpCTPdzGeWE",
  authDomain: "baboolsoft-church-project.firebaseapp.com",
  databaseURL: "gs://baboolsoft-church-project.appspot.com",
  projectId: "baboolsoft-church-project",
  storageBucket: "baboolsoft-church-project.appspot.com",
  messagingSenderId: "750386664329",
  appId: "1:750386664329:web:0c04994a84bca6d7b10758",
  measurementId: "G-0TSV7FX27Z",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const firebaseApp = initializeApp(firebaseConfig);
// export default app;
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
const db = firebase.firestore();
const storage = getStorage(firebaseApp);
// const storage = firebase.storage();

export { auth, firebase, db, storage };
