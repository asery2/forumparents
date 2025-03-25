// Simulation de l'état de connexion (à remplacer par votre logique d'authentification)
document.addEventListener('DOMContentLoaded', function() {
    // Simuler un utilisateur connecté (true) ou non connecté (false)
    const isLoggedIn = false;
    
    // Afficher le contenu approprié selon l'état de connexion
    if (isLoggedIn) {
        document.getElementById('auth-required').style.display = 'none';
        document.getElementById('specialists-content').style.display = 'block';
        
        // Afficher le profil utilisateur
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('register-button').style.display = 'none';
        document.getElementById('user-profile').style.display = 'flex';
    } else {
        document.getElementById('auth-required').style.display = 'block';
        document.getElementById('specialists-content').style.display = 'none';
    }
    
    // Gestion des modals de prise de rendez-vous
    const appointmentButtons = document.querySelectorAll('.appointment-button');
    const appointmentModal = document.getElementById('appointment-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    appointmentButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (!isLoggedIn) {
                // Rediriger vers la page de connexion si non connecté
                window.location.href = 'login.html';
                return;
            }
            
            const specialistId = this.getAttribute('data-specialist');
            const specialistName = this.closest('.specialist-card').querySelector('h3').textContent;
            document.getElementById('specialist-name').textContent = specialistName;
            appointmentModal.style.display = 'block';
            
            // Générer le calendrier pour le mois en cours
            generateCalendar();
        });
    });
    
    // Fermer les modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Confirmation du rendez-vous
    document.getElementById('confirm-appointment').addEventListener('click', function() {
        const specialistName = document.getElementById('specialist-name').textContent;
        const selectedDate = document.getElementById('selected-date').textContent;
        
        // Vérifier si une date et un créneau ont été sélectionnés
        if (selectedDate === 'Veuillez d\'abord sélectionner une date') {
            alert('Veuillez sélectionner une date et un créneau horaire.');
            return;
        }
        
        document.getElementById('confirmed-specialist').textContent = specialistName;
        document.getElementById('confirmed-date').textContent = selectedDate;
        
        appointmentModal.style.display = 'none';
        confirmationModal.style.display = 'block';
    });
    
    // Fermer la confirmation
    document.getElementById('close-confirmation').addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });
    
    // Annuler le rendez-vous
    document.getElementById('cancel-appointment').addEventListener('click', function() {
        appointmentModal.style.display = 'none';
    });
    
    // Chat en direct
    const chatButton = document.getElementById('chat-button');
    const chatWidget = document.getElementById('chat-widget');
    const minimizeChat = document.querySelector('.minimize-chat');
    
    chatButton.addEventListener('click', function() {
        chatWidget.classList.toggle('open');
    });
    
    minimizeChat.addEventListener('click', function() {
        chatWidget.classList.remove('open');
    });
    
    // Fonction pour générer le calendrier
    function generateCalendar() {
        const calendarDates = document.querySelector('.calendar-dates');
        const currentMonthEl = document.getElementById('current-month');
        
        // Date actuelle
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Afficher le mois et l'année
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Premier jour du mois (0: dimanche, 1: lundi, etc.)
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        // Ajuster pour que la semaine commence le lundi (0: lundi, 6: dimanche)
        const firstDayAdjusted = firstDay === 0 ? 6 : firstDay - 1;
        
        // Nombre de jours dans le mois
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Vider le calendrier
        calendarDates.innerHTML = '';
        
        // Ajouter les cases vides pour les jours avant le premier jour du mois
        for (let i = 0; i < firstDayAdjusted; i++) {
            const emptyDay = document.createElement('div');
            calendarDates.appendChild(emptyDay);
        }
        
        // Ajouter les jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const dateEl = document.createElement('div');
            dateEl.textContent = day;
            dateEl.classList.add('calendar-date');
            
            const date = new Date(currentYear, currentMonth, day);
            const today = new Date();
            
            // Désactiver les dates passées
            if (date < new Date(today.setHours(0, 0, 0, 0))) {
                dateEl.classList.add('unavailable');
            } else {
                // Simuler des disponibilités aléatoires
                if (Math.random() > 0.3) {
                    dateEl.classList.add('available');
                    
                    // Ajouter l'événement de clic pour les dates disponibles
                    dateEl.addEventListener('click', function() {
                        // Désélectionner toutes les dates
                        document.querySelectorAll('.calendar-date').forEach(d => {
                            d.classList.remove('selected');
                        });
                        
                        // Sélectionner cette date
                        this.classList.add('selected');
                        
                        // Mettre à jour la date sélectionnée
                        const selectedDay = this.textContent;
                        document.getElementById('selected-date').textContent = `${selectedDay} ${monthNames[currentMonth]} ${currentYear}`;
                        
                        // Générer les créneaux horaires pour cette date
                        generateTimeSlots();
                    });
                } else {
                    dateEl.classList.add('unavailable');
                }
            }
            
            calendarDates.appendChild(dateEl);
        }
    }
    
    // Fonction pour générer les créneaux horaires
    function generateTimeSlots() {
        const slotsContainer = document.querySelector('.slots-container');
        slotsContainer.innerHTML = '';
        
        // Heures disponibles (de 9h à 18h)
        const hours = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
        
        hours.forEach(hour => {
            const slot = document.createElement('div');
            slot.textContent = hour;
            slot.classList.add('time-slot');
            
            // Simuler des disponibilités aléatoires
            if (Math.random() > 0.4) {
                slot.classList.add('available');
                
                // Ajouter l'événement de clic pour les créneaux disponibles
                slot.addEventListener('click', function() {
                    // Désélectionner tous les créneaux
                    document.querySelectorAll('.time-slot').forEach(s => {
                        s.classList.remove('selected');
                    });
                    
                    // Sélectionner ce créneau
                    this.classList.add('selected');
                    
                    // Mettre à jour l'heure sélectionnée
                    const selectedDate = document.getElementById('selected-date').textContent;
                    document.getElementById('selected-date').textContent = `${selectedDate} à ${hour}`;
                });
            } else {
                slot.classList.add('unavailable');
            }
            
            slotsContainer.appendChild(slot);
        });
    }
    
    // Navigation dans le calendrier
    document.getElementById('prev-month').addEventListener('click', function() {
        // À implémenter : navigation vers le mois précédent
        alert('Navigation vers le mois précédent (à implémenter)');
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        // À implémenter : navigation vers le mois suivant
        alert('Navigation vers le mois suivant (à implémenter)');
    });
});

