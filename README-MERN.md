# 🚀 MicroImport Pro - Application MERN Complète

Application moderne de gestion des micro-imports construite avec la stack MERN (MongoDB, Express.js, React, Node.js).

## 🏗️ Architecture

```
microimport-app/
├── 📁 backend/          # API Express.js + MongoDB
│   ├── 📁 config/       # Configuration DB
│   ├── 📁 controllers/  # Logique métier
│   ├── 📁 middleware/   # Auth, validation
│   ├── 📁 models/       # Modèles Mongoose
│   ├── 📁 routes/       # Routes API
│   └── server.js        # Serveur principal
├── 📁 src/              # Frontend React
│   ├── 📁 components/   # Composants UI
│   ├── 📁 pages/        # Pages principales
│   ├── 📁 layouts/      # Layouts
│   ├── 📁 hooks/        # Custom hooks
│   └── 📁 lib/          # Utilitaires
└── package.json         # Scripts de gestion
```

## ✨ Fonctionnalités

### 🎨 Frontend (React + Vite)
- ✅ **Design moderne** avec TailwindCSS
- ✅ **Mode sombre/clair** avec toggle
- ✅ **Animations fluides** avec Framer Motion
- ✅ **Responsive design** (mobile-first)
- ✅ **Navigation intuitive** avec sidebar/navbar
- ✅ **Graphiques interactifs** avec Recharts

### 🔧 Backend (Express.js + MongoDB)
- ✅ **API RESTful** complète
- ✅ **Authentification JWT** sécurisée
- ✅ **Validation des données** avec express-validator
- ✅ **Gestion d'erreurs** centralisée
- ✅ **Sécurité** (Helmet, CORS)
- ✅ **Logging** avec Morgan

### 🗄️ Base de Données (MongoDB)
- ✅ **Modèles optimisés** avec Mongoose
- ✅ **Relations** entre User, Voyage, Marchandise
- ✅ **Calculs automatiques** des coûts et bénéfices
- ✅ **Vérification des plafonds** légaux
- ✅ **Indexation** pour les performances

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v16+)
- MongoDB (local ou Atlas)
- npm ou yarn

### 1. Installation Complète
```bash
# Cloner le projet
git clone <repository-url>
cd microimport-app

# Installer toutes les dépendances
npm run install:all
```

### 2. Configuration MongoDB

#### Option A: MongoDB Atlas (Recommandé)
1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créer un cluster gratuit
3. Obtenir l'URI de connexion
4. Créer `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/microimport
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

#### Option B: MongoDB Local
```bash
# Installer MongoDB localement
# L'URI par défaut sera utilisée: mongodb://localhost:27017/microimport
```

### 3. Démarrage de l'Application

#### Démarrage Complet (Frontend + Backend)
```bash
npm run dev
```

#### Démarrage Séparé
```bash
# Backend seulement (port 5000)
npm run dev:backend

# Frontend seulement (port 5173)
npm run dev:frontend
```

## 📊 API Endpoints

### 🔐 Authentification
```
POST /api/auth/register     # Inscription
POST /api/auth/login        # Connexion
GET  /api/auth/me          # Profil utilisateur
PUT  /api/auth/profile     # Mise à jour profil
PUT  /api/auth/change-password # Changement mot de passe
```

### ✈️ Voyages
```
GET    /api/voyages              # Liste des voyages
GET    /api/voyages/:id          # Détails d'un voyage
POST   /api/voyages              # Créer un voyage
PUT    /api/voyages/:id          # Modifier un voyage
DELETE /api/voyages/:id          # Supprimer un voyage
GET    /api/voyages/stats/overview # Statistiques
```

### 🏥 Santé
```
GET /api/health  # Vérification de l'état de l'API
```

## 🎯 Fonctionnalités Métier

### 📈 Calculs Automatiques
- **Coût total** = Prix d'achat + Douane (5%) + Frais fixes + Frais suppl.
- **Bénéfice net** = Vente totale - Coût total
- **ROI** = (Bénéfice net / Coût total) × 100
- **Marge** = (Bénéfice net / Vente totale) × 100

### 💱 Gestion Multi-Devises
- EUR, USD, TRY, AED, CNY
- Conversion automatique en DA
- Taux de change configurables

### ⚖️ Vérifications Légales
- Plafond de 1.8M DA par voyage
- Maximum 2 voyages par mois
- Droits de douane à 5%

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool rapide
- **TypeScript** - Type safety
- **TailwindCSS** - Styling utility-first
- **Framer Motion** - Animations
- **Recharts** - Graphiques
- **Lucide React** - Icônes

### Backend
- **Express.js** - Framework web
- **MongoDB** - Base de données
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hashage des mots de passe
- **express-validator** - Validation
- **Helmet** - Sécurité
- **CORS** - Cross-origin requests

## 📱 Pages de l'Application

1. **🏠 Accueil** - Hero section et présentation
2. **📊 Dashboard** - Statistiques et graphiques
3. **✈️ Voyages** - Gestion des voyages d'import
4. **⚙️ Configuration** - Paramètres et taux de change
5. **📚 Guide** - Documentation du micro-importateur
6. **👤 Profil** - Informations utilisateur
7. **🎨 Paramètres** - Préférences d'apparence

## 🔒 Sécurité

- Authentification JWT sécurisée
- Validation des données côté serveur
- Protection CORS configurée
- Headers de sécurité avec Helmet
- Hashage des mots de passe avec bcrypt
- Gestion d'erreurs centralisée

## 🚀 Déploiement

### Frontend (Vercel/Netlify)
```bash
npm run build
# Déployer le dossier dist/
```

### Backend (Heroku/Railway)
```bash
# Configurer les variables d'environnement
# Déployer le dossier backend/
```

## 📝 Scripts Disponibles

```bash
npm run dev              # Démarrage complet (frontend + backend)
npm run dev:frontend     # Frontend seulement
npm run dev:backend      # Backend seulement
npm run build            # Build de production
npm run install:all      # Installation de toutes les dépendances
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**🎉 Application MERN complète et fonctionnelle pour la gestion des micro-imports !**

