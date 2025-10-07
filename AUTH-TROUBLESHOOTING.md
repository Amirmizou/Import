# Guide de Dépannage - Authentification

## 🚨 Problème : Erreurs 401 Unauthorized

Si vous voyez ces erreurs :
```
localhost:5000/api/auth/me:1 Failed to load resource: the server responded with a status of 401 (Unauthorized)
localhost:5000/api/voyages:1 Failed to load resource: the server responded with a status of 401 (Unauthorized)
```

## 🔍 Diagnostic

### 1. Vérifier la connexion au backend
```bash
# Testez si le backend répond
curl http://localhost:5000/api/auth/me
# ou
curl https://microimport-backend.onrender.com/api/auth/me
```

### 2. Vérifier les cookies
Ouvrez les DevTools (F12) → Application → Cookies
- Vérifiez qu'il y a un cookie `token`
- Vérifiez que le cookie n'est pas expiré

### 3. Vérifier la console
Ouvrez les DevTools (F12) → Console
- Cherchez les messages d'erreur
- Vérifiez les logs de l'application

## ✅ Solutions

### Solution 1: Se connecter à nouveau
1. Allez sur la page de connexion
2. Connectez-vous avec vos identifiants
3. Vérifiez que vous êtes redirigé vers l'application

### Solution 2: Vérifier la configuration
1. **En local** : Vérifiez que le backend tourne sur le port 5000
2. **En production** : Vérifiez que l'URL du backend est correcte

### Solution 3: Nettoyer les cookies
1. Ouvrez les DevTools (F12)
2. Allez dans Application → Storage → Clear storage
3. Cliquez sur "Clear site data"
4. Rechargez la page et reconnectez-vous

### Solution 4: Vérifier les variables d'environnement
1. **En local** : Créez un fichier `.env.local` dans `frontend/`
```env
VITE_API_URL=http://localhost:5000
```

2. **En production** : Vérifiez les variables sur Render
```env
VITE_API_URL=https://microimport-backend.onrender.com
```

## 🔧 Test de l'authentification

### Test manuel avec curl
```bash
# 1. Se connecter
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -c cookies.txt

# 2. Tester l'authentification
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### Test avec le script
```bash
cd backend
node test-api.js http://localhost:5000
```

## 🐛 Problèmes courants

### Problème : "Token manquant"
**Cause** : L'utilisateur n'est pas connecté
**Solution** : Se connecter via l'interface

### Problème : "Token invalide"
**Cause** : Le token a expiré ou est corrompu
**Solution** : Se déconnecter et se reconnecter

### Problème : "CORS error"
**Cause** : Configuration CORS incorrecte
**Solution** : Vérifier la configuration CORS du backend

### Problème : "Network error"
**Cause** : Le backend n'est pas accessible
**Solution** : Vérifier que le backend est démarré

## 📋 Checklist de vérification

- [ ] Backend démarré et accessible
- [ ] URL de l'API correcte
- [ ] Cookies présents et valides
- [ ] Utilisateur connecté
- [ ] Configuration CORS correcte
- [ ] Variables d'environnement définies

## 🆘 Si rien ne fonctionne

1. **Redémarrez le backend** :
```bash
cd backend
npm run dev
```

2. **Redémarrez le frontend** :
```bash
cd frontend
npm run dev
```

3. **Vérifiez les logs** :
- Backend : Console du terminal
- Frontend : DevTools → Console
- Render : Dashboard → Logs

4. **Testez avec un nouvel utilisateur** :
- Créez un nouveau compte
- Testez la connexion

## 📞 Support

Si le problème persiste :
1. Vérifiez les logs détaillés
2. Testez avec le script `test-api.js`
3. Vérifiez la configuration MongoDB
4. Consultez la documentation Render