// Variables globales et chargement initial
let token = localStorage.getItem('token');
let specialists = [];

// Chargement des spécialistes (avec filtres en option)
async function loadSpecialists(filters = {}) {
    try {
        let url = 'http://localhost:3000/api/specialists';
        
        // Ajout des filtres à l'URL
        const queryParams = new URLSearchParams();
        if (filters.speciality) queryParams.append('speciality', filters.speciality);
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.availability) queryParams.append('availability', filters.availability);
        
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des spécialistes');
        }
        
        specialists = await response.json();
        displaySpecialists(specialists);
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement des spécialistes', 'error');
    }
}

// Fonction pour prendre un rendez-vous
async function confirmAppointment() {
    if (!selectedSpecialist || !selectedDate || !selectedTimeSlot) {
        showNotification('Veuillez sélectionner un spécialiste, une date et un horaire', 'error');
        return;
    }
    
    const type = document.getElementById('appointment-type').value;
    const reason = document.getElementById('reason').value;
    const notes = document.getElementById('notes').value;
    
    try {
        const response = await fetch('http://localhost:3000/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                specialistId: selectedSpecialist._id,
                date: selectedDate,
                time: selectedTimeSlot,
                type,
                reason,
                notes
            })
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la création du rendez-vous');
        }
        
        const data = await response.json();
        
        // Fermer le modal et montrer une notification
        closeAppointmentModal();
        showNotification(`Rendez-vous confirmé avec ${selectedSpecialist.userId.fullName}`, 'success');
        resetAppointmentForm();
        
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la confirmation du rendez-vous', 'error');
    }
}