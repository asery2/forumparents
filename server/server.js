const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

// Charger les variables d'environnement avant d'importer les modules qui en dépendent
dotenv.config();

// Pour déboguer, afficher le contenu complet de process.env (attention aux données sensibles)
console.log("Variables d'environnement chargées:", Object.keys(process.env));
console.log("MONGODB_URI:", process.env.MONGODB_URI || "NON DÉFINI");

// Importer la connexion à la base de données après avoir chargé les variables d'environnement
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
try {
    connectDB();
    console.log("Tentative de connexion à MongoDB...");
} catch (error) {
    console.error("Erreur lors de la connexion à MongoDB:", error.message);
}

// Routes
const authRoutes = require('./routes/authRoutes');
const forumRoutes = require('./routes/forumRoutes');
const ressourceRoutes = require('./routes/ressourceRoutes');
const specialisteRoutes = require('./routes/specialisteRoutes');
const evenementRoutes = require('./routes/evenementRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/ressources', ressourceRoutes);
app.use('/api/specialists', specialisteRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contact', contactRoutes);

// Route pour toutes les autres requêtes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Port d'écoute
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});