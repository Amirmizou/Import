const Configuration = require('../models/Configuration');
const asyncHandler = require('express-async-handler');

// @desc    Get all configurations
// @route   GET /api/configurations
// @access  Private
const getConfigurations = asyncHandler(async (req, res) => {
  const { type } = req.query;
  
  let query = { user: req.user._id };
  if (type) {
    query.type = type;
  }

  const configurations = await Configuration.find(query).sort({ type: 1, nom: 1 });

  res.json({
    success: true,
    data: configurations
  });
});

// @desc    Create configuration
// @route   POST /api/configurations
// @access  Private
const createConfiguration = asyncHandler(async (req, res) => {
  const { nom, valeur, type, description } = req.body;

  // Vérifier si la configuration existe déjà
  const existingConfig = await Configuration.findOne({
    nom,
    type,
    user: req.user._id
  });

  if (existingConfig) {
    // Mettre à jour la configuration existante
    existingConfig.valeur = valeur;
    if (description) existingConfig.description = description;
    await existingConfig.save();

    res.json({
      success: true,
      message: 'Configuration mise à jour avec succès',
      data: existingConfig
    });
  } else {
    // Créer une nouvelle configuration
    const configuration = await Configuration.create({
      nom,
      valeur,
      type,
      description,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Configuration créée avec succès',
      data: configuration
    });
  }
});

// @desc    Update configuration
// @route   PUT /api/configurations/:id
// @access  Private
const updateConfiguration = asyncHandler(async (req, res) => {
  const { nom, valeur, type, description } = req.body;

  const configuration = await Configuration.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!configuration) {
    res.status(404);
    throw new Error('Configuration non trouvée');
  }

  configuration.nom = nom || configuration.nom;
  configuration.valeur = valeur !== undefined ? valeur : configuration.valeur;
  configuration.type = type || configuration.type;
  configuration.description = description || configuration.description;

  await configuration.save();

  res.json({
    success: true,
    message: 'Configuration mise à jour avec succès',
    data: configuration
  });
});

// @desc    Delete configuration
// @route   DELETE /api/configurations/:id
// @access  Private
const deleteConfiguration = asyncHandler(async (req, res) => {
  const configuration = await Configuration.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!configuration) {
    res.status(404);
    throw new Error('Configuration non trouvée');
  }

  await configuration.deleteOne();

  res.json({
    success: true,
    message: 'Configuration supprimée avec succès'
  });
});

module.exports = {
  getConfigurations,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration
};
