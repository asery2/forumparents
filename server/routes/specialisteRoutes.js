const express = require('express');
const router = express.Router();
const specialisteController = require('../controllers/specialisteController');
const auth = require('../middleware/auth');

// Routes publiques 
// Route pour obtenir tous les spécialistes
router.get('/', specialisteController.getAllSpecialistes);
router.get('/:id', specialisteController.getSpecialisteById);
router.get('/speciality/:speciality', specialisteController.getSpecialistesBySpeciality);
router.get('/location/:location', specialisteController.getSpecialistesByLocation);

// Routes protégées
router.post('/', auth, specialisteController.createSpecialiste);
router.put('/:id', auth, specialisteController.updateSpecialiste);
router.delete('/:id', auth, specialisteController.deleteSpecialiste);

module.exports = router;