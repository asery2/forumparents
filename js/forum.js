// Variables globales
let currentUser = {
    username: 'user123',
    avatar: 'https://via.placeholder.com/24'
};

// Liste des communautés et mots-clés liés à la famille
const familyRelatedCommunities = [
    'éducationbienveillante',
    'activitésenfants',
    'parentsados',
    'alimentationfamille',
    'petiteenfance',
    'bienetrefamilial',
    'viedefamille'
];

const familyKeywords = [
    'enfant', 'parent', 'famille', 'éducation', 'activité', 'école',
    'bienveillant', 'maman', 'papa', 'ado', 'bébé', 'recette',
    'alimentation', 'maternité', 'paternité', 'grossesse', 'naissance'
];

// Fonction pour vérifier si un post est lié à la famille
function isFamilyRelated(post) {
    // Vérifier si la communauté est liée à la famille
    if (familyRelatedCommunities.some(comm => post.community.toLowerCase().includes(comm))) {
        return true;
    }
    
    // Vérifier si le titre ou le contenu contiennent des mots-clés liés à la famille
    if (familyKeywords.some(keyword => 
        post.title.toLowerCase().includes(keyword) || 
        post.content.toLowerCase().includes(keyword)
    )) {
        return true;
    }
    
    return false;
}

// Filtrer les posts existants pour ne garder que ceux liés à la famille
let posts = [
    {
        id: 1,
        community: 'programming',
        communityIcon: 'https://via.placeholder.com/16',
        author: 'coder42',
        title: 'Quelle est votre librairie JavaScript préférée en 2025?',
        content: 'Avec toutes les nouvelles technologies cette année, je suis curieux de savoir quelle est votre librairie préférée pour développer des applications front-end modernes.',
        image: null,
        upvotes: 125,
        comments: 42,
        createdAt: '2025-03-15T10:30:00Z'
    },
    {
        id: 2,
        community: 'photography',
        communityIcon: 'https://via.placeholder.com/16',
        author: 'photoexpert',
        title: 'Magnifique coucher de soleil capturé hier soir',
        content: 'J\'ai eu la chance de capturer ce moment magique hier soir. Prise avec un Canon EOS R5.',
        image: 'https://via.placeholder.com/600x400',
        upvotes: 304,
        comments: 28,
        createdAt: '2025-03-17T18:45:00Z'
    },
    {
        id: 3,
        community: 'gaming',
        communityIcon: 'https://via.placeholder.com/16',
        author: 'gamer99',
        title: 'Qui a déjà essayé le nouveau jeu VR qui fait sensation ?',
        content: 'Le monde virtuel est incroyable et l\'immersion est totale. Je n\'ai jamais rien expérimenté de tel auparavant.',
        image: null,
        upvotes: 89,
        comments: 53,
        createdAt: '2025-03-18T09:15:00Z'
    }
];

// Fonctions d'initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeUI();
    filterAndRenderPosts();
    setupEventListeners();
    filterStaticPosts();
});

function initializeUI() {
    // Initialiser l'interface utilisateur
    updateUserInfo();
}

function updateUserInfo() {
    // Mettre à jour les informations de l'utilisateur dans l'interface
    const userButtons = document.querySelectorAll('.user-button');
    userButtons.forEach(button => {
        const avatar = button.querySelector('.avatar img');
        const username = button.querySelector('span');
        if (avatar) avatar.src = currentUser.avatar;
        if (username) username.textContent = currentUser.username;
    });
}

// Filtrer les posts statiques qui sont déjà présents dans le HTML
function filterStaticPosts() {
    const staticPosts = document.querySelectorAll('.posts .post');
    staticPosts.forEach(post => {
        const title = post.querySelector('.post-title')?.textContent.toLowerCase() || '';
        const content = post.querySelector('.post-text p')?.textContent.toLowerCase() || '';
        const community = post.querySelector('.post-community')?.textContent.trim().toLowerCase() || '';
        
        let isFamily = false;
        
        // Vérifier la communauté
        for (const familyCommunity of familyRelatedCommunities) {
            if (community.includes(familyCommunity)) {
                isFamily = true;
                break;
            }
        }
        
        // Vérifier le contenu et le titre
        if (!isFamily) {
            for (const keyword of familyKeywords) {
                if (title.includes(keyword) || content.includes(keyword)) {
                    isFamily = true;
                    break;
                }
            }
        }
        
        // Masquer le post s'il n'est pas lié à la famille
        if (!isFamily) {
            post.style.display = 'none';
        }
    });
}

// Modifier la fonction de rendu pour filtrer les posts
function filterAndRenderPosts() {
    // Filtrer les posts pour ne garder que ceux liés à la famille
    const filteredPosts = posts.filter(post => isFamilyRelated(post));
    
    // Si aucun post n'est lié à la famille, ne rien afficher
    if (filteredPosts.length === 0) {
        return;
    }
    
    // Afficher uniquement les posts filtrés
    renderFilteredPosts(filteredPosts);
}

