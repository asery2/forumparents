const Ressource = require('../models/Ressource');
const Appointment = require('../models/Appointment');

// Récupérer les rendez-vous de l'utilisateur connecté
exports.getUserAppointments = async (req, res) => {
    try {
      const appointments = await Appointment.find({ user: req.user.id })
        .sort({ date: -1 }); // Trie par date décroissante
      
      res.json(appointments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  };

// Récupérer les rendez-vous d'un spécialiste
exports.getSpecialistAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ specialist: req.params.specialistId }).sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Créer un rendez-vous
exports.createAppointment = async (req, res) => {
    try {
        const { specialistId, date, motif } = req.body;
        const newAppointment = new Appointment({
            user: req.user.id,
            specialist: specialistId,
            date,
            motif
        });
        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Modifier un rendez-vous
exports.updateAppointment = async (req, res) => {
    try {
        const { date, motif } = req.body;
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) return res.status(404).json({ message: 'Rendez-vous non trouvé' });

        if (appointment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        appointment.date = date || appointment.date;
        appointment.motif = motif || appointment.motif;
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Annuler un rendez-vous
exports.cancelAppointment = async (req, res) => {
    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) return res.status(404).json({ message: 'Rendez-vous non trouvé' });

        if (appointment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rendez-vous annulé' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Récupérer les créneaux disponibles d'un spécialiste
exports.getAvailableSlots = async (req, res) => {
    try {
        const specialistId = req.params.specialistId;
        // Logique pour récupérer les créneaux disponibles (à adapter)
        res.json({ message: `Créneaux disponibles pour le spécialiste ${specialistId}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};


exports.getAllRessources = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const ressources = await Ressource.find()
      .sort({ dateCreation: -1 })
      .skip(skip)
      .limit(limit)
      .populate('auteur', 'nom prenom');
    
    const total = await Ressource.countDocuments();
    
    res.status(200).json({
      ressources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ressources:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des ressources' });
  }
};

exports.getRessourceById = async (req, res) => {
  try {
    const ressource = await Ressource.findById(req.params.id)
      .populate('auteur', 'nom prenom');
    
    if (!ressource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    
    // Incrémenter le compteur de téléchargements si le paramètre est spécifié
    if (req.query.download === 'true') {
      ressource.telechargements += 1;
      await ressource.save();
    }
    
    res.status(200).json(ressource);
  } catch (error) {
    console.error('Erreur lors de la récupération de la ressource:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la ressource' });
  }
};

exports.getRessourcesByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const ressources = await Ressource.find({ categorie: category })
      .sort({ dateCreation: -1 })
      .skip(skip)
      .limit(limit)
      .populate('auteur', 'nom prenom');
    
    const total = await Ressource.countDocuments({ categorie: category });
    
    res.status(200).json({
      ressources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ressources par catégorie:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des ressources par catégorie' });
  }
};

exports.searchRessources = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    if (!query) {
      return res.status(400).json({ message: 'Paramètre de recherche manquant' });
    }
    
    const searchRegex = new RegExp(query, 'i');
    
    const ressources = await Ressource.find({
      $or: [
        { titre: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    })
      .sort({ dateCreation: -1 })
      .skip(skip)
      .limit(limit)
      .populate('auteur', 'nom prenom');
    
    const total = await Ressource.countDocuments({
      $or: [
        { titre: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    });
    
    res.status(200).json({
      ressources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la recherche des ressources:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la recherche des ressources' });
  }
};

exports.createRessource = async (req, res) => {
  try {
    const { titre, description, contenu, categorie, tags, fichierUrl } = req.body;
    
    if (!titre || !description || !categorie) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }
    
    const nouvelleRessource = new Ressource({
      titre,
      description,
      contenu,
      categorie,
      tags: tags || [],
      fichierUrl,
      auteur: req.userId, // Supposant que l'ID de l'utilisateur est disponible via middleware d'authentification
      dateCreation: new Date(),
      telechargements: 0,
      vues: 0
    });
    
    const ressourceSauvegardee = await nouvelleRessource.save();
    
    res.status(201).json(ressourceSauvegardee);
  } catch (error) {
    console.error('Erreur lors de la création de la ressource:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la ressource' });
  }
};

exports.updateRessource = async (req, res) => {
  try {
    const ressourceId = req.params.id;
    const { titre, description, contenu, categorie, tags, fichierUrl } = req.body;
    
    const ressource = await Ressource.findById(ressourceId);
    
    if (!ressource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    
    // Vérifier si l'utilisateur est l'auteur (à adapter selon votre logique d'authentification)
    if (ressource.auteur.toString() !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé à modifier cette ressource' });
    }
    
    const ressourceMiseAJour = await Ressource.findByIdAndUpdate(
      ressourceId,
      {
        titre,
        description,
        contenu,
        categorie,
        tags,
        fichierUrl,
        dateModification: new Date()
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(ressourceMiseAJour);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la ressource:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la ressource' });
  }
};

exports.deleteRessource = async (req, res) => {
  try {
    const ressourceId = req.params.id;
    
    const ressource = await Ressource.findById(ressourceId);
    
    if (!ressource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    
    // Vérifier si l'utilisateur est l'auteur ou un administrateur
    if (ressource.auteur.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à supprimer cette ressource' });
    }
    
    await Ressource.findByIdAndDelete(ressourceId);
    
    res.status(200).json({ message: 'Ressource supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la ressource:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la ressource' });
  }
};

exports.incrementViewCount = async (req, res) => {
  try {
    const ressourceId = req.params.id;
    
    const ressource = await Ressource.findById(ressourceId);
    
    if (!ressource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    
    ressource.vues += 1;
    await ressource.save();
    
    res.status(200).json({ message: 'Compteur de vues incrémenté', vues: ressource.vues });
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation du compteur de vues:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};