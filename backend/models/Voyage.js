const mongoose = require('mongoose');

const marchandiseSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  nom: {
    type: String,
    required: [true, 'Le nom de la marchandise est requis'],
    trim: true
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
    min: [0, 'Le poids ne peut pas être négatif']
  },
  volume: {
    type: Number,
    min: [0, 'Le volume ne peut pas être négatif']
  }
});

const fraisFixesSchema = new mongoose.Schema({
  transportAller: {
    type: Number,
    default: 0,
    min: [0, 'Le montant ne peut pas être négatif']
  },
  transportRetour: {
    type: Number,
    default: 0,
    min: [0, 'Le montant ne peut pas être négatif']
  },
  hebergement: {
    type: Number,
    default: 0,
    min: [0, 'Le montant ne peut pas être négatif']
  },
  repas: {
    type: Number,
    default: 0,
    min: [0, 'Le montant ne peut pas être négatif']
  },
  visa: {
    type: Number,
    default: 0,
    min: [0, 'Le montant ne peut pas être négatif']
  },
  assurance: {
    type: Number,
    default: 0,
    min: [0, 'Le montant ne peut pas être négatif']
  },
  taxiTransport: {
    type: Number,
    default: 0,
    min: [0, 'Le montant ne peut pas être négatif']
  },
  autres: {
    type: Number,
    default: 0,
    min: [0, 'Le montant ne peut pas être négatif']
  }
});

const calculsSchema = new mongoose.Schema({
  coutTotalAchat: {
    type: Number,
    required: true,
    min: [0, 'Le coût total d\'achat ne peut pas être négatif']
  },
  fraisDouaneTotal: {
    type: Number,
    required: true,
    min: [0, 'Les frais de douane ne peuvent pas être négatifs']
  },
  fraisFixesTotal: {
    type: Number,
    required: true,
    min: [0, 'Les frais fixes ne peuvent pas être négatifs']
  },
  fraisSupp: {
    type: Number,
    required: true,
    min: [0, 'Les frais supplémentaires ne peuvent pas être négatifs']
  },
  coutTotal: {
    type: Number,
    required: true,
    min: [0, 'Le coût total ne peut pas être négatif']
  },
  venteTotal: {
    type: Number,
    required: true,
    min: [0, 'La vente totale ne peut pas être négative']
  },
  beneficeNet: {
    type: Number,
    required: true
  },
  margeBrute: {
    type: Number,
    required: true
  },
  margePercent: {
    type: Number,
    required: true
  },
  roiPercent: {
    type: Number,
    required: true
  },
  valeurDouane: {
    type: Number,
    required: true,
    min: [0, 'La valeur pour douane ne peut pas être négative']
  },
  detailsMarchandises: [{
    nom: String,
    quantite: Number,
    coutAchatDA: Number,
    fraisDouane: Number,
    vente: Number
  }]
});

const voyageSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: [true, 'La destination est requise'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'La date du voyage est requise']
  },
  deviseVoyage: {
    type: String,
    required: [true, 'La devise du voyage est requise'],
    enum: ['EUR', 'USD', 'TRY', 'AED', 'CNY', 'DA'],
    default: 'EUR'
  },
  fraisDouane: {
    type: Number,
    default: 0,
    min: [0, 'Les frais de douane ne peuvent pas être négatifs']
  },
  fraisTransport: {
    type: Number,
    default: 0,
    min: [0, 'Les frais de transport ne peuvent pas être négatifs']
  },
  fraisFixes: {
    type: Number,
    default: 0,
    min: [0, 'Les frais fixes ne peuvent pas être négatifs']
  },
  fraisFixesDetail: {
    type: fraisFixesSchema,
    default: () => ({})
  },
  marchandises: [marchandiseSchema],
  tauxChange: {
    type: Map,
    of: Number,
    default: {}
  },
  statut: {
    type: String,
    enum: ['planifie', 'en_cours', 'termine', 'annule'],
    default: 'planifie'
  },
  calculs: {
    type: calculsSchema,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
voyageSchema.index({ user: 1, date: -1 });
voyageSchema.index({ user: 1, destination: 1 });
voyageSchema.index({ user: 1, statut: 1 });

module.exports = mongoose.model('Voyage', voyageSchema);