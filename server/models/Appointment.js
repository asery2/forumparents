const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialist',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  type: {
    type: String,
    enum: ['En ligne', 'En personne'],
    required: true
  },
  status: {
    type: String,
    enum: ['Demandé', 'Confirmé', 'Annulé', 'Terminé', 'Reporté'],
    default: 'Demandé'
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    clientNotes: {
      type: String,
      trim: true
    },
    specialistNotes: {
      type: String,
      trim: true
    }
  },
  paymentStatus: {
    type: String,
    enum: ['En attente', 'Payé', 'Remboursé', 'Annulé'],
    default: 'En attente'
  },
  paymentInfo: {
    amount: Number,
    currency: {
      type: String,
      default: 'EUR'
    },
    transactionId: String,
    paymentMethod: String,
    paymentDate: Date
  },
  meetingLink: {
    type: String,
    trim: true
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    providedAt: Date
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancellationDate: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }
}, { timestamps: true });

// Add indexes for frequently queried fields
appointmentSchema.index({ specialist: 1, appointmentDate: 1 });
appointmentSchema.index({ client: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

// Add methods for appointment management
appointmentSchema.methods.cancel = function(userId, reason) {
  this.status = 'Annulé';
  this.cancellationReason = reason;
  this.cancellationDate = new Date();
  this.cancelledBy = userId;
  return this.save();
};

appointmentSchema.methods.confirm = function() {
  this.status = 'Confirmé';
  return this.save();
};

appointmentSchema.methods.complete = function() {
  this.status = 'Terminé';
  return this.save();
};

appointmentSchema.methods.reschedule = function(newDate) {
  const oldAppointment = this.toObject();
  delete oldAppointment._id;
  
  this.status = 'Reporté';
  
  const newAppointment = new Appointment({
    ...oldAppointment,
    appointmentDate: newDate,
    status: 'Demandé',
    rescheduledFrom: this._id
  });
  
  return Promise.all([this.save(), newAppointment.save()]);
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;