#!/usr/bin/env node

/**
 * Script de test pour vérifier la connexion MongoDB
 * Usage: node test-mongodb.js [connection-string]
 */

const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async (mongoURI) => {
  try {
    console.log('🔍 Test de connexion MongoDB...');
    console.log('📍 URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Masquer les credentials
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout de 5 secondes
    });

    console.log('✅ Connexion réussie!');
    console.log('🏠 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    console.log('🔗 Ready State:', conn.connection.readyState);
    
    // Test d'écriture
    const testCollection = conn.connection.db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✍️  Test d\'écriture réussi');
    
    // Nettoyage
    await testCollection.deleteOne({ test: true });
    console.log('🧹 Test nettoyé');
    
    await mongoose.disconnect();
    console.log('👋 Connexion fermée');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 MongoDB n\'est pas accessible sur cette adresse');
      console.log('💡 Vérifiez que MongoDB est démarré ou que l\'URL est correcte');
    } else if (error.message.includes('Authentication failed')) {
      console.log('💡 Erreur d\'authentification');
      console.log('💡 Vérifiez le nom d\'utilisateur et le mot de passe');
    } else if (error.message.includes('network access')) {
      console.log('💡 Accès réseau refusé');
      console.log('💡 Vérifiez les paramètres de réseau dans MongoDB Atlas');
    }
    
    return false;
  }
};

const main = async () => {
  console.log('='.repeat(50));
  console.log('🧪 TEST DE CONNEXION MONGODB');
  console.log('='.repeat(50));
  
  // Utiliser l'URI fournie en argument ou celle de l'environnement
  const mongoURI = process.argv[2] || process.env.MONGODB_URI || 'mongodb://localhost:27017/microimport';
  
  const success = await testConnection(mongoURI);
  
  console.log('='.repeat(50));
  if (success) {
    console.log('🎉 TEST RÉUSSI - MongoDB est accessible');
    process.exit(0);
  } else {
    console.log('💥 TEST ÉCHOUÉ - Vérifiez la configuration');
    process.exit(1);
  }
};

main();

