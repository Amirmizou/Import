module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/microimport',
  
  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production',
  
  // CORS
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Application Settings
  PLAFOND_VOYAGE: 1800000, // 1.8M DA
  TAUX_DOUANE: 0.05, // 5%
  MAX_VOYAGES_MOIS: 2,
  
  // Default Exchange Rates
  DEFAULT_TAUX_CHANGE: {
    EUR: 165,
    USD: 150,
    TRY: 4.5,
    AED: 41,
    CNY: 21
  }
};
