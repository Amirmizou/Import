# 🔔 Système de Notifications - MicroImport Pro

## 📋 Vue d'ensemble

Le système de notifications de MicroImport Pro offre une expérience utilisateur moderne avec des notifications animées, auto-dismissibles et entièrement personnalisables.

## 🚀 Utilisation

### Import du hook

```typescript
import { useNotifications } from '@/hooks/useNotifications'
```

### Utilisation dans un composant

```typescript
export function MonComposant() {
  const { notifySuccess, notifyError, notifyWarning, notifyInfo } = useNotifications()

  const handleAction = () => {
    // Exemple d'utilisation
    notifySuccess('Succès', 'L\'action a été effectuée avec succès')
  }

  return (
    <button onClick={handleAction}>
      Effectuer une action
    </button>
  )
}
```

## 🎨 Types de notifications

### 1. Notification de succès
```typescript
notifySuccess('Titre', 'Message optionnel')
```

### 2. Notification d'erreur
```typescript
notifyError('Erreur', 'Une erreur s\'est produite')
```

### 3. Notification d'avertissement
```typescript
notifyWarning('Attention', 'Ceci est un avertissement')
```

### 4. Notification d'information
```typescript
notifyInfo('Information', 'Ceci est une information')
```

## ⚙️ Configuration avancée

### Notification personnalisée
```typescript
const { addNotification } = useNotifications()

addNotification({
  type: 'success',
  title: 'Titre personnalisé',
  message: 'Message personnalisé',
  duration: 10000, // 10 secondes (par défaut: 5000ms)
})
```

### Gestion des notifications
```typescript
const { 
  notifications, 
  removeNotification, 
  clearAll 
} = useNotifications()

// Supprimer une notification spécifique
removeNotification('notification-id')

// Supprimer toutes les notifications
clearAll()
```

## 🎯 Exemples d'utilisation

### Dans un formulaire
```typescript
const handleSubmit = async (data) => {
  try {
    await saveData(data)
    notifySuccess('Sauvegardé', 'Les données ont été sauvegardées')
  } catch (error) {
    notifyError('Erreur', 'Impossible de sauvegarder les données')
  }
}
```

### Dans une action de suppression
```typescript
const handleDelete = async (id) => {
  try {
    await deleteItem(id)
    notifySuccess('Supprimé', 'L\'élément a été supprimé')
  } catch (error) {
    notifyError('Erreur', 'Impossible de supprimer l\'élément')
  }
}
```

### Notification avec validation
```typescript
const handleValidation = (value) => {
  if (value > 1800000) {
    notifyWarning('Attention', 'La valeur dépasse le plafond légal de 1.8M DA')
  }
}
```

## 🎨 Personnalisation

### Durée personnalisée
```typescript
// Notification qui reste 10 secondes
notifyInfo('Info', 'Message', 10000)

// Notification permanente (ne disparaît pas automatiquement)
notifyError('Erreur critique', 'Message', 0)
```

### Styles par défaut
- **Success** : Vert avec icône de validation
- **Error** : Rouge avec icône d'erreur
- **Warning** : Jaune avec icône d'avertissement
- **Info** : Bleu avec icône d'information

## 📱 Responsive

Le système de notifications s'adapte automatiquement à tous les écrans :
- **Desktop** : Position en haut à droite
- **Mobile** : Adaptation automatique de la taille et position

## 🔧 Intégration

Le système est déjà intégré dans l'application via :
- `App.tsx` : Container des notifications
- `Navbar.tsx` : Bouton de notification avec badge
- `useNotifications.ts` : Hook principal
- `Notification.tsx` : Composant de notification

## 🧪 Test

Pour tester le système, utilisez le bouton "Test Notifications" sur la page d'accueil qui affiche les 4 types de notifications avec un délai.

## 📝 Notes importantes

1. **Performance** : Les notifications sont automatiquement nettoyées de la mémoire
2. **Accessibilité** : Support des lecteurs d'écran
3. **Animations** : Utilise Framer Motion pour des transitions fluides
4. **Thème** : S'adapte automatiquement au mode sombre/clair
5. **Limite** : Maximum 5 notifications simultanées (gestion automatique)

## 🎉 Résultat

Un système de notifications moderne, performant et entièrement intégré qui améliore significativement l'expérience utilisateur de MicroImport Pro !

