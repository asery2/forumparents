const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const auth = require('../middleware/auth');

// Routes publiques
router.get('/categories', forumController.getAllCategories);
router.get('/categories/:id', forumController.getCategoryById);
router.get('/posts', forumController.getAllPosts);
router.get('/posts/:id', forumController.getPostById);
router.get('/posts/category/:categoryId', forumController.getPostsByCategory);
router.get('/comments/post/:postId', forumController.getCommentsByPost);

// Routes protégées
router.post('/posts', auth, forumController.createPost);
router.put('/posts/:id', auth, forumController.updatePost);
router.delete('/posts/:id', auth, forumController.deletePost);
router.post('/comments', auth, forumController.createComment);
router.put('/comments/:id', auth, forumController.updateComment);
router.delete('/comments/:id', auth, forumController.deleteComment);

module.exports = router;