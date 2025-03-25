const express = require('express');
const router = express.Router();
const evenementController = require('../controllers/evenementController');
const auth = require('../middleware/auth');

// Routes publiques
router.get('/', evenementController.getAllEvenements);
router.get('/:id', evenementController.getEvenementById);
router.get('/upcoming', evenementController.getUpcomingEvenements);
router.get('/past', evenementController.getPastEvenements);

// Routes protégées
router.post('/', auth, evenementController.createEvenement);
router.put('/:id', auth, evenementController.updateEvenement);
router.delete('/:id', auth, evenementController.deleteEvenement);
router.post('/:id/register', auth, evenementController.registerToEvenement);
router.delete('/:id/register', auth, evenementController.cancelRegistration);

module.exports = router;