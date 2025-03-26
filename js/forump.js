// 🔄 Version corrigée de forump.js avec intégration complète Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    doc,
    updateDoc,
    where,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const db = getFirestore(app);

// ➕ Créer un post
async function createPost(auteur, titre, contenu, type = 'discussion', communaute = 'r/Parentalité') {
    const newPost = {
        auteur,
        titre,
        contenu,
        date: new Date().toISOString(),
        votes: 0,
        type,
        communaute
    };
    const docRef = await addDoc(collection(db, 'posts'), newPost);
    return docRef.id;
}

// 🔁 Charger les posts
async function loadPosts(group = 'all') {
    const postsContainer = document.querySelector('.posts-container');
    postsContainer.innerHTML = '';

    let postsQuery = query(collection(db, 'posts'), orderBy('date', 'desc'), limit(10));
    if (group !== 'all') {
        postsQuery = query(collection(db, 'posts'), where('communaute', '==', group), orderBy('date', 'desc'));
    }

    const snapshot = await getDocs(postsQuery);
    snapshot.forEach(docSnap => {
        const post = docSnap.data();
        const postId = docSnap.id;
        const postEl = createPostElement(postId, post);
        postsContainer.appendChild(postEl);
    });
}

// 📦 Créer l'élément HTML pour un post
function createPostElement(postId, post) {
    const el = document.createElement('div');
    el.className = 'post-card';
    el.dataset.postId = postId;
    el.innerHTML = `
        <div class="vote-column">
            <button class="vote-button upvote"><i class="fas fa-arrow-up"></i></button>
            <div class="vote-count">${post.votes || 0}</div>
            <button class="vote-button downvote"><i class="fas fa-arrow-down"></i></button>
        </div>
        <div class="post-content">
            <div class="post-meta">
                <span class="community-name">${post.communaute}</span>
                <span class="post-author">Posté par u/${post.auteur}</span>
                <span class="post-time">${formatPostDate(post.date)}</span>
            </div>
            <h3 class="post-title">
                <span class="post-flair flair-${post.type}">${post.type}</span>
                <a href="#">${post.titre}</a>
            </h3>
            <div class="post-excerpt">${post.contenu}</div>
        </div>
    `;

    const voteUp = el.querySelector('.upvote');
    const voteDown = el.querySelector('.downvote');
    const voteCount = el.querySelector('.vote-count');

    voteUp.addEventListener('click', async () => {
        const newVotes = (post.votes || 0) + 1;
        await updateDoc(doc(db, 'posts', postId), { votes: newVotes });
        voteCount.textContent = newVotes;
    });

    voteDown.addEventListener('click', async () => {
        const newVotes = Math.max((post.votes || 0) - 1, 0);
        await updateDoc(doc(db, 'posts', postId), { votes: newVotes });
        voteCount.textContent = newVotes;
    });

    return el;
}

function formatPostDate(dateStr) {
    const date = new Date(dateStr);
    const diff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (diff < 1) return "À l'instant";
    if (diff < 24) return `il y a ${diff}h`;
    return `il y a ${Math.floor(diff / 24)}j`;
}

// 🎯 Gérer le formulaire de création de post
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createPostForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titre = document.getElementById('postTitle').value.trim();
        const contenu = document.getElementById('postContent').value.trim();
        const type = document.getElementById('postType').value;
        const auteur = 'Anonyme'; // à remplacer par utilisateur connecté

        if (!titre || !contenu) return alert('Veuillez remplir tous les champs');

        try {
            await createPost(auteur, titre, contenu, type);
            form.reset();
            loadPosts();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la publication du post");
        }
    });

    document.getElementById('groupFilter').addEventListener('change', (e) => {
        loadPosts(e.target.value);
    });

    loadPosts();
});
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('togglePostForm');
    const formContainer = document.getElementById('postFormContainer');

    if (toggleBtn && formContainer) {
        toggleBtn.addEventListener('click', () => {
            formContainer.classList.toggle('show');
        });
        document.querySelectorAll('.sidebar-section .menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const groupName = item.innerText.trim().toLowerCase();
                loadPosts(`r/${groupName.charAt(0).toUpperCase() + groupName.slice(1)}`);

            });
        });        
    }
});
async function loadComments(postId) {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const snapshot = await getDocs(commentsRef);
    snapshot.forEach(docSnap => {
        const comment = docSnap.data();
        console.log(comment.contenu); // ou affiche-les dans le DOM
    });
}
el.querySelector('.comments-count')?.addEventListener('click', () => {
    loadComments(postId);
});
// forump.js
async function addComment(postId, auteur, contenu) {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const newComment = {
        auteur,
        contenu,
        date: new Date().toISOString()
    };
    await addDoc(commentsRef, newComment);
}

