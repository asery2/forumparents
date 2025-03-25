const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone } = req.body;
    
    // Validation des champs requis
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
    }
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Adresse email invalide' });
    }
    
    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Création du nouvel utilisateur
    const newUser = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      telephone: telephone || '',
      dateInscription: new Date(),
      role: 'utilisateur',
      verified: false
    });
    
    // Génération d'un token de vérification
    const verificationToken = crypto.randomBytes(20).toString('hex');
    newUser.verificationToken = verificationToken;
    newUser.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
    
    await newUser.save();
    
    // Envoyer un email de vérification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Vérification de votre compte',
      html: `
        <h1>Bienvenue sur notre plateforme</h1>
        <p>Bonjour ${prenom} ${nom},</p>
        <p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :</p>
        <a href="${verificationUrl}">Vérifier mon email</a>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Cordialement,<br>L'équipe du site</p>
      `
    });
    
    res.status(201).json({ 
      message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.',
      userId: newUser._id
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation des champs requis
    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe' });
    }
    
    // Rechercher l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    
    // Vérifier si le compte est activé
    if (!user.verified) {
      return res.status(400).json({ message: 'Veuillez vérifier votre email avant de vous connecter' });
    }
    
    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    
    // Générer le JWT
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role
          }
        });
      }
    );
    
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // L'ID de l'utilisateur est extrait du token JWT par le middleware auth
    const user = await User.findById(req.user.id).select('-password -verificationToken -verificationExpires -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { nom, prenom, telephone, photo } = req.body;
    
    // Trouver l'utilisateur
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Mettre à jour les champs
    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (telephone) user.telephone = telephone;
    if (photo) user.photo = photo;
    
    // Enregistrer les modifications
    await user.save();
    
    // Renvoyer le profil mis à jour sans informations sensibles
    const updatedUser = await User.findById(req.user.id).select('-password -verificationToken -verificationExpires -resetPasswordToken -resetPasswordExpires');
    
    res.json({
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Veuillez fournir votre adresse email' });
    }
    
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      // Pour des raisons de sécurité, ne pas divulguer que l'email n'existe pas
      return res.status(200).json({ message: 'Si un compte est associé à cette adresse email, un email de réinitialisation vous sera envoyé' });
    }
    
    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    
    await user.save();
    
    // Envoyer l'email de réinitialisation
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Bonjour ${user.prenom} ${user.nom},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        <p>Cordialement,<br>L'équipe du site</p>
      `
    });
    
    res.status(200).json({ message: 'Un email de réinitialisation a été envoyé à votre adresse email' });
    
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la demande de réinitialisation de mot de passe' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Veuillez fournir un nouveau mot de passe' });
    }
    
    // Trouver l'utilisateur par token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Le token de réinitialisation est invalide ou a expiré' });
    }
    
    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Réinitialiser les champs de réinitialisation
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    // Envoyer un email de confirmation
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Votre mot de passe a été modifié',
      text: `
        Bonjour ${user.prenom} ${user.nom},
        
        Nous vous confirmons que votre mot de passe a été modifié avec succès.
        
        Si vous n'êtes pas à l'origine de cette modification, veuillez contacter notre support immédiatement.
        
        Cordialement,
        L'équipe du site
      `
    });
    
    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la réinitialisation du mot de passe' });
  }
};