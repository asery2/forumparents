import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Exporter l'objet auth
export { auth };

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim(); // Modifié de "username" à "email"
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    const username = snapshot.docs[0]?.data()?.username || "Utilisateur";

    localStorage.setItem("forum_username", username);
    window.location.href = "index.html";
  } catch (error) {
    alert("Erreur : " + error.message);
  }
});