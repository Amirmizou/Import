const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Configuration par défaut pour le développement
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/microimport';
    
    console.log('🔗 Tentative de connexion à MongoDB...');
    console.log('📍 URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Masquer les credentials
    
    // Configuration de connexion avec timeout
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 secondes
      socketTimeoutMS: 45000, // 45 secondes
      bufferMaxEntries: 0,
      bufferCommands: false,
    };
    
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Ready State: ${conn.connection.readyState}`);
    
    // Gérer les événements de connexion
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('💡 Le serveur démarre sans base de données pour le test');
    console.log('💡 Pour une base complète, configurez MongoDB Atlas ou local');
    console.log('💡 Voir MONGODB-ATLAS-SETUP.md pour les instructions');
    
    // En production, continuer sans base de données pour éviter les crashes
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Mode production: Serveur continue sans base de données');
      console.log('⚠️  Configurez MONGODB_URI sur Render pour activer la base de données');
      console.log('⚠️  Ou utilisez MongoDB Atlas avec une chaîne de connexion valide');
      return; // Ne pas arrêter le processus
    }
    
    // En développement, continuer aussi
    console.log('🔧 Mode développement: Serveur continue sans base de données');
  }
};

module.exports = connectDB;
