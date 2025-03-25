// 🔹 Importation Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Soumission du formulaire
document.getElementById("contactForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  // Récupération des valeurs du formulaire
  const nom = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  if (nom && email && subject && message) {
    try {
      await addDoc(collection(db, "contacts"), {
        nom: nom,
        email: email,
        sujet: subject,
        message: message,
        date: new Date().toISOString()
      });
      alert("Message envoyé avec succès !");
      document.getElementById("contactForm").reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Erreur lors de l'envoi du message.");
    }
  } else {
    alert("Veuillez remplir tous les champs.");
  }
});