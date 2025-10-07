const mongoose = require('mongoose');

const marchandiseSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la marchandise est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  quantite: {
    type: Number,
    required: [true, 'La quantité est requise'],
    min: [1, 'La quantité doit être au moins 1']
  },
  prixAchatUnitaire: {
    type: Number,
    required: [true, 'Le prix d\'achat unitaire est requis'],
    min: [0, 'Le prix d\'achat ne peut pas être négatif']
  },
  prixVenteUnitaire: {
    type: Number,
    required: [true, 'Le prix de vente unitaire est requis'],
    min: [0, 'Le prix de vente ne peut pas être négatif']
  },
  poids: {
    type: Number,
    default: 0,
    min: [0, 'Le poids ne peut pas être négatif']
  },
  volume: {
    type: Number,
    default: 0,
    min: [0, 'Le volume ne peut pas être négatif']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  categorie: {
    type: String,
    trim: true,
    enum: ['electronique', 'textile', 'automobile', 'alimentaire', 'cosmetique', 'autre'],
    default: 'autre'
  }
}, {
  timestamps: true
});

// Calculer le coût total d'achat
marchandiseSchema.virtual('coutTotalAchat').get(function() {
  return this.prixAchatUnitaire * this.quantite;
});

// Calculer le revenu total de vente
marchandiseSchema.virtual('revenuTotalVente').get(function() {
  return this.prixVenteUnitaire * this.quantite;
});

// Calculer le bénéfice brut
marchandiseSchema.virtual('beneficeBrut').get(function() {
  return this.revenuTotalVente - this.coutTotalAchat;
});

// Calculer la marge brute en pourcentage
marchandiseSchema.virtual('margeBrutePercent').get(function() {
  if (this.coutTotalAchat === 0) return 0;
  return ((this.beneficeBrut / this.coutTotalAchat) * 100).toFixed(2);
});

// Inclure les virtuals dans le JSON
marchandiseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Marchandise', marchandiseSchema);
