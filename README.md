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

#ancien code 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8tfUFJTPsBTSeExj_IMWdqYwTVChmc8k",
  authDomain: "forumparent-fe5a2.firebaseapp.com",
  projectId: "forumparent-fe5a2",
  storageBucket: "forumparent-fe5a2.appspot.com",
  messagingSenderId: "997546472497",
  appId: "1:997546472497:web:3c098e06c492cb312dd110",
  measurementId: "G-75XBD0M9FM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to load posts dynamically from Firestore
async function loadPosts() {
    try {
        const postsContainer = document.querySelector('.posts-container');
        postsContainer.innerHTML = ''; // Clear existing posts

        // Query to get latest posts, ordered by date, limited to 10
        const postsQuery = query(
            collection(db, 'posts'), 
            orderBy('date', 'desc'), 
            limit(10)
        );

        const querySnapshot = await getDocs(postsQuery);
        
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = createPostElement(doc.id, post);
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error loading posts: ", error);
        const errorElement = document.createElement('div');
        errorElement.textContent = 'Impossible de charger les posts. Veuillez réessayer.';
        document.querySelector('.posts-container').appendChild(errorElement);
    }
}

// Function to create post DOM element
function createPostElement(postId, post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.postId = postId;

    postCard.innerHTML = `
        <div class="vote-column">
            <button class="vote-button upvote"><i class="fas fa-arrow-up"></i></button>
            <div class="vote-count">${post.votes || 0}</div>
            <button class="vote-button downvote"><i class="fas fa-arrow-down"></i></button>
        </div>
        <div class="post-content">
            <div class="post-meta">
                <img src="img/community-icon.jpg" alt="Icône" class="community-icon">
                <span class="community-name">${post.communaute || 'r/Parentalité'}</span>
                <span class="post-author">Posté par u/${post.auteur}</span>
                <span class="post-time">${formatPostDate(post.date)}</span>
            </div>
            <h3 class="post-title">
                <span class="post-flair flair-${post.type || 'discussion'}">${post.type || 'Discussion'}</span>
                <a href="post.html?id=${postId}">${post.titre}</a>
            </h3>
            <div class="post-excerpt">${post.contenu}</div>
            <div class="post-actions">
                <div class="post-action comments-count">
                    <i class="fas fa-comment-alt"></i> ${post.commentaires?.length || 0} commentaires
                </div>
                <div class="post-action share-action">
                    <i class="fas fa-share"></i> Partager
                </div>
                <div class="post-action save-action">
                    <i class="far fa-bookmark"></i> Sauvegarder
                </div>
                <div class="post-action report-action">
                    <i class="fas fa-flag"></i> Signaler
                </div>
            </div>
        </div>
    `;

    // Add event listeners for vote and interaction buttons
    setupPostInteractions(postCard, postId, post);

    return postCard;
}

// Function to format post date
function formatPostDate(dateString) {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.round((now - postDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `il y a ${diffInHours} heures`;
    return `il y a ${Math.round(diffInHours / 24)} jours`;
}

// Function to set up post interaction buttons
function setupPostInteractions(postElement, postId, postData) {
    const upvoteButton = postElement.querySelector('.upvote');
    const downvoteButton = postElement.querySelector('.downvote');
    const voteCountElement = postElement.querySelector('.vote-count');

    upvoteButton.addEventListener('click', async () => {
        try {
            // Implement vote logic
            const updatedVotes = (postData.votes || 0) + 1;
            await updatePostVotes(postId, updatedVotes);
            voteCountElement.textContent = updatedVotes;
        } catch (error) {
            console.error("Erreur lors du vote", error);
        }
    });

    downvoteButton.addEventListener('click', async () => {
        try {
            // Implement vote logic
            const updatedVotes = Math.max((postData.votes || 0) - 1, 0);
            await updatePostVotes(postId, updatedVotes);
            voteCountElement.textContent = updatedVotes;
        } catch (error) {
            console.error("Erreur lors du vote", error);
        }
    });
}

// Function to update post votes
async function updatePostVotes(postId, newVoteCount) {
    try {
        await updateDoc(doc(db, 'posts', postId), {
            votes: newVoteCount
        });
    } catch (error) {
        console.error("Erreur de mise à jour des votes", error);
    }
}

// Function to create a new post
async function createPost(auteur, titre, contenu, type = 'discussion', communaute = 'r/Parentalité') {
    try {
        const newPostRef = await addDoc(collection(db, 'posts'), {
            auteur: auteur,
            titre: titre,
            contenu: contenu,
            date: new Date().toISOString(),
            votes: 0,
            commentaires: [],
            type: type,
            communaute: communaute
        });
        return newPostRef.id;
    } catch (error) {
        console.error("Erreur lors de la création du post", error);
        throw error;
    }
}

// Event listener for post creation form
document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.querySelector('.post-form');
    const postInput = postForm.querySelector('.post-input');

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPostContent = postInput.value.trim();
        
        if (newPostContent) {
            try {
                // Replace 'NomUtilisateur' with actual logged-in user's name
                await createPost('NomUtilisateur', 'Nouveau post', newPostContent);
                postInput.value = ''; // Clear input
                loadPosts(); // Refresh posts
            } catch (error) {
                alert('Impossible de créer le post. Veuillez réessayer.');
            }
        }
    });

    // Load posts when page loads
    loadPosts();
});