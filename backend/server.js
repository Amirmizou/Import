const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/validation');

// Import routes
const authRoutes = require('./routes/auth');
const voyageRoutes = require('./routes/voyages');
const configurationRoutes = require('./routes/configurations');

// Connect to database
connectDB().catch(err => {
  console.error('❌ Database connection failed:', err.message);
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
  
  return origins;
};

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    
    // Permettre les requêtes sans origin (ex: Postman, mobile apps, preflight)
    if (!origin) return callback(null, true);
    
    // Vérifier si l'origin est dans la liste autorisée
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MicroImport API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: {
      origin: req.headers.origin,
      allowedOrigins: getAllowedOrigins()
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
