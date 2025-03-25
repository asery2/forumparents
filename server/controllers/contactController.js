const Contact = require('../models/Contact');
const FAQ = require('../models/FAQ');
const nodemailer = require('nodemailer');

exports.submitContactForm = async (req, res) => {
  try {
    const { nom, prenom, email, sujet, message } = req.body;
    
    // Validation des champs requis
    if (!nom || !prenom || !email || !message) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }
    
    // Validation de l'email (expression régulière simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Adresse email invalide' });
    }
    
    // Création d'un nouveau contact
    const newContact = new Contact({
      nom,
      prenom,
      email,
      sujet: sujet || 'Question générale',
      message,
      dateEnvoi: new Date(),
      traite: false
    });
    
    await newContact.save();
    
    // Envoyer un email de confirmation (configuration à adapter)
    const transporter = nodemailer.createTransport({
      // Configurer votre service de mail ici
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Envoyer un email à l'administrateur
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Nouveau message de contact: ${sujet || 'Question générale'}`,
      text: `
        Nouveau message de: ${prenom} ${nom}
        Email: ${email}
        Sujet: ${sujet || 'Question générale'}
        Message: ${message}
      `
    });
    
    // Envoyer un email de confirmation à l'utilisateur
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmation de votre message',
      text: `
        Bonjour ${prenom} ${nom},
        
        Nous avons bien reçu votre message concernant "${sujet || 'Question générale'}".
        Un membre de notre équipe vous contactera dans les plus brefs délais.
        
        Cordialement,
        L'équipe du site
      `
    });
    
    res.status(201).json({ 
      message: 'Votre message a été envoyé avec succès',
      contact: newContact
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du formulaire de contact:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'envoi du formulaire de contact' });
  }
};

exports.getFAQs = async (req, res) => {
  try {
    // Rechercher toutes les FAQ actives, triées par ordre
    const faqs = await FAQ.find({ active: true })
      .sort({ ordre: 1 })
      .select('question reponse categorie');
    
    // Regrouper les FAQs par catégorie
    const faqsByCategory = {};
    faqs.forEach(faq => {
      const categorie = faq.categorie || 'Général';
      if (!faqsByCategory[categorie]) {
        faqsByCategory[categorie] = [];
      }
      faqsByCategory[categorie].push({
        question: faq.question,
        reponse: faq.reponse
      });
    });
    
    res.status(200).json(faqsByCategory);
  } catch (error) {
    console.error('Erreur lors de la récupération des FAQs:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des FAQs' });
  }
};