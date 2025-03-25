// 🔹 Importation Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA8tfUFJTPsBTSeExj_IMWdqYwTVChmc8k",
  authDomain: "forumparent-fe5a2.firebaseapp.com",
  projectId: "forumparent-fe5a2",
  storageBucket: "forumparent-fe5a2.firebasestorage.app",
  messagingSenderId: "997546472497",
  appId: "1:997546472497:web:3c098e06c492cb312dd110",
  measurementId: "G-75XBD0M9FM"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Fonction pour envoyer les données du formulaire à Firebase
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Empêche le comportement par défaut du formulaire (rechargement de la page)

    // Récupérer les valeurs du formulaire
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Vérification basique pour s'assurer que tous les champs sont remplis
    if (name && email && subject && message) {
        // Créer une référence unique pour chaque message envoyé
        const newMessageRef = database.ref("messages").push();

        // Sauvegarder les données dans Firebase
        newMessageRef.set({
            name: name,
            email: email,
            subject: subject,
            message: message,
            timestamp: Date.now()  // Ajouter un timestamp pour chaque message
        })
        .then(() => {
            alert("Votre message a été envoyé avec succès !");
            // Réinitialiser le formulaire après l'envoi
            document.getElementById("contactForm").reset();
        })
        .catch((error) => {
            console.error("Erreur lors de l'envoi du message : ", error);
            alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
        });
    } else {
        alert("Veuillez remplir tous les champs.");
    }
    // Fonction pour envoyer les données du formulaire vers Firestore
  const envoyerFormulaire = async (formData) => {
    try {
      const docRef = await addDoc(collection(db, "contacts"), {
        nom: formData.nom,
        email: formData.email,
        message: formData.message,
      });
      console.log("Document ajouté avec ID: ", docRef.id);
    } catch (e) {
      console.error("Erreur lors de l'ajout du document: ", e);
    }
  };
  // Envoyer les données vers Firestore
    envoyerFormulaire(formData);
  
  
});