# MicroImport Pro - Application de Gestion d'Import

## Description

MicroImport Pro est une application web moderne développée avec React et TypeScript pour la gestion des voyages d'import en Algérie. L'application utilise le nouveau régime fiscal algérien 2025 pour la micro-importation.

## Fonctionnalités

### 🚀 Fonctionnalités Principales
- **Gestion des Voyages** : Création et suivi des voyages d'import
- **Calculs Automatiques** : Calculs précis des coûts, bénéfices et ROI
- **Support Multi-devises** : EUR, USD, TRY, AED, CNY avec conversion automatique
- **Régime Fiscal 2025** : Intégration du nouveau régime fiscal algérien
- **Interface Moderne** : Design responsive avec mode sombre/clair
- **Authentification** : Système de connexion sécurisé
- **Base de Données** : Stockage persistant avec MongoDB

### 📊 Calculs Fiscaux
- **Forfait Droits et Taxes** : 5% sur la valeur en douane
- **Contribution de Solidarité** : 3% sur la valeur en douane
- **Autres Frais** : 1.5% (frais bancaires/administratifs)
- **Plafond Voyage** : 1 800 000 DA maximum

## Technologies Utilisées

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **TailwindCSS** pour le styling
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes
- **Recharts** pour les graphiques

### Backend
- **Node.js** avec Express
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **Bcryptjs** pour le hachage des mots de passe
- **CORS** pour les requêtes cross-origin

## Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- MongoDB
- npm ou yarn

### Installation des dépendances

\\\ash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
\\\

### Configuration

1. Créez un fichier \.env\ dans le dossier \ackend\ :
\\\nv
PORT=5000
MONGODB_URI=mongodb://localhost:27017/microimport
JWT_SECRET=votre_secret_jwt
NODE_ENV=development
\\\

### Démarrage

\\\ash
# Démarrer le backend
cd backend
npm run dev

# Démarrer le frontend (dans un autre terminal)
cd frontend
npm run dev
\\\

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend : http://localhost:5000

## Structure du Projet

\\\
web-app/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Contrôleurs API
│   │   ├── models/         # Modèles MongoDB
│   │   ├── routes/         # Routes API
│   │   ├── middleware/     # Middleware
│   │   └── utils/          # Utilitaires
│   └── package.json
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   ├── contexts/      # Contextes React
│   │   ├── hooks/         # Hooks personnalisés
│   │   └── lib/           # Utilitaires
│   └── package.json
└── README.md
\\\

## Utilisation

### Création d'un Voyage
1. Connectez-vous à l'application
2. Allez dans la section "Voyages"
3. Cliquez sur "Nouveau Voyage"
4. Remplissez les informations du voyage
5. Ajoutez les marchandises
6. L'application calcule automatiquement les coûts et bénéfices

### Calculs Automatiques
L'application calcule automatiquement :
- Coût total d'achat (avec conversion de devise)
- Frais de douane (forfait 5% + contribution 3% + autres frais 1.5%)
- Frais fixes du voyage
- Bénéfice net
- Marge et ROI

## Régime Fiscal Algérien 2025

L'application intègre le nouveau régime fiscal pour la micro-importation :

- **Forfait unique** : 5% au dédouanement
- **Contribution de solidarité** : 3% sur la valeur en douane
- **Autres frais** : 1.5% (frais bancaires/administratifs)
- **Plafond** : 1 800 000 DA par voyage
- **Limite** : 2 voyages par mois maximum

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur GitHub.

## Auteur

Développé avec ❤️ pour simplifier la gestion des imports en Algérie.
