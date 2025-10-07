// Script to manually set environment variables for debugging
console.log('🔧 ===== ENVIRONMENT SETUP DEBUG =====');

// Check if we're on Render
const isRender = process.env.RENDER === 'true' || process.env.RENDER_EXTERNAL_URL;
console.log('🌍 Running on Render:', isRender);
console.log('🌍 RENDER_EXTERNAL_URL:', process.env.RENDER_EXTERNAL_URL);

// Set MongoDB URI if not already set
if (!process.env.MONGODB_URI) {
  console.log('⚠️  MONGODB_URI not found, setting manually...');
  process.env.MONGODB_URI = 'mongodb+srv://admin:mizou450@cluster0.xb4dzcy.mongodb.net/Import?retryWrites=true&w=majority&appName=Cluster0';
  console.log('✅ MONGODB_URI set manually');
} else {
  console.log('✅ MONGODB_URI already exists');
}

// Set other required environment variables
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
  console.log('✅ NODE_ENV set to production');
}

if (!process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN = 'https://importf.onrender.com';
  console.log('✅ CORS_ORIGIN set');
}

if (!process.env.CLIENT_URL) {
  process.env.CLIENT_URL = 'https://importf.onrender.com';
  console.log('✅ CLIENT_URL set');
}

console.log('🔍 Final Environment Variables:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('  - MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
console.log('  - CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('  - CLIENT_URL:', process.env.CLIENT_URL);

console.log('🔧 ===== END ENVIRONMENT SETUP DEBUG =====');
