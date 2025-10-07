#!/usr/bin/env node

/**
 * Script de test pour vérifier les routes API
 * Usage: node test-api.js [base-url] [token]
 */

const axios = require('axios');

const testAPI = async (baseUrl, token) => {
  console.log('🧪 Test des routes API...');
  console.log('📍 Base URL:', baseUrl);
  console.log('🔑 Token:', token ? 'Présent' : 'Manquant');
  console.log('='.repeat(50));

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const tests = [
    {
      name: 'GET /api/voyages',
      method: 'GET',
      url: `${baseUrl}/api/voyages`,
      expectedStatus: [200, 401]
    },
    {
      name: 'GET /api/configurations',
      method: 'GET',
      url: `${baseUrl}/api/configurations`,
      expectedStatus: [200, 401]
    },
    {
      name: 'POST /api/voyages (test)',
      method: 'POST',
      url: `${baseUrl}/api/voyages`,
      data: {
        destination: 'Test',
        date: new Date().toISOString(),
        deviseVoyage: 'EUR',
        marchandises: [{ nom: 'Test', quantite: 1, prixAchatUnitaire: 100, prixVenteUnitaire: 150 }],
        calculs: { coutTotal: 100, venteTotal: 150, beneficeNet: 50 }
      },
      expectedStatus: [201, 401, 500]
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n🔍 Test: ${test.name}`);
      
      const config = {
        method: test.method,
        url: test.url,
        headers,
        timeout: 5000
      };

      if (test.data) {
        config.data = test.data;
      }

      const response = await axios(config);
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📊 Response:`, response.data);
      
      if (test.expectedStatus.includes(response.status)) {
        console.log(`✅ Test réussi`);
      } else {
        console.log(`⚠️  Status inattendu: ${response.status}`);
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ Status: ${error.response.status}`);
        console.log(`📊 Error:`, error.response.data);
        
        if (test.expectedStatus.includes(error.response.status)) {
          console.log(`✅ Test réussi (erreur attendue)`);
        } else {
          console.log(`❌ Erreur inattendue: ${error.response.status}`);
        }
      } else {
        console.log(`❌ Erreur réseau:`, error.message);
      }
    }
  }
};

const main = async () => {
  const baseUrl = process.argv[2] || 'http://localhost:5000';
  const token = process.argv[3] || null;
  
  console.log('='.repeat(50));
  console.log('🧪 TEST DES ROUTES API MICROIMPORT');
  console.log('='.repeat(50));
  
  await testAPI(baseUrl, token);
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 RÉSUMÉ DES TESTS');
  console.log('='.repeat(50));
  console.log('✅ = Test réussi');
  console.log('❌ = Test échoué');
  console.log('⚠️  = Résultat inattendu');
  console.log('\n💡 Pour tester avec un token:');
  console.log('   node test-api.js http://localhost:5000 your_jwt_token');
  console.log('💡 Pour tester en production:');
  console.log('   node test-api.js https://microimport-backend.onrender.com your_jwt_token');
};

main().catch(console.error);
