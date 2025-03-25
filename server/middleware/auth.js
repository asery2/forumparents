const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Récupérer le token du header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Vérifier si un token existe
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé, authentification requise' });
    }
    
    try {
        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ajouter l'utilisateur à l'objet requête
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};