function renderFilteredPosts(filteredPosts) {
    const postsContainer = document.querySelector('.posts-container') || document.querySelector('.posts');
    
    if (!postsContainer) {
        console.error("Conteneur de posts non trouvé");
        return;
    }
    
    // Créer les éléments pour les posts filtrés
    filteredPosts.forEach(post => {
        postsContainer.appendChild(createPostElement(post));
    });
}

function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.dataset.postId = post.id;
    
    // Formatage de la date
    const postDate = new Date(post.createdAt);
    const timeAgo = formatTimeAgo(postDate);
    
    // Contenu HTML du post
    postElement.innerHTML = `
        <div class="post-votes">
            <button class="upvote"><i class="fas fa-arrow-up"></i></button>
            <span class="vote-count">${post.upvotes}</span>
            <button class="downvote"><i class="fas fa-arrow-down"></i></button>
        </div>
        <div class="post-content">
            <div class="post-header">
                <a href="#" class="post-community">
                    <img src="${post.communityIcon}" alt="${post.community}">
                    r/${post.community}
                </a>
                <span class="post-metadata">Posté par <a href="#">u/${post.author}</a> ${timeAgo}</span>
            </div>
            <h3 class="post-title">${post.title}</h3>
            <div class="post-text"><p>${post.content}</p></div>
            ${post.image ? `<div class="post-image"><img src="${post.image}" alt="Image du post"></div>` : ''}
            <div class="post-actions">
                <button><i class="fas fa-comment-alt"></i> ${post.comments} commentaires</button>
                <button><i class="fas fa-share"></i> Partager</button>
                <button><i class="fas fa-bookmark"></i> Sauvegarder</button>
                <button><i class="fas fa-ellipsis-h"></i></button>
            </div>
        </div>
    `;
    
    // Ajouter des gestionnaires d'événements pour les votes
    setupVoteHandlers(postElement, post);
    
    return postElement;
}

// Le reste du code reste inchangé...
function setupVoteHandlers(postElement, post) {
    const upvoteButton = postElement.querySelector('.upvote');
    const downvoteButton = postElement.querySelector('.downvote');
    const voteCount = postElement.querySelector('.vote-count');
    
    upvoteButton.addEventListener('click', function() {
        if (this.classList.contains('active')) {
            // Annuler le vote
            post.upvotes--;
            this.classList.remove('active');
        } else {
            // Ajouter un vote positif
            post.upvotes++;
            this.classList.add('active');
            
            // Si downvote était actif, le désactiver
            if (downvoteButton.classList.contains('active')) {
                post.upvotes++;
                downvoteButton.classList.remove('active');
            }
        }
        voteCount.textContent = post.upvotes;
    });
    
    downvoteButton.addEventListener('click', function() {
        if (this.classList.contains('active')) {
            // Annuler le vote
            post.upvotes++;
            this.classList.remove('active');
        } else {
            // Ajouter un vote négatif
            post.upvotes--;
            this.classList.add('active');
            
            // Si upvote était actif, le désactiver
            if (upvoteButton.classList.contains('active')) {
                post.upvotes--;
                upvoteButton.classList.remove('active');
            }
        }
        voteCount.textContent = post.upvotes;
    });
}

// Gestion du modal de création de post
function setupEventListeners() {
    // Ouvrir le modal de création de post
    const createPostButtons = document.querySelectorAll('.create-post-button');
    createPostButtons.forEach(button => {
        button.addEventListener('click', openCreatePostModal);
    });
    
    // Configurer les filtres de vue
    setupViewFilters();
    
    // Ajouter un bouton "plus" pour ouvrir le modal
    const plusButton = document.querySelector('.fa-plus').parentElement;
    if (plusButton) {
        plusButton.addEventListener('click', openCreatePostModal);
    }
}

function openCreatePostModal() {
    const modal = document.getElementById('createPostModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Configurer la fermeture du modal
        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Fermer le modal si on clique en dehors
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

function setupViewFilters() {
    const filterButtons = document.querySelectorAll('.view-options button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Désactiver tous les filtres
            filterButtons.forEach(b => b.classList.remove('active'));
            // Activer le filtre cliqué
            button.classList.add('active');
        });
    });
}

// Utilitaires
function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'il y a quelques secondes';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
}

// Fonction pour simuler la recherche
function setupSearch() {
    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        if (searchTerm.length > 2) {
            // Rechercher uniquement dans les posts liés à la famille
            const familyPosts = posts.filter(post => isFamilyRelated(post));
            const filteredPosts = familyPosts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) || 
                post.content.toLowerCase().includes(searchTerm)
            );
            
            // Afficher les résultats (à implémenter)
            console.log(`Recherche: ${searchTerm}`, filteredPosts);
        }
    });
}

// Initialiser la recherche
document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
});