// events.js - Script pour la page des événements
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du calendrier
    const currentMonth = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarDaysContainer = document.querySelector('.calendar-days');
    const eventsList = document.getElementById('events-list');
    
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const currentDate = new Date();
    let currentMonthIndex = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Données d'exemple pour les événements
    const events = [
        { date: new Date(2025, 2, 15), title: 'Réunion parents-professeurs', type: 'Réunion', time: '18:00', location: 'École primaire' },
        { date: new Date(2025, 2, 20), title: 'Spectacle de fin d\'année', type: 'Événement', time: '14:00', location: 'Salle des fêtes' },
        { date: new Date(2025, 2, 22), title: 'Sortie au musée', type: 'Sortie', time: '10:00', location: 'Musée d\'Histoire' },
        { date: new Date(2025, 3, 5), title: 'Vacances de printemps', type: 'Congé', time: 'Toute la journée', location: '-' },
        { date: new Date(2025, 3, 12), title: 'Atelier lecture', type: 'Atelier', time: '16:30', location: 'Bibliothèque' }
    ];
    
    // Mise à jour de l'affichage du mois
    function updateMonthDisplay() {
        currentMonth.textContent = `${months[currentMonthIndex]} ${currentYear}`;
        generateCalendarDays();
    }
    
    // Génération des jours du calendrier
    function generateCalendarDays() {
        calendarDaysContainer.innerHTML = '';
        
        // Déterminer le premier jour du mois
        const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        
        // Calculer l'offset (jour de la semaine du premier jour du mois, 0 = dimanche)
        let firstDayWeekday = firstDayOfMonth.getDay();
        // Convertir pour que lundi soit le premier jour (0) et dimanche le dernier (6)
        firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
        
        // Ajouter des cases vides pour les jours avant le premier du mois
        for (let i = 0; i < firstDayWeekday; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('empty');
            calendarDaysContainer.appendChild(emptyDay);
        }
        
        // Ajouter tous les jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            
            // Vérifier si ce jour a des événements
            const currentDateCheck = new Date(currentYear, currentMonthIndex, day);
            const hasEvents = events.some(event => 
                event.date.getDate() === currentDateCheck.getDate() && 
                event.date.getMonth() === currentDateCheck.getMonth() && 
                event.date.getFullYear() === currentDateCheck.getFullYear()
            );
            
            if (hasEvents) {
                dayElement.classList.add('has-event');
            }
            
            // Marquer la date d'aujourd'hui
            if (currentDate.getDate() === day && 
                currentDate.getMonth() === currentMonthIndex && 
                currentDate.getFullYear() === currentYear) {
                dayElement.classList.add('today');
            }
            
            // Ajouter un attribut data pour faciliter l'identification
            dayElement.setAttribute('data-date', `${currentYear}-${currentMonthIndex + 1}-${day}`);
            
            // Ajouter l'écouteur d'événement pour chaque jour
            dayElement.addEventListener('click', selectDay);
            
            calendarDaysContainer.appendChild(dayElement);
        }
    }
    
    // Fonction pour sélectionner un jour
    function selectDay() {
        // Déselectionner le jour actif précédent
        const activeDay = document.querySelector('.calendar-days div.active');
        if (activeDay) {
            activeDay.classList.remove('active');
        }
        
        // Sélectionner le nouveau jour
        this.classList.add('active');
        
        // Récupérer la date à partir de l'attribut data
        const dateStr = this.getAttribute('data-date');
        const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
        
        // Afficher les événements pour cette date
        showEventsForDate(new Date(year, month - 1, day));
    }
    
    // Fonction pour afficher les événements d'une date spécifique
    function showEventsForDate(date) {
        // Vider la liste d'événements actuelle
        eventsList.innerHTML = '';
        
        // Formater la date pour l'affichage
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        const formattedDate = date.toLocaleDateString('fr-FR', options);
        
        // Ajouter un en-tête pour la date
        const dateHeader = document.createElement('h3');
        dateHeader.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        eventsList.appendChild(dateHeader);
        
        // Filtrer les événements pour cette date
        const dayEvents = events.filter(event => 
            event.date.getDate() === date.getDate() && 
            event.date.getMonth() === date.getMonth() && 
            event.date.getFullYear() === date.getFullYear()
        );
        
        // Afficher les événements ou un message s'il n'y en a pas
        if (dayEvents.length === 0) {
            const noEventsMsg = document.createElement('p');
            noEventsMsg.textContent = 'Aucun événement prévu pour cette journée.';
            noEventsMsg.classList.add('no-events');
            eventsList.appendChild(noEventsMsg);
        } else {
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.classList.add('event-item');
                eventElement.classList.add(`event-${event.type.toLowerCase()}`);
                
                const eventContent = `
                    <div class="event-time">${event.time}</div>
                    <div class="event-details">
                        <h4>${event.title}</h4>
                        <span class="event-type">${event.type}</span>
                        <span class="event-location">${event.location}</span>
                    </div>
                    <button class="btn-register">S'inscrire</button>
                `;
                
                eventElement.innerHTML = eventContent;
                eventsList.appendChild(eventElement);
                
                // Ajouter des écouteurs d'événements pour les boutons d'inscription
                const registerBtn = eventElement.querySelector('.btn-register');
                registerBtn.addEventListener('click', function() {
                    registerForEvent(event);
                });
            });
        }
    }
    
    // Fonction pour s'inscrire à un événement
    function registerForEvent(event) {
        // Créer une boîte de dialogue modale
        const modal = document.createElement('div');
        modal.classList.add('modal');
        
        const modalContent = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Inscription à l'événement</h3>
                <p>Vous êtes sur le point de vous inscrire à l'événement : ${event.title}</p>
                <form id="registration-form">
                    <div class="form-group">
                        <label for="parent-name">Votre nom :</label>
                        <input type="text" id="parent-name" required>
                    </div>
                    <div class="form-group">
                        <label for="child-name">Nom de l'enfant :</label>
                        <input type="text" id="child-name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email :</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="comments">Commentaires (optionnel) :</label>
                        <textarea id="comments"></textarea>
                    </div>
                    <button type="submit" class="btn-submit">Confirmer l'inscription</button>
                </form>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        
        // Afficher la modale
        setTimeout(() => {
            modal.classList.add('show');
        }, 50);
        
        // Gérer la fermeture de la modale
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        // Gérer la soumission du formulaire
        const form = modal.querySelector('#registration-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ici, vous pourriez envoyer les données d'inscription à un serveur
            // Pour l'exemple, nous affichons simplement un message de confirmation
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Inscription confirmée !</h3>
                    <p>Votre inscription à l'événement "${event.title}" a été enregistrée.</p>
                    <p>Un email de confirmation a été envoyé à l'adresse indiquée.</p>
                    <button class="btn-close-modal">Fermer</button>
                </div>
            `;
            
            // Gérer le nouveau bouton de fermeture
            const newCloseBtn = modal.querySelector('.close-modal');
            const btnCloseModal = modal.querySelector('.btn-close-modal');
            
            [newCloseBtn, btnCloseModal].forEach(btn => {
                btn.addEventListener('click', function() {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(modal);
                    }, 300);
                });
            });
        });
    }
    
    // Écouteurs d'événements pour les boutons de navigation du calendrier
    prevMonthBtn.addEventListener('click', function() {
        currentMonthIndex--;
        if (currentMonthIndex < 0) {
            currentMonthIndex = 11;
            currentYear--;
        }
        updateMonthDisplay();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonthIndex++;
        if (currentMonthIndex > 11) {
            currentMonthIndex = 0;
            currentYear++;
        }
        updateMonthDisplay();
    });
    
    // Fonction pour ajouter un nouvel événement
    // Cette fonction pourrait être appelée par un formulaire d'ajout d'événement
    function addNewEvent(title, date, type, time, location) {
        const newEvent = {
            title: title,
            date: new Date(date),
            type: type,
            time: time,
            location: location
        };
        
        events.push(newEvent);
        updateMonthDisplay(); // Mettre à jour le calendrier pour afficher le nouvel événement
    }
    
    // Recherche d'événements
    const searchInput = document.getElementById('search-events');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm.length > 2) {
                // Filtrer les événements qui correspondent au terme de recherche
                const matchingEvents = events.filter(event => 
                    event.title.toLowerCase().includes(searchTerm) || 
                    event.type.toLowerCase().includes(searchTerm) || 
                    event.location.toLowerCase().includes(searchTerm)
                );
                
                // Afficher les résultats de recherche
                showSearchResults(matchingEvents);
            } else if (searchTerm.length === 0) {
                // Réinitialiser l'affichage si le champ de recherche est vide
                const activeDay = document.querySelector('.calendar-days div.active');
                if (activeDay) {
                    const dateStr = activeDay.getAttribute('data-date');
                    const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
                    showEventsForDate(new Date(year, month - 1, day));
                } else {
                    // Aucun jour n'est sélectionné, afficher tous les événements du mois
                    showEventsForMonth();
                }
            }
        });
    }
    
    // Fonction pour afficher les résultats de recherche
    function showSearchResults(matchingEvents) {
        eventsList.innerHTML = '';
        
        const searchHeader = document.createElement('h3');
        searchHeader.textContent = 'Résultats de recherche';
        eventsList.appendChild(searchHeader);
        
        if (matchingEvents.length === 0) {
            const noEventsMsg = document.createElement('p');
            noEventsMsg.textContent = 'Aucun événement ne correspond à votre recherche.';
            noEventsMsg.classList.add('no-events');
            eventsList.appendChild(noEventsMsg);
        } else {
            matchingEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.classList.add('event-item');
                eventElement.classList.add(`event-${event.type.toLowerCase()}`);
                
                const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
                const formattedDate = event.date.toLocaleDateString('fr-FR', options);
                
                const eventContent = `
                    <div class="event-date">${formattedDate}</div>
                    <div class="event-time">${event.time}</div>
                    <div class="event-details">
                        <h4>${event.title}</h4>
                        <span class="event-type">${event.type}</span>
                        <span class="event-location">${event.location}</span>
                    </div>
                    <button class="btn-register">S'inscrire</button>
                `;
                
                eventElement.innerHTML = eventContent;
                eventsList.appendChild(eventElement);
                
                // Ajouter des écouteurs d'événements pour les boutons d'inscription
                const registerBtn = eventElement.querySelector('.btn-register');
                registerBtn.addEventListener('click', function() {
                    registerForEvent(event);
                });
            });
        }
    }
    
    // Fonction pour afficher tous les événements du mois actuel
    function showEventsForMonth() {
        eventsList.innerHTML = '';
        
        const monthHeader = document.createElement('h3');
        monthHeader.textContent = `Événements pour ${months[currentMonthIndex]} ${currentYear}`;
        eventsList.appendChild(monthHeader);
        
        // Filtrer les événements pour ce mois
        const monthEvents = events.filter(event => 
            event.date.getMonth() === currentMonthIndex && 
            event.date.getFullYear() === currentYear
        );
        
        if (monthEvents.length === 0) {
            const noEventsMsg = document.createElement('p');
            noEventsMsg.textContent = 'Aucun événement prévu pour ce mois.';
            noEventsMsg.classList.add('no-events');
            eventsList.appendChild(noEventsMsg);
        } else {
            // Trier les événements par date
            monthEvents.sort((a, b) => a.date - b.date);
            
            let currentDay = null;
            
            monthEvents.forEach(event => {
                const eventDate = event.date.getDate();
                
                // Si c'est un nouveau jour, ajouter un séparateur
                if (currentDay !== eventDate) {
                    currentDay = eventDate;
                    
                    const options = { weekday: 'long', day: 'numeric', month: 'long' };
                    const formattedDate = event.date.toLocaleDateString('fr-FR', options);
                    
                    const dayHeader = document.createElement('h4');
                    dayHeader.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
                    dayHeader.classList.add('day-separator');
                    eventsList.appendChild(dayHeader);
                }
                
                const eventElement = document.createElement('div');
                eventElement.classList.add('event-item');
                eventElement.classList.add(`event-${event.type.toLowerCase()}`);
                
                const eventContent = `
                    <div class="event-time">${event.time}</div>
                    <div class="event-details">
                        <h4>${event.title}</h4>
                        <span class="event-type">${event.type}</span>
                        <span class="event-location">${event.location}</span>
                    </div>
                    <button class="btn-register">S'inscrire</button>
                `;
                
                eventElement.innerHTML = eventContent;
                eventsList.appendChild(eventElement);
                
                // Ajouter des écouteurs d'événements pour les boutons d'inscription
                const registerBtn = eventElement.querySelector('.btn-register');
                registerBtn.addEventListener('click', function() {
                    registerForEvent(event);
                });
            });
        }
    }
    
    // Initialisation
    updateMonthDisplay();
    
    // Afficher par défaut les événements du mois actuel
    showEventsForMonth();
    
    // Optionnel : Sélectionner automatiquement le jour courant si on est dans le mois actuel
    if (currentDate.getMonth() === currentMonthIndex && currentDate.getFullYear() === currentYear) {
        const todayElement = document.querySelector(`.calendar-days div[data-date="${currentYear}-${currentMonthIndex + 1}-${currentDate.getDate()}"]`);
        if (todayElement) {
            todayElement.click();
        }
    }
});