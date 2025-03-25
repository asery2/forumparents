const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Routes publiques
router.post('/', contactController.submitContactForm);
router.get('/faq', contactController.getFAQs);

module.exports = router;