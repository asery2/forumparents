const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    enum: ['Webinaire', 'Atelier', 'Conférence', 'Formation', 'Groupe de discussion', 'Autre'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['En ligne', 'Présentiel', 'Hybride'],
      required: true
    },
    address: String,
    city: String,
    postalCode: String,
    country: {
      type: String,
      default: 'France'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    meetingLink: String,
    meetingPlatform: String
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  speakers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    role: String,
    bio: String,
    photo: String
  }],
  capacity: {
    type: Number,
    default: null // null means unlimited
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Inscrit', 'Confirmé', 'En attente', 'Annulé'],
      default: 'Inscrit'
    },
    attended: {
      type: Boolean,
      default: false
    }
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: 'default-event-image.jpg'
  },
  documents: [{
    title: String,
    description: String,
    filePath: String,
    fileType: String,
    fileSize: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['Planifié', 'En cours', 'Terminé', 'Annulé', 'Reporté'],
    default: 'Planifié'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  parentalStyle: {
    type: String,
    enum: ['Démocratique', 'Permissif', 'Autoritaire', 'Participatif', 'Tous styles'],
    default: 'Tous styles'
  },
  childAgeRange: {
    min: Number,
    max: Number
  },
  price: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'EUR'
    }
  },
  isFree: {
    type: Boolean,
    default: true
  },
  recurrence: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      enum: ['Quotidien', 'Hebdomadaire', 'Mensuel', 'Personnalisé'],
      default: 'Hebdomadaire'
    },
    interval: Number, // every X days/weeks/months
    endDate: Date
  },
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  remindersSent: {
    oneDay: {
      type: Boolean,
      default: false
    },
    oneHour: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

// Add text index for search functionality
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees.filter(a => a.status !== 'Annulé').length;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (this.capacity === null) return 'Illimité';
  const registered = this.attendees.filter(a => a.status !== 'Annulé').length;
  return Math.max(0, this.capacity - registered);
});

// Calculate average rating
eventSchema.virtual('averageRating').get(function() {
  if (this.feedback.length === 0) {
    return 0;
  }
  const sum = this.feedback.reduce((total, item) => total + item.rating, 0);
  return (sum / this.feedback.length).toFixed(1);
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;