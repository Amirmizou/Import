const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la configuration est requis'],
    trim: true
  },
  valeur: {
    type: Number,
    required: [true, 'La valeur de la configuration est requise'],
    min: [0, 'La valeur ne peut pas être négative']
  },
  type: {
    type: String,
    required: [true, 'Le type de configuration est requis'],
    enum: ['taux_change', 'marges', 'frais_fixes'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index pour éviter les doublons
configurationSchema.index({ nom: 1, type: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Configuration', configurationSchema);
