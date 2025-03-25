// Script pour la fonctionnalité de base 

        document.addEventListener('DOMContentLoaded', function() {
            // Gestion des boutons de vote
            const upvoteButtons = document.querySelectorAll('.upvote');
            const downvoteButtons = document.querySelectorAll('.downvote');
            
            upvoteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    this.classList.toggle('active');
                    this.closest('.vote-column').querySelector('.downvote').classList.remove('active');
                    const voteCount = this.closest('.vote-column').querySelector('.vote-count');
                    if (this.classList.contains('active')) {
                        voteCount.textContent = parseInt(voteCount.textContent) + 1;
                    } else {
                        voteCount.textContent = parseInt(voteCount.textContent) - 1;
                    }
                });
            });
            
            downvoteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    this.classList.toggle('active');
                    this.closest('.vote-column').querySelector('.upvote').classList.remove('active');
                    const voteCount = this.closest('.vote-column').querySelector('.vote-count');
                    if (this.classList.contains('active')) {
                        voteCount.textContent = parseInt(voteCount.textContent) - 1;
                    } else {
                        voteCount.textContent = parseInt(voteCount.textContent) + 1;
                    }
                });
            });
            
            // Options de tri
            const sortOptions = document.querySelectorAll('.sort-option');
            sortOptions.forEach(option => {
                option.addEventListener('click', function() {
                    sortOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Boutons Premium
            const premiumButtons = document.querySelectorAll('#premiumButton, #headerPremiumBtn');
            premiumButtons.forEach(button => {
                button.addEventListener('click', function() {
                    alert('Vous allez être redirigé vers la page d\'abonnement Premium.');
                });
            });
            
            // Input de création de post
            const postInput = document.querySelector('.post-input');
            postInput.addEventListener('click', function() {
                alert('Vous devez être connecté pour créer un post.');
            });

            document.addEventListener('DOMContentLoaded', function() {
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                const mainNav = document.getElementById('main-nav');
                
                mobileMenuToggle.addEventListener('click', function() {
                    // Transformer la navigation existante en navigation mobile
                    mainNav.classList.toggle('mobile-nav');
                    mainNav.classList.toggle('active');
                    
                    // Changer l'icône du bouton (facultatif)
                    if (mainNav.classList.contains('active')) {
                        this.innerHTML = '<i class="fas fa-times"></i>'; // Icône de fermeture
                    } else {
                        this.innerHTML = '<i class="fas fa-bars"></i>'; // Icône du menu
                    }
                });
                
                document.addEventListener('DOMContentLoaded', function() {
                    // Sélection des éléments
                    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                    const navigation = document.querySelector('nav');
                    
                    // Vérifier que les éléments existent
                    if (!mobileMenuToggle || !navigation) {
                        console.error('Éléments de navigation mobile non trouvés');
                        return;
                    }
                
                    // Créer un conteneur pour la navigation mobile si nécessaire
                    let mobileNavContainer = document.querySelector('.mobile-nav');
                    if (!mobileNavContainer) {
                        mobileNavContainer = document.createElement('div');
                        mobileNavContainer.classList.add('mobile-nav');
                        
                        // Cloner la navigation existante
                        const navClone = navigation.cloneNode(true);
                        mobileNavContainer.appendChild(navClone);
                        document.body.appendChild(mobileNavContainer);
                    }
                
                    // Gestion du clic sur le bouton du menu mobile
                    mobileMenuToggle.addEventListener('click', function(event) {
                        event.stopPropagation(); // Empêcher la propagation de l'événement
                        
                        // Basculer la classe active
                        mobileNavContainer.classList.toggle('active');
                        
                        // Changer l'icône
                        if (mobileNavContainer.classList.contains('active')) {
                            this.innerHTML = '<i class="fas fa-times"></i>'; // Icône de fermeture
                        } else {
                            this.innerHTML = '<i class="fas fa-bars"></i>'; // Icône du menu
                        }
                    });
                
                    // Fermer le menu mobile en cliquant à l'extérieur
                    document.addEventListener('click', function(event) {
                        if (!mobileNavContainer.contains(event.target) && 
                            !mobileMenuToggle.contains(event.target)) {
                            mobileNavContainer.classList.remove('active');
                            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    });
                
                    // Empêcher la fermeture lors du clic à l'intérieur du menu mobile
                    mobileNavContainer.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });
                });
            });
        });
