const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Inscription
router.post('/register', authController.register);

// Connexion
router.post('/login', authController.login);

// Récupérer le profil de l'utilisateur connecté
router.get('/profile', authController.getProfile);

// Mettre à jour le profil
router.put('/profile', authController.updateProfile);

// Réinitialisation du mot de passe
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;