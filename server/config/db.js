// db.js - pour la connexion MongoDB
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement depuis le fichier .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Ajouter un console.log pour vérifier la variable d'environnement MONGODB_URI
console.log("MONGODB_URI:", process.env.MONGODB_URI);  // Pour vérifier si la variable est bien chargée

// Vérifier si MONGODB_URI est défini dans l'environnement
if (!process.env.MONGODB_URI) {
    console.error("ERREUR: La variable MONGODB_URI est introuvable. Vérifie ton fichier .env.");
    process.exit(1); // Arrêter l'exécution si la variable est introuvable
}

const connectDB = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connecté');
    } catch (error) {
        console.error("Erreur de connexion à MongoDB:", error);
        process.exit(1); // Sortir en cas d'erreur de connexion
    }
};

module.exports = connectDB;