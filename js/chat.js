document.addEventListener("DOMContentLoaded", function() {
    // Éléments du chatbot
    const chatButton = document.getElementById("chatButton");
    const chatPopup = document.getElementById("chatPopup");
    const closeChat = document.getElementById("closeChat");
    const messageInput = document.getElementById("messageInput");
    const sendMessage = document.getElementById("sendMessage");
    const chatMessages = document.getElementById("chatMessages");
    
    // Ouvrir le chat au clic sur le bouton
    chatButton.addEventListener("click", function() {
        chatPopup.style.display = "block";
        // Animation d'apparition
        setTimeout(() => {
            chatPopup.style.opacity = "1";
            chatPopup.style.transform = "translateY(0)";
        }, 50);
        
        // Effacer toutes les anciennes conversations
        chatMessages.innerHTML = "";
        
        // Afficher un message de bienvenue à chaque ouverture
        setTimeout(() => {
            addMessage("Bonjour ! Je suis l'assistant du Forum des Parents. Comment puis-je vous aider aujourd'hui ? 👋", "received");
            addMessage("Vous pouvez me poser des questions sur nos ressources éducatives, nos spécialistes ou nos groupes de discussion.", "received");
            // Ajouter les suggestions après le message de bienvenue
            addQuickSuggestions();
        }, 500);
    });
    
    // Fermer le chat
    closeChat.addEventListener("click", function() {
        chatPopup.style.opacity = "0";
        chatPopup.style.transform = "translateY(20px)";
        setTimeout(() => {
            chatPopup.style.display = "none";
        }, 300);
    });
    
    // Base de connaissances pour des réponses contextuelles
    const knowledgeBase = {
        "bonjour": ["Bonjour ! Comment puis-je vous aider aujourd'hui ?", "Bonjour ! Avez-vous des questions sur nos services ?"],
        "rendez-vous": ["Vous pouvez prendre rendez-vous avec un spécialiste directement depuis notre page d'accueil. Souhaitez-vous que je vous explique la démarche ?", "Pour prendre rendez-vous, il suffit de remplir le formulaire dans la section 'Besoin d'un accompagnement personnalisé'. Puis-je vous aider avec autre chose ?"],
        "inscription": ["Pour vous inscrire, cliquez sur 'Rejoindre la communauté' en haut de la page. C'est gratuit et ne prend que quelques minutes.", "L'inscription vous permet d'accéder au forum et à toutes nos ressources. Voulez-vous que je vous guide dans le processus ?"],
        "forum": ["Notre forum est un espace d'échange entre parents. Vous y trouverez des discussions sur divers sujets liés à l'éducation et au développement des enfants.", "Le forum est organisé par thématiques pour faciliter vos recherches. Les spécialistes y interviennent régulièrement. Avez-vous une question particulière ?"],
        "ressources": ["Nous proposons de nombreuses ressources éducatives : guides pratiques, fiches pédagogiques et vidéos explicatives. Quel type de ressource recherchez-vous ?", "Nos ressources sont disponibles dans la section 'Ressources' du site. Elles sont classées par âge et par thématique."],
        "spécialistes": ["Nos spécialistes incluent des psychologues, orthophonistes et éducateurs spécialisés. Cherchez-vous un type particulier de professionnel ?", "Vous pouvez consulter les profils de nos spécialistes et prendre rendez-vous directement sur notre plateforme."]
    };
    
    // Fonction pour trouver une réponse contextuelle
    function findResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Vérifier si un mot-clé correspond
        for (const keyword in knowledgeBase) {
            if (lowerMessage.includes(keyword)) {
                const responses = knowledgeBase[keyword];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        // Réponses par défaut si aucun mot-clé ne correspond
        const defaultResponses = [
            "Je comprends votre question. Pour vous aider au mieux, pourriez-vous me donner plus de détails ?",
            "Merci pour votre message. Souhaitez-vous des informations sur nos ressources, nos spécialistes ou le forum ?",
            "Je suis là pour vous aider ! N'hésitez pas à me poser des questions sur nos services pour parents et enfants.",
            "Votre question est intéressante. Pour y répondre plus précisément, pourriez-vous préciser ce que vous recherchez ?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // Envoyer un message
    function submitMessage() {
        const message = messageInput.value.trim();
        if (message !== "") {
            // Ajouter le message de l'utilisateur
            addMessage(message, "sent");
            
            // Simuler un délai de "frappe"
            showTypingIndicator();
            
            // Trouver une réponse contextuelle
            setTimeout(function() {
                removeTypingIndicator();
                const response = findResponse(message);
                addMessage(response, "received");
            }, 1500);
            
            // Effacer le champ de saisie
            messageInput.value = "";
        }
    }
    
    // Montrer l'indicateur de frappe
    function showTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "received", "typing-indicator");
        
        const typingContent = document.createElement("div");
        typingContent.classList.add("message-content");
        typingContent.innerHTML = "<span></span><span></span><span></span>";
        
        typingDiv.appendChild(typingContent);
        chatMessages.appendChild(typingDiv);
        
        // Faire défiler vers le bas
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Retirer l'indicateur de frappe
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector(".typing-indicator");
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Fonction pour ajouter un message au chat
    function addMessage(text, type) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", type);
        
        const messageContent = document.createElement("div");
        messageContent.classList.add("message-content");
        messageContent.innerHTML = text; // Utiliser innerHTML pour permettre des émoticônes et formatage
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Faire défiler vers le bas
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Gérer l'envoi via le bouton
    sendMessage.addEventListener("click", submitMessage);
    
    // Gérer l'envoi via la touche Entrée
    messageInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            submitMessage();
        }
    });
    
    // Suggestions rapides (à ajouter à l'interface)
    const quickSuggestions = [
        "Comment prendre rendez-vous ?",
        "Quelles sont vos ressources ?",
        "Comment rejoindre le forum ?",
        "Qui sont vos spécialistes ?"
    ];
    
    // Ajouter des suggestions rapides
    function addQuickSuggestions() {
        const suggestionsDiv = document.createElement("div");
        suggestionsDiv.classList.add("quick-suggestions");
        
        quickSuggestions.forEach(suggestion => {
            const suggestionButton = document.createElement("button");
            suggestionButton.textContent = suggestion;
            suggestionButton.addEventListener("click", function() {
                messageInput.value = suggestion;
                submitMessage();
            });
            suggestionsDiv.appendChild(suggestionButton);
        });
        
        chatMessages.appendChild(suggestionsDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});