const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/validation');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production', {
    expiresIn: '7d' // Réduit à 7 jours pour plus de sécurité
  });
};

// Set secure cookie
const setTokenCookie = (res, token) => {
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    httpOnly: true, // Empêche l'accès via JavaScript côté client
    secure: process.env.NODE_ENV === 'production', // HTTPS en production
    sameSite: 'strict', // Protection CSRF
    path: '/'
  };
  
  res.cookie('token', token, options);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, location } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'Un utilisateur avec cet email existe déjà'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    location
  });

  if (user) {
    const token = generateToken(user._id);
    
    // Set secure cookie
    setTokenCookie(res, token);
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          isActive: user.isActive,
          createdAt: user.createdAt
        }
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Données utilisateur invalides'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Compte désactivé. Contactez l\'administrateur.'
    });
  }

  const token = generateToken(user._id);

  // Set secure cookie
  setTokenCookie(res, token);

  res.json({
    success: true,
    message: 'Connexion réussie',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // Clear the token cookie
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });

  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, location, preferences } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { 
      name, 
      phone, 
      location, 
      preferences: { ...req.user.preferences, ...preferences }
    },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Profil mis à jour avec succès',
    data: user
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');
  
  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Mot de passe actuel incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Mot de passe modifié avec succès'
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword
};
