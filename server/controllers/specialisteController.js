const Specialist = require('../models/Specialist');

// Récupérer tous les spécialistes
exports.getAllSpecialistes = async (req, res) => {
    try {
        const { speciality, location, availability } = req.query;
        
        let filter = {};
        
        // Appliquer les filtres s'ils sont présents
        if (speciality) filter.speciality = speciality;
        if (location) filter['location.city'] = location;
        
        const specialists = await Specialist.find(filter)
            .populate('userId', 'fullName profilePicture')
            .sort({ rating: -1 });
        
        res.json(specialists);
    } catch (error) {
        console.error('Erreur lors de la récupération des spécialistes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer un spécialiste par ID
exports.getSpecialisteById = async (req, res) => {
    try {
        const specialist = await Specialist.findById(req.params.id)
            .populate('userId', 'fullName profilePicture email');
        
        if (!specialist) {
            return res.status(404).json({ message: 'Spécialiste non trouvé' });
        }
        
        res.json(specialist);
    } catch (error) {
        console.error('Erreur lors de la récupération du spécialiste:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer les spécialistes par spécialité
exports.getSpecialistesBySpeciality = async (req, res) => {
    try {
        const specialists = await Specialist.find({ speciality: req.params.speciality })
            .populate('userId', 'fullName profilePicture');
        
        res.json(specialists);
    } catch (error) {
        console.error('Erreur lors de la récupération des spécialistes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer les spécialistes par localisation
exports.getSpecialistesByLocation = async (req, res) => {
    try {
        const specialists = await Specialist.find({ 'location.city': req.params.location })
            .populate('userId', 'fullName profilePicture');
        
        res.json(specialists);
    } catch (error) {
        console.error('Erreur lors de la récupération des spécialistes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Créer un spécialiste
exports.createSpecialiste = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est déjà un spécialiste
        const existingSpecialist = await Specialist.findOne({ userId: req.user.id });
        
        if (existingSpecialist) {
            return res.status(400).json({ message: 'Cet utilisateur est déjà enregistré comme spécialiste' });
        }
        
        const newSpecialist = new Specialist({
            userId: req.user.id,
            title: req.body.title,
            speciality: req.body.speciality,
            expertise: req.body.expertise,
            description: req.body.description,
            location: req.body.location,
            consultationTypes: req.body.consultationTypes
        });
        
        const specialist = await newSpecialist.save();
        
        res.status(201).json(specialist);
    } catch (error) {
        console.error('Erreur lors de la création du spécialiste:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un spécialiste
exports.updateSpecialiste = async (req, res) => {
    try {
        const specialist = await Specialist.findById(req.params.id);
        
        if (!specialist) {
            return res.status(404).json({ message: 'Spécialiste non trouvé' });
        }
        
        // Vérifier que l'utilisateur est bien le propriétaire
        if (specialist.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Non autorisé' });
        }
        
        const updatedSpecialist = await Specialist.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        res.json(updatedSpecialist);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du spécialiste:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un spécialiste
exports.deleteSpecialiste = async (req, res) => {
    try {
        const specialist = await Specialist.findById(req.params.id);
        
        if (!specialist) {
            return res.status(404).json({ message: 'Spécialiste non trouvé' });
        }
        
        // Vérifier que l'utilisateur est bien le propriétaire ou admin
        if (specialist.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Non autorisé' });
        }
        
        await specialist.remove();
        
        res.json({ message: 'Spécialiste supprimé' });
    } catch (error) {
        console.error('Erreur lors de la suppression du spécialiste:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};