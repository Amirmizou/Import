# 🗄️ Configuration MongoDB pour MicroImport Pro

## Option 1: MongoDB Atlas (Recommandé - Gratuit)

### 1. Créer un compte MongoDB Atlas
1. Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Cliquez sur "Try Free"
3. Créez votre compte

### 2. Créer un cluster
1. Choisissez "Shared Clusters" (gratuit)
2. Sélectionnez un fournisseur (AWS, Google Cloud, Azure)
3. Choisissez une région proche de vous
4. Nommez votre cluster (ex: "microimport-cluster")
5. Cliquez sur "Create Cluster"

### 3. Configurer l'accès
1. **Créer un utilisateur de base de données:**
   - Username: `microimport-user`
   - Password: `votre_mot_de_passe_securise`
   - Rôles: "Atlas admin" ou "Read and write to any database"

2. **Autoriser l'accès IP:**
   - Cliquez sur "Add IP Address"
   - Pour le développement: "Add Current IP Address"
   - Pour la production: "Allow Access from Anywhere" (0.0.0.0/0)

### 4. Obtenir l'URI de connexion
1. Cliquez sur "Connect" sur votre cluster
2. Choisissez "Connect your application"
3. Sélectionnez "Node.js" et version "4.1 or later"
4. Copiez l'URI de connexion

### 5. Configurer le fichier .env
1. Copiez le contenu de `env.example` vers `.env`
2. Remplacez l'URI par votre URI Atlas:

```env
MONGODB_URI=mongodb+srv://microimport-user:votre_mot_de_passe@microimport-cluster.xxxxx.mongodb.net/microimport?retryWrites=true&w=majority
```

## Option 2: MongoDB Local

### 1. Installer MongoDB
- **Windows:** Téléchargez depuis [mongodb.com](https://www.mongodb.com/try/download/community)
- **macOS:** `brew install mongodb-community`
- **Linux:** Suivez la [documentation officielle](https://docs.mongodb.com/manual/installation/)

### 2. Démarrer MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# ou
mongod
```

### 3. Configurer le fichier .env
```env
MONGODB_URI=mongodb://localhost:27017/microimport
```

## 🔧 Configuration du fichier .env

Créez un fichier `.env` dans le dossier `backend/` avec ce contenu:

```env
# Configuration du Serveur
PORT=5000
NODE_ENV=development

# Base de Données (remplacez par votre URI)
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/microimport?retryWrites=true&w=majority

# Sécurité JWT (changez cette clé!)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_make_it_long_and_random

# CORS
CLIENT_URL=http://localhost:5173

# Configuration Application
PLAFOND_VOYAGE=1800000
TAUX_DOUANE=0.05
MAX_VOYAGES_MOIS=2

# Taux de Change par Défaut
DEFAULT_EUR_RATE=165
DEFAULT_USD_RATE=150
DEFAULT_TRY_RATE=4.5
DEFAULT_AED_RATE=41
DEFAULT_CNY_RATE=21
```

## ✅ Test de la Connexion

Après avoir configuré MongoDB et le fichier .env:

```bash
cd backend
npm run dev
```

Vous devriez voir:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Serveur démarré sur le port 5000
```

## 🚨 Dépannage

### Erreur de connexion
- Vérifiez que l'URI est correcte
- Vérifiez que l'utilisateur a les bons droits
- Vérifiez que l'IP est autorisée (Atlas)

### Erreur d'authentification
- Vérifiez le nom d'utilisateur et mot de passe
- Vérifiez que l'utilisateur a le rôle "Atlas admin"

### Erreur de réseau
- Vérifiez votre connexion internet
- Vérifiez que le port 27017 n'est pas bloqué (local)

## 📝 Notes Importantes

- **Sécurité:** Ne commitez jamais le fichier `.env` dans Git
- **Production:** Utilisez des clés JWT longues et aléatoires
- **Atlas:** Le cluster gratuit a des limites (512MB, 100 connexions)
- **Local:** MongoDB local est plus rapide pour le développement
