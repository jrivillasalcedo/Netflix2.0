import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDNzkCGHXVw0I18k7QBsJ-NftPfbNq62Dk",
  authDomain: "netflix-clone-cd0db.firebaseapp.com",
  projectId: "netflix-clone-cd0db",
  storageBucket: "netflix-clone-cd0db.appspot.com",
  messagingSenderId: "221878904861",
  appId: "1:221878904861:web:4241251aa01c28fe563ef4",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

function registerWithEmailAndPassword(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

function logInWithEmailAndPassword(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export { auth, registerWithEmailAndPassword, logInWithEmailAndPassword };
export default db;
