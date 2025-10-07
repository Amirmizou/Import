const Voyage = require('../models/Voyage');
const asyncHandler = require('express-async-handler');

// @desc    Get all voyages
// @route   GET /api/voyages
// @access  Private
const getVoyages = asyncHandler(async (req, res) => {
  const voyages = await Voyage.find({ user: req.user._id })
    .sort({ date: -1 })
    .populate('user', 'name email');

  res.json({
    success: true,
    data: voyages
  });
});

// @desc    Get voyage by ID
// @route   GET /api/voyages/:id
// @access  Private
const getVoyageById = asyncHandler(async (req, res) => {
  const voyage = await Voyage.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate('user', 'name email');

  if (!voyage) {
    res.status(404);
    throw new Error('Voyage non trouvé');
  }

  res.json({
    success: true,
    data: voyage
  });
});

// @desc    Create voyage
// @route   POST /api/voyages
// @access  Private
const createVoyage = asyncHandler(async (req, res) => {
  const voyageData = {
    ...req.body,
    user: req.user._id
  };

  const voyage = await Voyage.create(voyageData);

  res.status(201).json({
    success: true,
    message: 'Voyage créé avec succès',
    data: voyage
  });
});

// @desc    Update voyage
// @route   PUT /api/voyages/:id
// @access  Private
const updateVoyage = asyncHandler(async (req, res) => {
  const voyage = await Voyage.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!voyage) {
    res.status(404);
    throw new Error('Voyage non trouvé');
  }

  // Mettre à jour les champs
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      voyage[key] = req.body[key];
    }
  });

  await voyage.save();

  res.json({
    success: true,
    message: 'Voyage mis à jour avec succès',
    data: voyage
  });
});

// @desc    Delete voyage
// @route   DELETE /api/voyages/:id
// @access  Private
const deleteVoyage = asyncHandler(async (req, res) => {
  const voyage = await Voyage.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!voyage) {
    res.status(404);
    throw new Error('Voyage non trouvé');
  }

  await voyage.deleteOne();

  res.json({
    success: true,
    message: 'Voyage supprimé avec succès'
  });
});

// @desc    Get voyage statistics
// @route   GET /api/voyages/stats
// @access  Private
const getVoyageStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Statistiques générales
  const totalVoyages = await Voyage.countDocuments({ user: userId });
  
  const voyages = await Voyage.find({ user: userId });
  
  let totalValeur = 0;
  let totalBenefice = 0;
  let totalROI = 0;
  const statuts = {};
  const destinations = {};

  voyages.forEach(voyage => {
    totalValeur += voyage.calculs.venteTotal;
    totalBenefice += voyage.calculs.beneficeNet;
    totalROI += voyage.calculs.roiPercent;

    // Compter les statuts
    statuts[voyage.statut] = (statuts[voyage.statut] || 0) + 1;

    // Compter les destinations
    destinations[voyage.destination] = (destinations[voyage.destination] || 0) + 1;
  });

  const moyenneROI = totalVoyages > 0 ? totalROI / totalVoyages : 0;

  // Convertir les objets en tableaux
  const statutsArray = Object.entries(statuts).map(([_id, count]) => ({ _id, count }));
  const destinationsArray = Object.entries(destinations).map(([_id, count]) => ({ _id, count }));

  res.json({
    success: true,
    data: {
      totalVoyages,
      totalValeur,
      totalBenefice,
      moyenneROI,
      statuts: statutsArray,
      destinations: destinationsArray
    }
  });
});

module.exports = {
  getVoyages,
  getVoyageById,
  createVoyage,
  updateVoyage,
  deleteVoyage,
  getVoyageStats
};