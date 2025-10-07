# Configuration des Environnements - MicroImport Pro

Ce guide explique comment configurer l'application pour qu'elle fonctionne à la fois en local et sur Render.

## 🏠 Développement Local

### Variables d'environnement Backend
Créez un fichier `.env` dans le dossier `backend/` :

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/microimport
JWT_SECRET=dev_secret_key_change_in_production
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

### Variables d'environnement Frontend
Créez un fichier `.env.local` dans le dossier `frontend/` :

```env
VITE_API_URL=http://localhost:5000
VITE_APP_ENV=development
```

### Démarrage rapide
Utilisez le script `start-dev.bat` qui configure automatiquement tout :

```bash
# Windows
start-dev.bat

# Ou manuellement
cd backend && npm run dev
cd frontend && npm run dev
```

## ☁️ Production sur Render

### Backend sur Render
Variables d'environnement à configurer dans Render Dashboard :

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/microimport
JWT_SECRET=your_super_secure_jwt_secret_here
CORS_ORIGIN=https://importf.onrender.com
CLIENT_URL=https://importf.onrender.com
```

### Frontend sur Render
Variables d'environnement à configurer dans Render Dashboard :

```env
VITE_API_URL=https://microimport-backend.onrender.com
VITE_APP_ENV=production
```

## 🔧 Configuration Automatique

L'application détecte automatiquement l'environnement :

### Frontend (api.ts)
```typescript
const getApiBaseUrl = () => {
  // Production sur Render
  if (import.meta.env.PROD) {
    return 'https://microimport-backend.onrender.com/api'
  }
  
  // Variable d'environnement personnalisée
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`
  }
  
  // Développement local par défaut
  return 'http://localhost:5000/api'
}
```

### Backend (server.js)
```javascript
const getAllowedOrigins = () => {
  return [
    'http://localhost:5173',           // Local
    'https://importf.onrender.com',    // Production
    process.env.CORS_ORIGIN,           // Variable d'env
    process.env.CLIENT_URL             // Variable d'env
  ].filter(Boolean);
};
```

## 📋 URLs par Environnement

### Développement Local
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **API**: http://localhost:5000/api

### Production Render
- **Backend**: https://microimport-backend.onrender.com
- **Frontend**: https://importf.onrender.com
- **API**: https://microimport-backend.onrender.com/api

## 🚀 Déploiement

### 1. Backend sur Render
1. Créez un nouveau "Web Service"
2. Connectez le repository GitHub
3. Configuration :
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Ajoutez les variables d'environnement de production

### 2. Frontend sur Render
1. Créez un nouveau "Static Site"
2. Connectez le même repository
3. Configuration :
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Ajoutez la variable `VITE_API_URL`

## 🔍 Debug et Logs

### Logs de développement
Le frontend affiche la configuration API dans la console :
```
🔧 Configuration API: {
  environment: "development",
  apiUrl: "http://localhost:5000/api",
  viteApiUrl: "http://localhost:5000"
}
```

### Logs de production
Le backend log les origines CORS bloquées :
```
🚫 CORS blocked origin: https://unauthorized-domain.com
```

## ⚠️ Problèmes Courants

### CORS Error
- Vérifiez que `CORS_ORIGIN` pointe vers l'URL exacte du frontend
- Redéployez le backend après modification

### API Connection Failed
- Vérifiez que `VITE_API_URL` est correcte
- Vérifiez que le backend est démarré

### Environment Variables Not Working
- Redémarrez le serveur de développement
- Vérifiez le nom des variables (VITE_ prefix pour le frontend)

## 📁 Structure des Fichiers

```
web-app/
├── backend/
│   ├── .env                    # Variables locales backend
│   └── server.js              # Configuration CORS dynamique
├── frontend/
│   ├── .env.local             # Variables locales frontend
│   └── src/services/api.ts    # Configuration API automatique
├── start-dev.bat              # Script de démarrage local
└── ENVIRONMENT-SETUP.md       # Ce guide
```

## 🎯 Avantages de cette Configuration

1. **Automatique** : Détection de l'environnement sans configuration manuelle
2. **Flexible** : Variables d'environnement pour personnaliser
3. **Sécurisé** : CORS configuré pour les bonnes origines
4. **Debug** : Logs pour identifier les problèmes
5. **Compatible** : Fonctionne en local ET sur Render

