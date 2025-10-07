# Guide de Responsivité - MicroImport Pro

Ce guide explique comment utiliser les composants responsives et les bonnes pratiques pour créer une expérience utilisateur optimale sur tous les appareils.

## 🎯 Objectifs

- **Mobile-First**: Conception optimisée pour les appareils mobiles
- **Responsive Design**: Adaptation automatique à toutes les tailles d'écran
- **Performance**: Optimisation des performances sur mobile
- **Accessibilité**: Meilleure accessibilité tactile et visuelle

## 📱 Breakpoints

```css
xs: 475px   /* Très petits mobiles */
sm: 640px   /* Mobiles */
md: 768px   /* Tablettes */
lg: 1024px  /* Petits écrans */
xl: 1280px  /* Écrans moyens */
2xl: 1536px /* Grands écrans */
```

## 🧩 Composants Responsives

### 1. Layout Components

#### MainLayout
```tsx
<MainLayout showSidebar={true}>
  <YourContent />
</MainLayout>
```
- Sidebar cachée sur mobile
- Navigation mobile intégrée
- Espacement adaptatif

#### MobileMenu
```tsx
<MobileMenu
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  currentPage={currentPage}
  onPageChange={handlePageChange}
/>
```
- Menu latéral animé
- Navigation tactile optimisée
- Informations utilisateur intégrées

### 2. UI Components

#### ResponsiveGrid
```tsx
<ResponsiveGrid 
  cols={{ default: 1, sm: 2, lg: 3 }}
  gap="md"
>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</ResponsiveGrid>
```

#### ResponsiveText
```tsx
<ResponsiveText 
  as="h1" 
  size="3xl" 
  weight="bold" 
  color="primary"
>
  Titre Responsive
</ResponsiveText>
```

#### Container
```tsx
<Container size="lg" padding="md">
  <YourContent />
</Container>
```

### 3. Table Components

#### ResponsiveTable
```tsx
<ResponsiveTable>
  <TableHeader>
    <TableRow>
      <TableHead>Nom</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</ResponsiveTable>
```

#### MobileCard (pour les tableaux sur mobile)
```tsx
<MobileCard
  data={rowData}
  columns={[
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' }
  ]}
/>
```

## 🎨 Classes CSS Utilitaires

### Classes Responsives
```css
.responsive-grid     /* Grille adaptative */
.responsive-container /* Conteneur adaptatif */
.responsive-text     /* Texte adaptatif */
.responsive-spacing  /* Espacement adaptatif */
.responsive-shadow   /* Ombre adaptative */
```

### Classes Mobile
```css
.mobile-card         /* Carte optimisée mobile */
.mobile-button       /* Bouton tactile */
.mobile-input        /* Input mobile */
.mobile-focus        /* Focus mobile */
.mobile-active       /* État actif mobile */
```

### Classes de Performance
```css
.touch-manipulation  /* Optimisation tactile */
.scrollbar-hide      /* Masquer scrollbar */
.will-change-transform /* Optimisation GPU */
.antialiased        /* Rendu police optimisé */
```

## 📐 Bonnes Pratiques

### 1. Mobile-First Design
```tsx
// ✅ Bon
<div className="p-3 sm:p-4 lg:p-6">

// ❌ Éviter
<div className="p-6 lg:p-3">
```

### 2. Tailles Tactiles
```tsx
// ✅ Boutons minimum 44px
<Button className="min-h-[44px] min-w-[44px]">

// ✅ Inputs minimum 44px
<Input className="min-h-[44px]">
```

### 3. Espacement Adaptatif
```tsx
// ✅ Espacement progressif
<div className="space-y-3 sm:space-y-4 lg:space-y-6">

// ✅ Padding adaptatif
<div className="p-3 sm:p-4 lg:p-6 xl:p-8">
```

### 4. Typographie Responsive
```tsx
// ✅ Tailles adaptatives
<h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl">

// ✅ Poids adaptatifs
<p className="text-sm sm:text-base font-normal sm:font-medium">
```

### 5. Grilles Adaptatives
```tsx
// ✅ Grille responsive
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">

// ✅ Auto-fit pour contenu variable
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
```

## 🚀 Optimisations Performance

### 1. Animations
```tsx
// ✅ Animations optimisées
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

### 2. Images Responsives
```tsx
// ✅ Images adaptatives
<img 
  src="image.jpg" 
  alt="Description"
  className="w-full h-auto object-cover"
  loading="lazy"
/>
```

### 3. Lazy Loading
```tsx
// ✅ Chargement différé
import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('./Component'))

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

## 🧪 Testing Responsive

### 1. Outils de Test
- **Chrome DevTools**: Device simulation
- **Responsive Design Mode**: Firefox
- **BrowserStack**: Tests multi-appareils

### 2. Breakpoints à Tester
- 320px (iPhone SE)
- 375px (iPhone 12)
- 414px (iPhone 12 Pro Max)
- 768px (iPad)
- 1024px (iPad Pro)
- 1280px (Desktop)

### 3. Tests Tactiles
- Boutons minimum 44px
- Espacement entre éléments cliquables
- Navigation au doigt
- Scroll fluide

## 📊 Métriques de Performance

### 1. Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### 2. Mobile Performance
- **Time to Interactive**: < 3s
- **First Contentful Paint**: < 1.8s
- **Speed Index**: < 3.4s

## 🔧 Configuration

### Tailwind Config
```js
module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
}
```

### CSS Global
```css
/* Optimisations mobile */
body {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

html {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
```

## 📚 Ressources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Web.dev Responsive Design](https://web.dev/responsive-web-design-basics/)

## 🎯 Checklist Responsive

- [ ] Design mobile-first
- [ ] Breakpoints définis
- [ ] Composants responsives utilisés
- [ ] Tailles tactiles respectées (44px min)
- [ ] Typographie adaptative
- [ ] Espacement progressif
- [ ] Images responsives
- [ ] Performance optimisée
- [ ] Tests multi-appareils
- [ ] Accessibilité tactile
