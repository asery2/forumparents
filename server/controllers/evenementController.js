const Evenement = require('../models/Evenement');
const User = require('../models/User');
const mongoose = require('mongoose');

// Récupérer tous les événements
exports.getAllEvenements = async (req, res) => {
  try {
    const evenements = await Evenement.find().sort({ date: 1 }).populate('organisateur', 'nom email');
    res.status(200).json(evenements);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des événements" });
  }
};

// Récupérer un événement par son ID
exports.getEvenementById = async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id)
      .populate('organisateur', 'nom email')
      .populate('participants', 'nom email');
      
    if (!evenement) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    
    res.status(200).json(evenement);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'événement" });
  }
};

// Récupérer les événements à venir
exports.getUpcomingEvenements = async (req, res) => {
  try {
    const now = new Date();
    const evenements = await Evenement.find({ date: { $gt: now } })
      .sort({ date: 1 })
      .populate('organisateur', 'nom email');
      
    res.status(200).json(evenements);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements à venir:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des événements à venir" });
  }
};

// Récupérer les événements passés
exports.getPastEvenements = async (req, res) => {
  try {
    const now = new Date();
    const evenements = await Evenement.find({ date: { $lt: now } })
      .sort({ date: -1 })
      .populate('organisateur', 'nom email');
      
    res.status(200).json(evenements);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements passés:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des événements passés" });
  }
};

// Créer un nouvel événement
exports.createEvenement = async (req, res) => {
  try {
    const { titre, description, date, lieu, places_disponibles, categorie } = req.body;
    
    if (!titre || !description || !date || !lieu || !places_disponibles) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
    
    const nouvelEvenement = new Evenement({
      titre,
      description,
      date,
      lieu,
      places_disponibles,
      categorie,
      organisateur: req.user.id,
      participants: []
    });
    
    await nouvelEvenement.save();
    
    res.status(201).json(nouvelEvenement);
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    res.status(500).json({ message: "Erreur lors de la création de l'événement" });
  }
};

// Mettre à jour un événement
exports.updateEvenement = async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id);
    
    if (!evenement) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    
    // Vérifier si l'utilisateur est l'organisateur
    if (evenement.organisateur.toString() !== req.user.id) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cet événement" });
    }
    
    const { titre, description, date, lieu, places_disponibles, categorie } = req.body;
    
    const evenementMisAJour = await Evenement.findByIdAndUpdate(
      req.params.id,
      { titre, description, date, lieu, places_disponibles, categorie },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(evenementMisAJour);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'événement" });
  }
};

// Supprimer un événement
exports.deleteEvenement = async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id);
    
    if (!evenement) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    
    // Vérifier si l'utilisateur est l'organisateur
    if (evenement.organisateur.toString() !== req.user.id) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cet événement" });
    }
    
    await Evenement.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Événement supprimé avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'événement" });
  }
};

// S'inscrire à un événement
exports.registerToEvenement = async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id);
    
    if (!evenement) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    
    // Vérifier si l'événement est complet
    if (evenement.participants.length >= evenement.places_disponibles) {
      return res.status(400).json({ message: "Cet événement est complet" });
    }
    
    // Vérifier si l'utilisateur est déjà inscrit
    if (evenement.participants.includes(req.user.id)) {
      return res.status(400).json({ message: "Vous êtes déjà inscrit à cet événement" });
    }
    
    // Ajouter l'utilisateur aux participants
    evenement.participants.push(req.user.id);
    await evenement.save();
    
    res.status(200).json({ message: "Inscription réussie", evenement });
  } catch (error) {
    console.error('Erreur lors de l\'inscription à l\'événement:', error);
    res.status(500).json({ message: "Erreur lors de l'inscription à l'événement" });
  }
};

// Annuler une inscription à un événement
exports.cancelRegistration = async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id);
    
    if (!evenement) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    
    // Vérifier si l'utilisateur est inscrit
    const participantIndex = evenement.participants.indexOf(req.user.id);
    if (participantIndex === -1) {
      return res.status(400).json({ message: "Vous n'êtes pas inscrit à cet événement" });
    }
    
    // Retirer l'utilisateur des participants
    evenement.participants.splice(participantIndex, 1);
    await evenement.save();
    
    res.status(200).json({ message: "Désinscription réussie", evenement });
  } catch (error) {
    console.error('Erreur lors de la désinscription de l\'événement:', error);
    res.status(500).json({ message: "Erreur lors de la désinscription de l'événement" });
  }
};