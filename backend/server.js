const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Setup environment variables for Render deployment
require('./setup-env');

const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/validation');

// Import routes
const authRoutes = require('./routes/auth');
const voyageRoutes = require('./routes/voyages');
const configurationRoutes = require('./routes/configurations');

// Connect to database
console.log('🚀 ===== SERVER STARTUP DEBUG =====');
console.log('📅 Server startup timestamp:', new Date().toISOString());
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔧 Node Version:', process.version);
console.log('📦 Express Version:', require('express/package.json').version);

console.log('🔍 Environment Variables Check:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - PORT:', process.env.PORT);
console.log('  - MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('  - JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('  - CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('  - CLIENT_URL:', process.env.CLIENT_URL);

console.log('🔄 Attempting database connection...');
connectDB().catch(err => {
  console.error('❌ Database connection failed in server startup:', err.message);
  console.error('❌ Error details:', err);
  console.log('💡 Server will continue without database connection');
});

const app = express();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration dynamique
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:5173',  // Développement local
    'http://localhost:3000',  // Alternative locale
    'https://importf.onrender.com',  // Frontend déployé
    'https://importb.onrender.com',  // Backend déployé (pour les tests)
  ];
  
  // Ajouter les origines depuis les variables d'environnement
  if (process.env.CORS_ORIGIN) {
    origins.push(process.env.CORS_ORIGIN);
  }
  if (process.env.CLIENT_URL) {
    // Nettoyer l'URL pour éviter les problèmes de trailing slash
    const cleanUrl = process.env.CLIENT_URL.replace(/\/$/, '');
    origins.push(cleanUrl);
  }
  
  console.log('🌐 CORS Allowed Origins:', origins);
  return origins;
};

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    
    // Permettre les requêtes sans origin (ex: Postman, mobile apps, preflight)
    if (!origin) {
      console.log('✅ CORS allowing request without origin');
      return callback(null, true);
    }
    
    // Vérifier si l'origin est dans la liste autorisée
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      
      // En mode développement ou si l'origin contient 'render.com', permettre
      if (process.env.NODE_ENV !== 'production' || origin.includes('render.com')) {
        console.log('⚠️  CORS allowing origin in dev mode or render.com:', origin);
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));

// Additional CORS handling for preflight requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  
  if (req.method === 'OPTIONS') {
    console.log('🔄 Preflight request from:', origin);
    console.log('📋 Allowed origins:', allowedOrigins);
    
    if (!origin || allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400');
      return res.status(200).end();
    } else {
      console.log('🚫 Preflight blocked for origin:', origin);
      return res.status(403).json({ error: 'CORS preflight blocked' });
    }
  }
  
  next();
});

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MicroImport API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = {
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'N/A',
    name: mongoose.connection.name || 'N/A',
    collections: 'N/A'
  };
  
  // Try to get collections count
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.db.listCollections().toArray()
      .then(collections => {
        dbStatus.collections = collections.length;
      })
      .catch(err => {
        dbStatus.collections = 'Error: ' + err.message;
      });
  }
  
  res.json({
    success: true,
    message: 'MicroImport API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    cors: {
      origin: req.headers.origin,
      allowedOrigins: getAllowedOrigins()
    },
    environment_vars: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGODB_URI_exists: !!process.env.MONGODB_URI,
      JWT_SECRET_exists: !!process.env.JWT_SECRET,
      CORS_ORIGIN: process.env.CORS_ORIGIN,
      CLIENT_URL: process.env.CLIENT_URL
    }
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/voyages', voyageRoutes);
app.use('/api/configurations', configurationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:', missingEnvVars.join(', '));
  console.error('💡 Configurez ces variables sur Render.com dans les paramètres d\'environnement');
  
  // En production, utiliser des valeurs par défaut pour éviter le crash
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Mode production: Utilisation de valeurs par défaut');
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_change_in_production';
  } else {
    console.log('🔧 Mode développement: Utilisation de valeurs par défaut');
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
  }
}

const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`🔑 JWT Secret configuré: ${process.env.JWT_SECRET ? 'Oui' : 'Non'}`);
  console.log(`🗄️  MongoDB URI configuré: ${process.env.MONGODB_URI ? 'Oui' : 'Non'}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'Non défini'}`);
  console.log(`📋 Allowed Origins:`, getAllowedOrigins());
  console.log(`✅ Serveur prêt à recevoir des requêtes!`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Erreur non gérée:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Exception non gérée:', err.message);
  process.exit(1);
});

module.exports = app;
