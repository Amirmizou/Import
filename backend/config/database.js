const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('🚀 ===== DATABASE CONNECTION DEBUG =====');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔧 Node Version:', process.version);
  console.log('📦 Mongoose Version:', require('mongoose').version);
  
  try {
    // Configuration par défaut pour le développement
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/microimport';
    
    console.log('🔗 Tentative de connexion à MongoDB...');
    console.log('📍 URI (masked):', mongoURI.replace(/\/\/.*@/, '//***:***@'));
    console.log('📍 URI length:', mongoURI.length);
    console.log('📍 URI starts with:', mongoURI.substring(0, 20));
    
    // Log environment variables
    console.log('🔍 Environment Variables:');
    console.log('  - NODE_ENV:', process.env.NODE_ENV);
    console.log('  - PORT:', process.env.PORT);
    console.log('  - MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('  - MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
    
    // Configuration de connexion avec timeout
    const options = {
      serverSelectionTimeoutMS: 15000, // 15 secondes
      socketTimeoutMS: 45000, // 45 secondes
      connectTimeoutMS: 10000, // 10 secondes
      maxPoolSize: 10,
      minPoolSize: 1,
    };
    
    console.log('⚙️  Connection options:', JSON.stringify(options, null, 2));
    console.log('🔄 Starting connection...');
    
    const startTime = Date.now();
    const conn = await mongoose.connect(mongoURI, options);
    const connectionTime = Date.now() - startTime;

    console.log(`✅ MongoDB Connected successfully in ${connectionTime}ms!`);
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Ready State: ${conn.connection.readyState}`);
    console.log(`🔗 Connection ID: ${conn.connection.id}`);
    
    // Test database operations
    try {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log(`📋 Collections found: ${collections.length}`);
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    } catch (dbError) {
      console.log('⚠️  Could not list collections:', dbError.message);
    }
    
    // Gérer les événements de connexion
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error event:', err.message);
      console.error('❌ Error details:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected event');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected event');
    });
    
    mongoose.connection.on('close', () => {
      console.log('🔒 MongoDB connection closed event');
    });
    
    console.log('✅ Database connection setup completed successfully!');
    console.log('🚀 ===== END DATABASE CONNECTION DEBUG =====');
    
  } catch (error) {
    console.error('❌ ===== DATABASE CONNECTION FAILED =====');
    console.error('❌ Error type:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Full error object:', JSON.stringify(error, null, 2));
    
    console.log('💡 Le serveur démarre sans base de données pour le test');
    console.log('💡 Pour une base complète, configurez MongoDB Atlas ou local');
    console.log('💡 Voir MONGODB-ATLAS-SETUP.md pour les instructions');
    
    // En production, continuer sans base de données pour éviter les crashes
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Mode production: Serveur continue sans base de données');
      console.log('⚠️  Configurez MONGODB_URI sur Render pour activer la base de données');
      console.log('⚠️  Ou utilisez MongoDB Atlas avec une chaîne de connexion valide');
      console.log('⚠️  Vérifiez que la chaîne de connexion est correcte dans render.yaml');
      return; // Ne pas arrêter le processus
    }
    
    // En développement, continuer aussi
    console.log('🔧 Mode développement: Serveur continue sans base de données');
    console.log('🚀 ===== END DATABASE CONNECTION DEBUG =====');
  }
};

module.exports = connectDB;
