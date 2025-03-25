const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

// Toutes les routes nécessitent l'authentification
router.get('/', auth, appointmentController.getUserAppointments);
router.get('/specialist/:specialistId', auth, appointmentController.getSpecialistAppointments);
router.post('/', auth, appointmentController.createAppointment);
router.put('/:id', auth, appointmentController.updateAppointment);
router.delete('/:id', auth, appointmentController.cancelAppointment);
router.get('/available-slots/:specialistId', auth, appointmentController.getAvailableSlots);

module.exports = router;