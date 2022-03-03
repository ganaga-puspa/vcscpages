// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app"
// import firebase from "firebase/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"
import { initializeApp } from "firebase/app"
import "firebase/storage"
// import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABSE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_API_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const firebaseApp = initializeApp(firebaseConfig)
// const storageRef = firebase.storage().ref();
// export default app;
firebase.initializeApp(firebaseConfig)
var auth = firebase.auth()
const db = firebase.firestore()
const storage = getStorage(firebaseApp)
// const storage = firebase.storage();

export { auth, firebase, db, storage }
