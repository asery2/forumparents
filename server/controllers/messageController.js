const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getUserConversations = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const userId = req.user.id;
    
    // Trouver toutes les conversations distinctes où l'utilisateur est impliqué
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(userId) },
            { recipient: mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", mongoose.Types.ObjectId(userId)] },
              "$recipient",
              "$sender"
            ]
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ["$recipient", mongoose.Types.ObjectId(userId)] },
                  { $eq: ["$read", false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 1,
          userId: '$_id',
          nom: '$userDetails.nom',
          prenom: '$userDetails.prenom',
          photo: '$userDetails.photo',
          lastMessage: '$lastMessage.content',
          lastMessageDate: '$lastMessage.createdAt',
          unreadCount: 1
        }
      }
    ]);
    
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des conversations' });
  }
};

exports.getConversationWithUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;
    
    // Vérifier si l'utilisateur existe
    const userExists = await User.exists({ _id: otherUserId });
    
    if (!userExists) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Récupérer tous les messages entre les deux utilisateurs
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ]
    }).sort({ createdAt: 1 });
    
    // Marquer tous les messages non lus comme lus
    await Message.updateMany(
      { 
        sender: otherUserId,
        recipient: currentUserId,
        read: false
      },
      { read: true }
    );
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération de la conversation:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la conversation' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    if (!content || !recipientId) {
      return res.status(400).json({ message: 'Le destinataire et le contenu du message sont requis' });
    }
    
    // Vérifier si le destinataire existe
    const recipientExists = await User.exists({ _id: recipientId });
    
    if (!recipientExists) {
      return res.status(404).json({ message: 'Destinataire non trouvé' });
    }
    
    const newMessage = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content,
      read: false,
      createdAt: new Date()
    });
    
    await newMessage.save();
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'envoi du message' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;
    
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    // Vérifier que l'utilisateur est bien le destinataire du message
    if (message.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Non autorisé à marquer ce message comme lu' });
    }
    
    message.read = true;
    await message.save();
    
    res.status(200).json({ message: 'Message marqué comme lu' });
  } catch (error) {
    console.error('Erreur lors du marquage du message comme lu:', error);
    res.status(500).json({ message: 'Erreur serveur lors du marquage du message comme lu' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;
    
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    // Vérifier que l'utilisateur est l'expéditeur du message
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce message' });
    }
    
    await Message.findByIdAndDelete(messageId);
    
    res.status(200).json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du message' });
  }
};