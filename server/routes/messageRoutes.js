const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// Toutes les routes nécessitent l'authentification
router.get('/conversations', auth, messageController.getUserConversations);
router.get('/conversation/:userId', auth, messageController.getConversationWithUser);
router.post('/', auth, messageController.sendMessage);
router.put('/:id/read', auth, messageController.markAsRead);
router.delete('/:id', auth, messageController.deleteMessage);

module.exports = router;