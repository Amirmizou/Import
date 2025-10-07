const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Configuration par défaut pour le développement
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/microimport';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('💡 Le serveur démarre sans base de données pour le test');
    console.log('💡 Pour une base complète, configurez MongoDB Atlas ou local');
    console.log('💡 Voir MONGODB-ATLAS-SETUP.md pour les instructions');
    
    // En production, continuer sans base de données pour éviter les crashes
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Mode production: Serveur continue sans base de données');
      console.log('⚠️  Configurez MONGODB_URI sur Render pour activer la base de données');
      return; // Ne pas arrêter le processus
    }
    
    // En développement, continuer aussi
    console.log('🔧 Mode développement: Serveur continue sans base de données');
  }
};

module.exports = connectDB;
