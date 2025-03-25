const Ressource = require('../models/Ressource'); // Supposons que vous avez un modèle Ressource

// Récupérer toutes les ressources
exports.getAllRessources = async (req, res) => {
  try {
    const ressources = await Ressource.find();
    res.status(200).json(ressources);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des ressources', error: error.message });
  }
};

// Récupérer une ressource par son ID
exports.getRessourceById = async (req, res) => {
  try {
    const ressource = await Ressource.findById(req.params.id);
    if (!ressource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    res.status(200).json(ressource);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la ressource', error: error.message });
  }
};

// Récupérer les ressources par catégorie
exports.getRessourcesByCategory = async (req, res) => {
  try {
    const ressources = await Ressource.find({ category: req.params.category });
    res.status(200).json(ressources);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des ressources par catégorie', error: error.message });
  }
};

// Rechercher des ressources
exports.searchRessources = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Paramètre de recherche manquant' });
    }

    // Recherche dans le titre et la description
    const ressources = await Ressource.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    res.status(200).json(ressources);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recherche des ressources', error: error.message });
  }
};

// Créer une nouvelle ressource
exports.createRessource = async (req, res) => {
  try {
    const { title, description, content, category, tags } = req.body;
    
    // Vérification des champs obligatoires
    if (!title || !description || !content || !category) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    const newRessource = new Ressource({
      title,
      description,
      content,
      category,
      tags: tags || [],
      author: req.user.id, // Supposons que l'ID de l'utilisateur est stocké dans req.user.id après l'authentification
      createdAt: new Date()
    });

    const savedRessource = await newRessource.save();
    res.status(201).json(savedRessource);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la ressource', error: error.message });
  }
};

// Mettre à jour une ressource
exports.updateRessource = async (req, res) => {
  try {
    const { title, description, content, category, tags } = req.body;
    const ressourceId = req.params.id;

    // Vérifier si la ressource existe
    const ressource = await Ressource.findById(ressourceId);
    if (!ressource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }

    // Vérifier si l'utilisateur est l'auteur de la ressource
    if (ressource.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé à modifier cette ressource' });
    }

    // Mise à jour de la ressource
    const updatedRessource = await Ressource.findByIdAndUpdate(
      ressourceId,
      {
        title: title || ressource.title,
        description: description || ressource.description,
        content: content || ressource.content,
        category: category || ressource.category,
        tags: tags || ressource.tags,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json(updatedRessource);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la ressource', error: error.message });
  }
};

// Supprimer une ressource
exports.deleteRessource = async (req, res) => {
  try {
    const ressourceId = req.params.id;

    // Vérifier si la ressource existe
    const ressource = await Ressource.findById(ressourceId);
    if (!ressource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }

    // Vérifier si l'utilisateur est l'auteur de la ressource
    if (ressource.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé à supprimer cette ressource' });
    }

    await Ressource.findByIdAndDelete(ressourceId);
    res.status(200).json({ message: 'Ressource supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la ressource', error: error.message });
  }
};