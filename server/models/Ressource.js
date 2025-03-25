const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['article', 'video', 'ebook', 'worksheet', 'guide', 'tool', 'podcast', 'other'],
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  file: {
    fileName: String,
    filePath: String,
    fileType: String,
    fileSize: Number
  },
  externalLink: {
    type: String,
    trim: true
  },
  thumbnail: {
    type: String,
    default: 'default-resource-thumbnail.png'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
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
  childAgeRange: {
    min: Number,
    max: Number
  },
  parentalStyle: {
    type: String,
    enum: ['Démocratique', 'Permissif', 'Autoritaire', 'Participatif', 'Tous styles']
  }
}, { timestamps: true });

// Calculate average rating
resourceSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) {
    return 0;
  }
  const sum = this.ratings.reduce((total, rating) => total + rating.score, 0);
  return (sum / this.ratings.length).toFixed(1);
});

// Add text index for search functionality
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;