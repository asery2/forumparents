const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  attachments: [{
    fileName: String,
    filePath: String,
    fileType: String,
    fileSize: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deletedAt: {
      type: Date
    }
  }],
  isSystemMessage: {
    type: Boolean,
    default: false
  },
  isForwarded: {
    type: Boolean,
    default: false
  },
  originalMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, { timestamps: true });

// Create a compound index for quick message retrieval
messageSchema.index({ conversation: 1, createdAt: -1 });

// Mark message as read
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Soft delete a message for a user
messageSchema.methods.deleteForUser = function(userId) {
  if (!this.isDeleted) {
    this.deletedBy.push({
      user: userId,
      deletedAt: new Date()
    });
    
    // If both users have deleted the message, mark it as completely deleted
    const uniqueUsers = new Set(this.deletedBy.map(item => item.user.toString()));
    if (uniqueUsers.size === 2) {
      this.isDeleted = true;
    }
  }
  
  return this.save();
};

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  title: {
    type: String,
    trim: true
  },
  isGroupChat: {
    type: Boolean,
    default: false
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  parentalStyle: {
    type: String,
    enum: ['Démocratique', 'Permissif', 'Autoritaire', 'Participatif']
  }
}, { timestamps: true });

// Create index for quick participant lookup
conversationSchema.index({ participants: 1 });

// Virtual for unread message count
conversationSchema.virtual('unreadCount').get(async function(userId) {
  return await mongoose.model('Message').countDocuments({
    conversation: this._id,
    receiver: userId,
    isRead: false,
    'deletedBy.user': { $ne: userId }
  });
});

const Message = mongoose.model('Message', messageSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = { Message, Conversation };