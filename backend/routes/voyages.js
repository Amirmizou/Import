const express = require('express');
const { body } = require('express-validator');
const { 
  getVoyages, 
  getVoyageById, 
  createVoyage, 
  updateVoyage, 
  deleteVoyage,
  getVoyageStats
} = require('../controllers/voyageController');
const { auth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const voyageValidation = [
  body('destination').notEmpty().withMessage('La destination est requise'),
  body('date').isISO8601().withMessage('La date doit être valide'),
  body('deviseVoyage').isIn(['EUR', 'USD', 'TRY', 'AED', 'CNY', 'DA']).withMessage('Devise invalide'),
  body('marchandises').isArray({ min: 1 }).withMessage('Au moins une marchandise est requise'),
  body('calculs').notEmpty().withMessage('Les calculs sont requis')
];

const updateVoyageValidation = [
  body('destination').optional().notEmpty().withMessage('La destination ne peut pas être vide'),
  body('date').optional().isISO8601().withMessage('La date doit être valide'),
  body('deviseVoyage').optional().isIn(['EUR', 'USD', 'TRY', 'AED', 'CNY', 'DA']).withMessage('Devise invalide'),
  body('marchandises').optional().isArray({ min: 1 }).withMessage('Au moins une marchandise est requise'),
  body('calculs').optional().notEmpty().withMessage('Les calculs sont requis')
];

// Routes
router.get('/', auth, getVoyages);
router.get('/stats', auth, getVoyageStats);
router.get('/:id', auth, getVoyageById);
router.post('/', auth, voyageValidation, handleValidationErrors, createVoyage);
router.put('/:id', auth, updateVoyageValidation, handleValidationErrors, updateVoyage);
router.delete('/:id', auth, deleteVoyage);

module.exports = router;