const express = require('express');
const { body } = require('express-validator');
const { 
  getConfigurations, 
  createConfiguration, 
  updateConfiguration, 
  deleteConfiguration 
} = require('../controllers/configurationController');
const { auth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const configurationValidation = [
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('valeur').isNumeric().withMessage('La valeur doit être un nombre'),
  body('type').isIn(['taux_change', 'marges', 'frais_fixes']).withMessage('Type invalide'),
  body('description').optional().isString()
];

const updateConfigurationValidation = [
  body('nom').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('valeur').optional().isNumeric().withMessage('La valeur doit être un nombre'),
  body('type').optional().isIn(['taux_change', 'marges', 'frais_fixes']).withMessage('Type invalide'),
  body('description').optional().isString()
];

// Routes
router.get('/', auth, getConfigurations);
router.post('/', auth, configurationValidation, handleValidationErrors, createConfiguration);
router.put('/:id', auth, updateConfigurationValidation, handleValidationErrors, updateConfiguration);
router.delete('/:id', auth, deleteConfiguration);

module.exports = router;

