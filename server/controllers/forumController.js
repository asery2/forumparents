const Post = require('../models/Post');
const Category = require('../models/Category');
const Comment = require('../models/Comment');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ ordre: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des catégories' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la catégorie' });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find()
      .sort({ dateCreation: -1 })
      .skip(skip)
      .limit(limit)
      .populate('auteur', 'nom prenom photo')
      .populate('categorie', 'nom')
      .lean();
    
    // Compter le nombre de commentaires pour chaque post
    for (let post of posts) {
      post.nombreCommentaires = await Comment.countDocuments({ post: post._id });
    }
    
    const total = await Post.countDocuments();
    
    res.status(200).json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des posts' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('auteur', 'nom prenom photo')
      .populate('categorie', 'nom');
    
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    
    // Incrémenter le compteur de vues
    post.vues += 1;
    await post.save();
    
    // Récupérer les commentaires pour ce post
    const comments = await Comment.find({ post: post._id })
      .sort({ dateCreation: -1 })
      .populate('auteur', 'nom prenom photo');
    
    res.status(200).json({
      post,
      comments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du post:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du post' });
  }
};

exports.getPostsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Vérifier que la catégorie existe
    const categoryExists = await Category.exists({ _id: categoryId });
    if (!categoryExists) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    const posts = await Post.find({ categorie: categoryId })
      .sort({ dateCreation: -1 })
      .skip(skip)
      .limit(limit)
      .populate('auteur', 'nom prenom photo')
      .populate('categorie', 'nom')
      .lean();
    
    // Compter le nombre de commentaires pour chaque post
    for (let post of posts) {
      post.nombreCommentaires = await Comment.countDocuments({ post: post._id });
    }
    
    const total = await Post.countDocuments({ categorie: categoryId });
    
    res.status(200).json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des posts par catégorie:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des posts par catégorie' });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    
    // Vérifier que le post existe
    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    
    const comments = await Comment.find({ post: postId })
      .sort({ dateCreation: -1 })
      .populate('auteur', 'nom prenom photo');
    
    res.status(200).json(comments);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des commentaires' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { titre, contenu, categorie } = req.body;
    
    // Validation des champs requis
    if (!titre || !contenu || !categorie) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }
    
    // Vérifier que la catégorie existe
    const categoryExists = await Category.exists({ _id: categorie });
    if (!categoryExists) {
      return res.status(400).json({ message: 'Catégorie invalide' });
    }
    
    // Créer le nouveau post
    const newPost = new Post({
      titre,
      contenu,
      categorie,
      auteur: req.user.id,
      dateCreation: new Date(),
      vues: 0
    });
    
    await newPost.save();
    
    // Retourner le post créé avec les informations sur l'auteur et la catégorie
    const populatedPost = await Post.findById(newPost._id)
      .populate('auteur', 'nom prenom photo')
      .populate('categorie', 'nom');
    
    res.status(201).json({
      message: 'Post créé avec succès',
      post: populatedPost
    });
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { titre, contenu, categorie } = req.body;
    const postId = req.params.id;
    
    // Validation des champs requis
    if (!titre && !contenu && !categorie) {
      return res.status(400).json({ message: 'Veuillez fournir au moins un champ à mettre à jour' });
    }
    
    // Vérifier que le post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    
    // Vérifier que l'utilisateur est l'auteur ou un administrateur
    if (post.auteur.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Vous n\'êtes pas autorisé à modifier ce post' });
    }
    
    // Si la catégorie est mise à jour, vérifier qu'elle existe
    if (categorie) {
      const categoryExists = await Category.exists({ _id: categorie });
      if (!categoryExists) {
        return res.status(400).json({ message: 'Catégorie invalide' });
      }
    }
    
    // Mettre à jour les champs
    if (titre) post.titre = titre;
    if (contenu) post.contenu = contenu;
    if (categorie) post.categorie = categorie;
    
    // Ajouter la date de dernière modification
    post.dateModification = new Date();
    
    await post.save();
    
    // Retourner le post mis à jour avec les informations sur l'auteur et la catégorie
    const updatedPost = await Post.findById(postId)
      .populate('auteur', 'nom prenom photo')
      .populate('categorie', 'nom');
    
    res.status(200).json({
      message: 'Post mis à jour avec succès',
      post: updatedPost
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du post:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Vérifier que le post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    
    // Vérifier que l'utilisateur est l'auteur ou un administrateur
    if (post.auteur.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Vous n\'êtes pas autorisé à supprimer ce post' });
    }
    
    // Supprimer tous les commentaires associés
    await Comment.deleteMany({ post: postId });
    
    // Supprimer le post
    await Post.findByIdAndDelete(postId);
    
    res.status(200).json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du post' });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { post, contenu } = req.body;
    
    // Validation des champs requis
    if (!post || !contenu) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }
    
    // Vérifier que le post existe
    const postExists = await Post.exists({ _id: post });
    if (!postExists) {
      return res.status(400).json({ message: 'Post invalide' });
    }
    
    // Créer le nouveau commentaire
    const newComment = new Comment({
      post,
      contenu,
      auteur: req.user.id,
      dateCreation: new Date()
    });
    
    await newComment.save();
    
    // Retourner le commentaire créé avec les informations sur l'auteur
    const populatedComment = await Comment.findById(newComment._id)
      .populate('auteur', 'nom prenom photo');
    
    res.status(201).json({
      message: 'Commentaire ajouté avec succès',
      comment: populatedComment
    });
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du commentaire' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { contenu } = req.body;
    const commentId = req.params.id;
    
    // Validation des champs requis
    if (!contenu) {
      return res.status(400).json({ message: 'Le contenu est obligatoire' });
    }
    
    // Vérifier que le commentaire existe
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    
    // Vérifier que l'utilisateur est l'auteur ou un administrateur
    if (comment.auteur.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Vous n\'êtes pas autorisé à modifier ce commentaire' });
    }
    
    // Mettre à jour le contenu
    comment.contenu = contenu;
    
    // Ajouter la date de dernière modification
    comment.dateModification = new Date();
    
    await comment.save();
    
    // Retourner le commentaire mis à jour avec les informations sur l'auteur
    const updatedComment = await Comment.findById(commentId)
      .populate('auteur', 'nom prenom photo');
    
    res.status(200).json({
      message: 'Commentaire mis à jour avec succès',
      comment: updatedComment
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du commentaire:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du commentaire' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    
    // Vérifier que le commentaire existe
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    
    // Vérifier que l'utilisateur est l'auteur ou un administrateur
    if (comment.auteur.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Vous n\'êtes pas autorisé à supprimer ce commentaire' });
    }
    
    // Supprimer le commentaire
    await Comment.findByIdAndDelete(commentId);
    
    res.status(200).json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du commentaire' });
  }
};