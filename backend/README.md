# MicroImport Backend API

Backend API pour l'application MicroImport Pro - Stack MERN

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v16 ou plus récent)
- MongoDB (local ou Atlas)

### Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer MongoDB**

#### Option 1: MongoDB Local
```bash
# Installer MongoDB localement
# Puis démarrer le service MongoDB
# L'URI par défaut sera: mongodb://localhost:27017/microimport
```

#### Option 2: MongoDB Atlas (Recommandé)
1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créer un cluster gratuit
3. Obtenir l'URI de connexion
4. Créer un fichier `.env` avec:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/microimport
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

3. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 📊 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/profile` - Mettre à jour le profil
- `PUT /api/auth/change-password` - Changer le mot de passe

### Voyages
- `GET /api/voyages` - Liste des voyages
- `GET /api/voyages/:id` - Détails d'un voyage
- `POST /api/voyages` - Créer un voyage
- `PUT /api/voyages/:id` - Modifier un voyage
- `DELETE /api/voyages/:id` - Supprimer un voyage
- `GET /api/voyages/stats/overview` - Statistiques

### Santé
- `GET /api/health` - Vérification de l'état de l'API

## 🗄️ Modèles de Données

### User
- Informations utilisateur
- Authentification
- Préférences

### Voyage
- Informations du voyage
- Marchandises associées
- Calculs automatiques
- Vérification des plafonds

### Marchandise
- Détails des produits
- Prix et quantités
- Calculs de bénéfices

## 🔧 Configuration

### Variables d'Environnement
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/microimport
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Fonctionnalités
- ✅ Authentification JWT
- ✅ Validation des données
- ✅ Gestion d'erreurs
- ✅ Sécurité (Helmet, CORS)
- ✅ Logging
- ✅ Calculs automatiques
- ✅ Vérification des plafonds légaux

## 🧪 Test de l'API

```bash
# Vérifier que l'API fonctionne
curl http://localhost:5000/api/health

# Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📝 Notes

- L'API est configurée pour fonctionner avec le frontend React sur le port 5173
- Tous les calculs de coûts et bénéfices sont automatiques
- Les plafonds légaux sont vérifiés automatiquement
- L'authentification est requise pour toutes les routes de voyages
