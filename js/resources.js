// Script pour le menu mobile
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('nav').classList.toggle('active');
});

// Script pour les filtres par âge
const ageButtons = document.querySelectorAll('.age-btn');

ageButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Retirer la classe active de tous les boutons
        ageButtons.forEach(btn => btn.classList.remove('active'));
        // Ajouter la classe active au bouton cliqué
        this.classList.add('active');
        
        // Ici, on pourrait ajouter la logique de filtrage des ressources
        // selon l'âge sélectionné
        console.log("Filtre sélectionné: " + this.textContent);
    });
});

// Script pour les tags
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function() {
        console.log("Recherche par tag: " + this.textContent);
        // Simuler une recherche par tag
        document.querySelector('.search-input').value = this.textContent;
    });
});