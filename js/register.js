// register.js (corrigé)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA8tfUFJTPsBTSeExj_IMWdqYwTVChmc8k",
  authDomain: "forumparent-fe5a2.firebaseapp.com",
  projectId: "forumparent-fe5a2",
  storageBucket: "forumparent-fe5a2.appspot.com",
  messagingSenderId: "997546472497",
  appId: "1:997546472497:web:3c098e06c492cb312dd110",
  measurementId: "G-75XBD0M9FM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Gestion du formulaire
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const username = document.getElementById("username").value.trim();

  if (password !== confirmPassword) {
    return alert("Les mots de passe ne correspondent pas !");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Enregistrement Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      username,
      email
    });

    alert("Inscription réussie !");
    window.location.href = "login.html";
  } catch (error) {
    alert("Erreur : " + error.message);
  }
});
