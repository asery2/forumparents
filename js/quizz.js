/**
 * Quiz de style parental - Forum des Parents
 * Script de gestion du quiz interactif pour découvrir son style parental
 */

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const startQuizBtn = document.getElementById('start-quiz');
    const quizContent = document.getElementById('quiz-content');
    const quizIntro = document.querySelector('.quiz-intro');
    const quizQuestions = document.querySelectorAll('.quiz-question');
    const quizResults = document.querySelector('.quiz-results');
    const progressDots = document.querySelectorAll('.quiz-progress-dot');
    const parentStyleEl = document.getElementById('parent-style');
    const styleDescriptionEl = document.getElementById('style-description');
    const shareGroupBtn = document.querySelector('.share-group-btn');
    
    // Variables du quiz
    let currentQuestion = 1;
    const answers = {};
    
    // Styles parentaux et descriptions
    const parentalStyles = {
        a: {
            name: "Style démocratique",
            description: "Vous établissez des règles claires tout en restant à l'écoute des besoins de votre enfant. Vous offrez un cadre sécurisant qui favorise l'estime de soi et l'autonomie.",
            group: "parents-democratiques"
        },
        b: {
            name: "Style permissif",
            description: "Vous valorisez la liberté et l'expression personnelle. Vous êtes très à l'écoute et faites confiance à votre enfant pour développer sa propre personnalité.",
            group: "parents-permissifs"
        },
        c: {
            name: "Style autoritaire",
            description: "Vous accordez beaucoup d'importance à la structure et aux règles. Vous avez des attentes claires et valorisez la discipline et le respect.",
            group: "parents-autoritaires"
        },
        d: {
            name: "Style participatif",
            description: "Vous impliquez activement votre enfant dans les décisions familiales. Vous valorisez la communication et la résolution collaborative des problèmes.",
            group: "parents-participatifs"
        }
    };
    
    /**
     * Initialise le quiz
     */
    function initQuiz() {
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', startQuiz);
        }
        
        // Initialiser les événements des options
        initOptionEvents();
        
        // Initialiser les boutons de navigation
        initNavigationEvents();
        
        // Initialiser le bouton de partage
        initShareGroupButton();
    }
    
    /**
     * Démarrer le quiz
     */
    function startQuiz() {
        quizIntro.style.display = 'none';
        quizQuestions[0].classList.add('active');
        quizContent.style.display = 'block';
    }
    
    /**
     * Initialise les événements de sélection d'options
     */
    function initOptionEvents() {
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', function() {
                // Désélectionner les autres options de la même question
                const parentQuestion = this.closest('.quiz-question');
                parentQuestion.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Sélectionner l'option cliquée
                this.classList.add('selected');
                
                // Activer le bouton suivant/soumettre
                const nextBtn = parentQuestion.querySelector('.quiz-btn-next') || 
                               parentQuestion.querySelector('.quiz-btn-submit');
                if (nextBtn) {
                    nextBtn.disabled = false;
                }
            });
        });
    }
    
    /**
     * Initialise les événements des boutons de navigation
     */
    function initNavigationEvents() {
        // Boutons Suivant
        document.querySelectorAll('.quiz-btn-next').forEach(btn => {
            btn.addEventListener('click', goToNextQuestion);
        });
        
        // Boutons Précédent
        document.querySelectorAll('.quiz-btn-prev').forEach(btn => {
            btn.addEventListener('click', goToPreviousQuestion);
        });
        
        // Bouton de soumission
        const submitBtn = document.querySelector('.quiz-btn-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', submitQuiz);
        }
    }
    
    /**
     * Passe à la question suivante
     */
    function goToNextQuestion() {
        const currentQuestionEl = document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`);
        const selectedOption = currentQuestionEl.querySelector('.quiz-option.selected');
        
        if (selectedOption) {
            // Enregistrer la réponse
            answers[currentQuestion] = selectedOption.getAttribute('data-value');
            
            // Passer à la question suivante
            currentQuestionEl.classList.remove('active');
            currentQuestion++;
            document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.add('active');
            
            // Mettre à jour les indicateurs de progression
            updateProgressDots();
        }
    }
    
    /**
     * Revient à la question précédente
     */
    function goToPreviousQuestion() {
        if (currentQuestion > 1) {
            // Revenir à la question précédente
            document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.remove('active');
            currentQuestion--;
            document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.add('active');
            
            // Mettre à jour les indicateurs de progression
            updateProgressDots();
        }
    }
    
    /**
     * Met à jour les indicateurs de progression
     */
    function updateProgressDots() {
        progressDots.forEach(dot => dot.classList.remove('active'));
        document.querySelector(`.quiz-progress-dot[data-question="${currentQuestion}"]`).classList.add('active');
    }
    
    /**
     * Soumet le quiz et affiche les résultats
     */
    function submitQuiz() {
        const lastQuestionEl = document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`);
        const selectedOption = lastQuestionEl.querySelector('.quiz-option.selected');
        
        if (selectedOption) {
            // Enregistrer la dernière réponse
            answers[currentQuestion] = selectedOption.getAttribute('data-value');
            
            // Calculer le style parental dominant
            const dominantStyle = calculateDominantStyle();
            
            // Afficher les résultats
            displayResults(dominantStyle);
            
            // Enregistrer les résultats dans le localStorage pour référence future
            saveResults(dominantStyle);
        }
    }
    
    /**
     * Calcule le style parental dominant
     * @return {string} Le style dominant (a, b, c ou d)
     */
    function calculateDominantStyle() {
        const counts = { a: 0, b: 0, c: 0, d: 0 };
        
        Object.values(answers).forEach(answer => {
            counts[answer]++;
        });
        
        let dominantStyle = 'a';
        let maxCount = counts.a;
        
        for (const [style, count] of Object.entries(counts)) {
            if (count > maxCount) {
                dominantStyle = style;
                maxCount = count;
            }
        }
        
        return dominantStyle;
    }
    
    /**
     * Affiche les résultats du quiz
     * @param {string} dominantStyle - Le style parental dominant
     */
    function displayResults(dominantStyle) {
        parentStyleEl.textContent = parentalStyles[dominantStyle].name;
        styleDescriptionEl.textContent = parentalStyles[dominantStyle].description;
        
        // Masquer les questions et afficher les résultats
        quizContent.style.display = 'none';
        quizResults.classList.add('active');
    }
    
    /**
     * Enregistre les résultats dans le localStorage
     * @param {string} dominantStyle - Le style parental dominant
     */
    function saveResults(dominantStyle) {
        const resultsData = {
            style: parentalStyles[dominantStyle].name,
            description: parentalStyles[dominantStyle].description,
            group: parentalStyles[dominantStyle].group,
            date: new Date().toISOString()
        };
        
        localStorage.setItem('quizResults', JSON.stringify(resultsData));
    }
    
    /**
     * Initialise le bouton de partage et redirection vers le groupe
     */
    function initShareGroupButton() {
        if (shareGroupBtn) {
            shareGroupBtn.addEventListener('click', function() {
                const dominantStyle = calculateDominantStyle();
                const groupSlug = parentalStyles[dominantStyle].group;
                
                // Rediriger vers le groupe de discussion approprié
                window.location.href = `forum.html?groupe=${groupSlug}`;
            });
        }
    }
    
    // Initialiser le quiz
    initQuiz();
});