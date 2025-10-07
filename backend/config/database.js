const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Configuration par défaut pour le développement
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/microimport';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('💡 Le serveur démarre sans base de données pour le test');
    console.log('💡 Pour une base complète, configurez MongoDB Atlas ou local');
    console.log('💡 Voir backend/MONGODB-SETUP.md pour les instructions');
    // Ne pas arrêter le processus en développement
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
