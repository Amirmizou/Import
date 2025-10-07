# Calculs Fiscaux - Régime Micro-Import Algérie 2025

## Vue d'ensemble

L'application utilise le nouveau régime fiscal algérien pour la micro-importation, qui simplifie les calculs et encourage l'intégration des petits importateurs dans l'économie formelle.

## Régime Fiscal Global

### Auto-entrepreneurs
- **Impôt forfaitaire** : 0,5% sur le chiffre d'affaires annuel (pas sur chaque importation)
- **Simplification** : Évite les calculs complexes de TVA et droits de douane séparés

### Micro-importation spécifique
- **Forfait unique** : 5% au dédouanement couvre l'ensemble des "droits et taxes"
- **Avantages** :
  - Dispense d'inscription au registre du commerce
  - Exemption des autorisations d'importation préalables
  - Comptabilité simplifiée (registre paraphé par les impôts)

## Formule de Calcul du Coût Total

### Nouvelle Formule Révisée

```
Valeur en Douane (VD) = Prix d'Achat + Frais de Transport
Forfait Droits et Taxes = VD × 5%
Contribution de Solidarité = VD × 3%
Autres Frais = VD × 1,5% (frais bancaires/administratifs)
Coût Total par Unité = VD + Forfait + Contribution + Autres Frais
```

### Constantes Utilisées

```typescript
export const TAUX_DOUANE = 0.05; // 5% - Forfait droits et taxes
export const CONTRIBUTION_SOLIDARITE = 0.03; // 3% - Contribution de solidarité
export const AUTRES_FRAIS_POURCENTAGE = 0.015; // 1.5% - Frais bancaires/administratifs
```

## Exemple de Calcul

### Données d'entrée
- **Produit** : 100 smartphones
- **Prix d'achat total** : 1 000 000 DA
- **Frais de transport** : 100 000 DA
- **Prix unitaire** : 10 000 DA

### Calcul par unité
1. **Valeur en Douane (VD)** : 10 000 DA
2. **Forfait Droits et Taxes (5%)** : 10 000 × 0.05 = 500 DA
3. **Contribution de Solidarité (3%)** : 10 000 × 0.03 = 300 DA
4. **Autres Frais (1.5%)** : 10 000 × 0.015 = 150 DA
5. **Coût Total par Unité** : 10 000 + 500 + 300 + 150 = **10 950 DA**

### Comparaison avec l'ancien système
- **Ancien coût** (avec TVA 19%) : 14 184,50 DA
- **Nouveau coût** (forfait 5%) : 10 950 DA
- **Économie** : 3 234,50 DA par unité (22,8% de réduction)

## Implémentation dans le Code

### Fonction `suggererPrixVente`
```typescript
const valeurDouane = prixAchatDA;
const forfaitDroitsTaxes = valeurDouane * TAUX_DOUANE;
const contributionSolidarite = valeurDouane * CONTRIBUTION_SOLIDARITE;
const autresFrais = valeurDouane * AUTRES_FRAIS_POURCENTAGE;
const coutTotalUnitaire = valeurDouane + forfaitDroitsTaxes + contributionSolidarite + autresFrais;
```

### Fonction `calculerVoyage`
```typescript
// Pour chaque marchandise
const valeurDouaneUnitaire = coutAchatDA;
const forfaitDroitsTaxesUnitaire = valeurDouaneUnitaire * TAUX_DOUANE;
const contributionSolidariteUnitaire = valeurDouaneUnitaire * CONTRIBUTION_SOLIDARITE;
const autresFraisUnitaire = valeurDouaneUnitaire * AUTRES_FRAIS_POURCENTAGE;
const coutTotalUnitaire = valeurDouaneUnitaire + forfaitDroitsTaxesUnitaire + contributionSolidariteUnitaire + autresFraisUnitaire;
```

## Avantages du Nouveau Système

1. **Simplicité** : Un seul forfait de 5% au lieu de calculs complexes
2. **Transparence** : Coûts prévisibles et faciles à calculer
3. **Compétitivité** : Réduction significative des coûts d'importation
4. **Formalisation** : Encouragement à l'intégration dans l'économie formelle
5. **Administration** : Simplification des procédures douanières

## Notes Importantes

- Le forfait de 5% remplace les droits de douane séparés et la TVA
- La contribution de solidarité (3%) reste applicable selon la Loi de Finances 2025
- Les frais de transport sont inclus dans la valeur en douane
- Les frais fixes du voyage (transport, hébergement, etc.) sont calculés séparément
- Le plafond de voyage reste à 1 800 000 DA

## Validation des Calculs

L'application valide automatiquement :
- Les montants positifs
- La conversion de devise correcte
- Les limites de voyage (plafond)
- La cohérence des calculs entre les différentes composantes

