const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
    question: { type: String, required: true },
    reponse: { type: String, required: true },
    dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FAQ', FAQSchema);
