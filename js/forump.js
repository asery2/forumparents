// ✅ Code corrigé et nettoyé pour `forump.js`
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const auth = getAuth(app);

// 🔁 Charger les posts
async function loadPosts(group = 'all') {
  const postsContainer = document.querySelector('.posts-container');
  postsContainer.innerHTML = '';

  let postsQuery = query(collection(db, 'posts'), orderBy('date', 'desc'));
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

// 🧱 Créer un élément HTML pour un post
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

// ➕ Créer un post
async function createPost(auteur, titre, contenu, type = 'discussion', communaute = 'r/Parentalité') {
  const newPost = {
    auteur,
    titre,
    contenu,
    type,
    communaute,
    votes: 0,
    date: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, 'posts'), newPost);
  return docRef.id;
}

// 🎯 Gérer le formulaire
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createPostForm');
  const groupFilter = document.getElementById('groupFilter');
  const toggleBtn = document.getElementById('togglePostForm');
  const formContainer = document.getElementById('postFormContainer');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const titre = document.getElementById('postTitle').value.trim();
      const contenu = document.getElementById('postContent').value.trim();
      const type = document.getElementById('postType').value;

      if (!titre || !contenu) return alert('Veuillez remplir tous les champs');

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDocs(query(collection(db, 'users'), where("email", "==", user.email)));
          const data = userDoc.docs[0]?.data();
          const username = data?.username || "Anonyme";

          await createPost(username, titre, contenu, type);
          form.reset();
          loadPosts();
        } else {
          alert("Veuillez vous connecter pour poster.");
        }
      });
    });
  }

  if (groupFilter) {
    groupFilter.addEventListener('change', (e) => {
      loadPosts(e.target.value);
    });
  }

  if (toggleBtn && formContainer) {
    toggleBtn.addEventListener('click', () => {
      formContainer.classList.toggle('show');
    });
  }

  document.querySelectorAll('.sidebar-section .menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const groupName = item.innerText.trim();
      loadPosts(groupName);
    });
  });

  loadPosts();
});