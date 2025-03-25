const mongoose = require('mongoose');

const specialistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profession: {
    type: String,
    required: true,
    enum: ['Psychologue', 'Orthophoniste', 'Éducateur spécialisé', 'Pédiatre', 'Coach parental', 'Enseignant spécialisé', 'Autre']
  },
  specializations: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true,
    trim: true
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: {
    type: Number, // years of experience
    required: true
  },
  certifications: [{
    name: String,
    issuingBody: String,
    year: Number,
    validUntil: Date
  }],
  consultationFee: {
    amount: Number,
    currency: {
      type: String,
      default: 'EUR'
    }
  },
  availability: [{
    day: {
      type: String,
      enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    },
    startTime: String,
    endTime: String
  }],
  offersVirtualConsultation: {
    type: Boolean,
    default: true
  },
  offersInPersonConsultation: {
    type: Boolean,
    default: false
  },
  location: {
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
    }
  },
  languages: [{
    type: String,
    default: 'Français'
  }],
  website: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    documentType: String,
    documentPath: String,
    uploadDate: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  }],
  reviews: [{
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
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Virtual for calculating average rating
specialistSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) {
    return 0;
  }
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

const Specialist = mongoose.model('Specialist', specialistSchema);

module.exports = Specialist;