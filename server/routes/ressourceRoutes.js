const express = require('express');
const router = express.Router();
const ressourceController = require('../controllers/ressourceController');
const auth = require('../middleware/auth');

// Routes publiques
router.get('/', ressourceController.getAllRessources);
router.get('/:id', ressourceController.getRessourceById);
router.get('/category/:category', ressourceController.getRessourcesByCategory);
router.get('/search', ressourceController.searchRessources);

// Routes protégées
router.post('/', auth, ressourceController.createRessource);
router.put('/:id', auth, ressourceController.updateRessource);
router.delete('/:id', auth, ressourceController.deleteRessource);

module.exports = router;