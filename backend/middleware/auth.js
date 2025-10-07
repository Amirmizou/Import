const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('🔍 Auth middleware - Request details:');
    console.log('  - Cookies:', req.cookies);
    console.log('  - Authorization header:', req.header('Authorization'));
    console.log('  - Origin:', req.header('Origin'));
    console.log('  - User-Agent:', req.header('User-Agent'));
    
    // Vérifier d'abord les cookies, puis l'Authorization header
    let token = req.cookies.token;
    
    if (!token) {
      token = req.header('Authorization')?.replace('Bearer ', '');
    }
    
    console.log('🔍 Token found:', !!token);
    
    if (!token) {
      console.log('❌ No token found in cookies or Authorization header');
      return res.status(401).json({ 
        success: false, 
        message: 'Accès refusé. Token manquant.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production');
    
    // Essayer de récupérer l'utilisateur depuis la base de données
    try {
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Token invalide. Utilisateur non trouvé.' 
        });
      }

      if (!user.isActive) {
        return res.status(401).json({ 
          success: false, 
          message: 'Compte désactivé.' 
        });
      }

      req.user = user;
    } catch (dbError) {
      // Si la base de données n'est pas disponible, utiliser les infos du token
      console.warn('⚠️  Base de données non disponible, utilisation du token JWT:', dbError.message);
      req.user = {
        _id: decoded.id,
        name: decoded.name || 'Utilisateur',
        email: decoded.email || 'user@example.com',
        isActive: true,
        role: decoded.role || 'user'
      };
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Token invalide.' 
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Accès refusé. Droits administrateur requis.' 
        });
      }
      next();
    });
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur de vérification des droits administrateur.' 
    });
  }
};

module.exports = { auth, adminAuth };
