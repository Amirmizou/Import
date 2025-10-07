# Configuration MongoDB Atlas pour Render

## 🚨 Problème Actuel
Le backend sur Render essaie de se connecter à MongoDB local (`localhost:27017`) au lieu d'utiliser MongoDB Atlas.

## ✅ Solution : Configurer MongoDB Atlas

### Étape 1: Créer un cluster MongoDB Atlas

1. **Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Créez un compte gratuit** (si pas déjà fait)
3. **Créez un nouveau projet** : "MicroImport Pro"
4. **Créez un cluster** :
   - Choisissez **"M0 Sandbox"** (gratuit)
   - Région : Choisissez la plus proche (Europe)
   - Nom du cluster : `microimport-cluster`

### Étape 2: Configurer l'accès réseau

1. **Dans "Network Access"** :
   - Cliquez sur **"Add IP Address"**
   - Cliquez sur **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Cliquez sur **"Confirm"**

### Étape 3: Créer un utilisateur de base de données

1. **Dans "Database Access"** :
   - Cliquez sur **"Add New Database User"**
   - **Authentication Method** : Password
   - **Username** : `microimport-user`
   - **Password** : Générez un mot de passe sécurisé (ex: `MicroImport2025!`)
   - **Database User Privileges** : "Read and write to any database"
   - Cliquez sur **"Add User"**

### Étape 4: Obtenir la chaîne de connexion

1. **Dans "Database"** :
   - Cliquez sur **"Connect"** sur votre cluster
   - Choisissez **"Connect your application"**
   - **Driver** : Node.js
   - **Version** : 4.1 or later
   - **Copiez la chaîne de connexion**

Exemple de chaîne de connexion :
```
mongodb+srv://microimport-user:MicroImport2025!@microimport-cluster.xxxxx.mongodb.net/microimport?retryWrites=true&w=majority
```

### Étape 5: Configurer sur Render

1. **Allez sur [Render Dashboard](https://dashboard.render.com)**
2. **Sélectionnez votre service backend** (`microimport-backend`)
3. **Allez dans "Environment"**
4. **Ajoutez/modifiez la variable** :
   - **Key** : `MONGODB_URI`
   - **Value** : Votre chaîne de connexion MongoDB Atlas

### Étape 6: Redéployer

1. **Cliquez sur "Manual Deploy"** → **"Deploy latest commit"**
2. **Attendez que le déploiement se termine**
3. **Vérifiez les logs** pour confirmer la connexion

## 🔍 Vérification

### Logs de succès
Vous devriez voir :
```
✅ MongoDB Connected: microimport-cluster-shard-00-00.xxxxx.mongodb.net
```

### Logs d'erreur
Si vous voyez encore :
```
❌ Database connection error: connect ECONNREFUSED
```
→ Vérifiez que `MONGODB_URI` est correctement configurée sur Render

## 📋 Variables d'environnement complètes sur Render

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://microimport-user:MicroImport2025!@microimport-cluster.xxxxx.mongodb.net/microimport?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_here
CORS_ORIGIN=https://importf.onrender.com
CLIENT_URL=https://importf.onrender.com
```

## 🆘 Dépannage

### Problème : "Authentication failed"
- Vérifiez le nom d'utilisateur et mot de passe
- Assurez-vous que l'utilisateur a les bonnes permissions

### Problème : "Network access denied"
- Vérifiez que l'IP `0.0.0.0/0` est autorisée
- Attendez 2-3 minutes après modification

### Problème : "Invalid connection string"
- Vérifiez que la chaîne de connexion est complète
- Remplacez `<password>` par le vrai mot de passe

## 💰 Coûts

- **MongoDB Atlas M0** : Gratuit
- **Stockage** : 512MB (suffisant pour commencer)
- **Connexions** : 100 connexions simultanées

## 🎯 Après configuration

Une fois MongoDB Atlas configuré :
1. ✅ Le backend se connectera automatiquement
2. ✅ Les données seront persistantes
3. ✅ L'application fonctionnera complètement
4. ✅ Vous pourrez créer des comptes utilisateurs
5. ✅ Les voyages seront sauvegardés

## 📞 Support

Si vous avez des problèmes :
1. Vérifiez les logs Render
2. Vérifiez la configuration MongoDB Atlas
3. Testez la connexion avec un client MongoDB
4. Consultez la documentation MongoDB Atlas
