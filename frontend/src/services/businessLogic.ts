// Logique métier pour le micro-import
export const PLAFOND_VOYAGE = 1800000; // DA
export const TAUX_DOUANE = 0.05; // 5% - Forfait droits et taxes (remplace droits + TVA)
export const CONTRIBUTION_SOLIDARITE = 0.03; // 3% - Contribution de solidarité sur VD
export const AUTRES_FRAIS_POURCENTAGE = 0.015; // 1.5% - Frais bancaires/administratifs
export const MAX_VOYAGES_MOIS = 2;

export interface FraisFixes {
  transportAller: number;
  transportRetour: number;
  hebergement: number;
  repas: number;
  visa: number;
  assurance: number;
  taxiTransport: number;
  autres: number;
}

export interface TauxChange {
  EUR: number;
  USD: number;
  TRY: number;
  AED: number;
  CNY: number;
}

export interface MargesSuggerees {
  min: number;
  recommandee: number;
  optimale: number;
}

export interface Marchandise {
  id: number;
  nom: string;
  quantite: number;
  prixAchatUnitaire: number;
  prixVenteUnitaire: number;
  poids?: number;
  volume?: number;
}

export interface VoyageData {
  date: string;
  destination: string;
  deviseVoyage: string;
  marchandises: Marchandise[];
  fraisSupplementaires: number;
  fraisFixes: FraisFixes;
}

export interface CalculsVoyage {
  coutTotalAchat: number;
  valeurDouane: number;
  forfaitDroitsTaxes: number; // 5% sur VD
  contributionSolidarite: number; // 3% sur VD
  autresFrais: number; // 1.5% sur VD
  fraisDouaneTotal: number; // Total des frais de douane (forfait + contribution + autres)
  fraisFixesTotal: number;
  fraisSupp: number;
  coutTotal: number;
  venteTotal: number;
  beneficeNet: number;
  margeBrute: number;
  margePercent: number;
  roiPercent: number;
  detailsMarchandises: Array<{
    nom: string;
    quantite: number;
    coutAchatDA: number;
    valeurDouaneUnitaire: number;
    forfaitDroitsTaxesUnitaire: number;
    contributionSolidariteUnitaire: number;
    autresFraisUnitaire: number;
    coutTotalUnitaire: number;
    vente: number;
  }>;
}

export interface SuggestionsPrix {
  min: number;
  recommande: number;
  optimal: number;
  coutTotalUnitaire: number;
}

// Fonctions utilitaires
export const calculerFraisFixesTotal = (fraisFixes: FraisFixes): number => {
  return Object.values(fraisFixes).reduce((sum, val) => sum + Number(val), 0);
};

export const convertirEnDA = (montant: number, devise: string, tauxChange: TauxChange): number => {
  // Validation des entrées
  if (!montant || montant <= 0) return 0;
  if (!devise) return Number(montant);
  
  // Si déjà en DA, retourner tel quel
  if (devise === 'DA') return Number(montant);
  
  // Trouver le taux de change
  const taux = tauxChange[devise as keyof TauxChange];
  if (!taux || taux <= 0) {
    console.warn(`Taux de change non trouvé pour ${devise}, utilisation du taux par défaut (150)`);
    return Number(montant) * 150;
  }
  
  return Number(montant) * taux;
};

export const suggererPrixVente = (
  prixAchat: number,
  devise: string,
  quantite: number,
  fraisFixes: FraisFixes,
  tauxChange: TauxChange,
  margesSuggerees: MargesSuggerees
): SuggestionsPrix => {
  // Validation des entrées
  if (!prixAchat || prixAchat <= 0) {
    return {
      min: 0,
      recommande: 0,
      optimal: 0,
      coutTotalUnitaire: 0
    };
  }

  const prixAchatDA = convertirEnDA(prixAchat, devise, tauxChange);
  
  // NOUVEAU CALCUL SELON LE RÉGIME FISCAL ALGÉRIEN 2025
  // Valeur en Douane (VD) = Prix d'Achat (pas de frais de transport dans le calcul unitaire)
  const valeurDouane = prixAchatDA;
  
  // Forfait Droits et Taxes (5% sur VD)
  const forfaitDroitsTaxes = valeurDouane * TAUX_DOUANE;
  
  // Contribution de Solidarité (3% sur VD)
  const contributionSolidarite = valeurDouane * CONTRIBUTION_SOLIDARITE;
  
  // Autres Frais (1.5% sur VD - frais bancaires/administratifs)
  const autresFrais = valeurDouane * AUTRES_FRAIS_POURCENTAGE;
  
  // Coût total unitaire = VD + Forfait + Contribution + Autres frais
  const coutTotalUnitaire = valeurDouane + forfaitDroitsTaxes + contributionSolidarite + autresFrais;
  
  return {
    min: Math.ceil(coutTotalUnitaire * (1 + margesSuggerees.min / 100)),
    recommande: Math.ceil(coutTotalUnitaire * (1 + margesSuggerees.recommandee / 100)),
    optimal: Math.ceil(coutTotalUnitaire * (1 + margesSuggerees.optimale / 100)),
    coutTotalUnitaire: Math.ceil(coutTotalUnitaire)
  };
};

export const calculerVoyage = (
  voyage: VoyageData,
  tauxChange: TauxChange
): CalculsVoyage => {
  // Validation des entrées
  if (!voyage || !voyage.marchandises || voyage.marchandises.length === 0) {
    return {
      coutTotalAchat: 0,
      valeurDouane: 0,
      forfaitDroitsTaxes: 0,
      contributionSolidarite: 0,
      autresFrais: 0,
      fraisDouaneTotal: 0,
      fraisFixesTotal: 0,
      fraisSupp: 0,
      coutTotal: 0,
      venteTotal: 0,
      beneficeNet: 0,
      margeBrute: 0,
      margePercent: 0,
      roiPercent: 0,
      detailsMarchandises: []
    };
  }

  let coutTotalAchat = 0;
  let venteTotal = 0;
  let valeurDouane = 0;
  let forfaitDroitsTaxes = 0;
  let contributionSolidarite = 0;
  let autresFrais = 0;
  let detailsMarchandises: CalculsVoyage['detailsMarchandises'] = [];

  voyage.marchandises.forEach(m => {
    // Validation de chaque marchandise
    if (!m.prixAchatUnitaire || !m.quantite || !m.prixVenteUnitaire) {
      console.warn(`Marchandise invalide ignorée: ${m.nom}`);
      return;
    }

    const coutAchat = m.prixAchatUnitaire * m.quantite;
    const coutAchatDA = convertirEnDA(coutAchat, voyage.deviseVoyage, tauxChange);
    const venteUnitaire = m.prixVenteUnitaire * m.quantite;
    
    // NOUVEAU CALCUL SELON LE RÉGIME FISCAL ALGÉRIEN 2025
    // Valeur en Douane (VD) = Prix d'Achat
    const valeurDouaneUnitaire = coutAchatDA;
    
    // Forfait Droits et Taxes (5% sur VD)
    const forfaitDroitsTaxesUnitaire = valeurDouaneUnitaire * TAUX_DOUANE;
    
    // Contribution de Solidarité (3% sur VD)
    const contributionSolidariteUnitaire = valeurDouaneUnitaire * CONTRIBUTION_SOLIDARITE;
    
    // Autres Frais (1.5% sur VD - frais bancaires/administratifs)
    const autresFraisUnitaire = valeurDouaneUnitaire * AUTRES_FRAIS_POURCENTAGE;
    
    // Coût total unitaire = VD + Forfait + Contribution + Autres frais
    const coutTotalUnitaire = valeurDouaneUnitaire + forfaitDroitsTaxesUnitaire + contributionSolidariteUnitaire + autresFraisUnitaire;
    
    coutTotalAchat += coutAchatDA;
    valeurDouane += valeurDouaneUnitaire;
    forfaitDroitsTaxes += forfaitDroitsTaxesUnitaire;
    contributionSolidarite += contributionSolidariteUnitaire;
    autresFrais += autresFraisUnitaire;
    venteTotal += venteUnitaire;
    
    detailsMarchandises.push({
      nom: m.nom,
      quantite: m.quantite,
      coutAchatDA: coutAchatDA,
      valeurDouaneUnitaire: valeurDouaneUnitaire,
      forfaitDroitsTaxesUnitaire: forfaitDroitsTaxesUnitaire,
      contributionSolidariteUnitaire: contributionSolidariteUnitaire,
      autresFraisUnitaire: autresFraisUnitaire,
      coutTotalUnitaire: coutTotalUnitaire,
      vente: venteUnitaire
    });
  });

  const fraisDouaneTotal = forfaitDroitsTaxes + contributionSolidarite + autresFrais;
  const fraisFixesTotal = calculerFraisFixesTotal(voyage.fraisFixes || {});
  const fraisSupp = Number(voyage.fraisSupplementaires) || 0;
  
  // Coût total = coût d'achat + frais de douane + frais fixes + frais supplémentaires
  const coutTotal = coutTotalAchat + fraisDouaneTotal + fraisFixesTotal + fraisSupp;
  const beneficeNet = venteTotal - coutTotal;
  const margeBrute = beneficeNet;
  const margePercent = venteTotal > 0 ? (beneficeNet / venteTotal) * 100 : 0;
  const roiPercent = coutTotal > 0 ? (beneficeNet / coutTotal) * 100 : 0;

  return {
    coutTotalAchat,
    valeurDouane,
    forfaitDroitsTaxes,
    contributionSolidarite,
    autresFrais,
    fraisDouaneTotal,
    fraisFixesTotal,
    fraisSupp,
    coutTotal,
    venteTotal,
    beneficeNet,
    margeBrute,
    margePercent,
    roiPercent,
    detailsMarchandises
  };
};

export const getVoyagesMoisActuel = (voyages: any[]): any[] => {
  const maintenant = new Date();
  const moisActuel = maintenant.getMonth();
  const anneeActuelle = maintenant.getFullYear();
  
  return voyages.filter(v => {
    const dateVoyage = new Date(v.date);
    return dateVoyage.getMonth() === moisActuel && dateVoyage.getFullYear() === anneeActuelle;
  });
};

export const calculerStatistiques = (voyages: any[]) => {
  const stats = {
    totalVoyages: voyages.length,
    beneficeTotal: 0,
    venteTotal: 0,
    coutTotal: 0,
    margeMoyenne: 0,
    roiMoyen: 0,
    voyagesMoisActuel: getVoyagesMoisActuel(voyages).length
  };

  voyages.forEach(v => {
    if (v.calculs) {
      stats.beneficeTotal += v.calculs.beneficeNet;
      stats.venteTotal += v.calculs.venteTotal;
      stats.coutTotal += v.calculs.coutTotal;
    }
  });

  stats.margeMoyenne = stats.venteTotal > 0 
    ? (stats.beneficeTotal / stats.venteTotal) * 100 
    : 0;
  
  stats.roiMoyen = stats.coutTotal > 0
    ? (stats.beneficeTotal / stats.coutTotal) * 100
    : 0;

  return stats;
};

// Valeurs par défaut
export const FRAIS_FIXES_DEFAUT: FraisFixes = {
  transportAller: 0,
  transportRetour: 0,
  hebergement: 0,
  repas: 0,
  visa: 0,
  assurance: 0,
  taxiTransport: 0,
  autres: 0
};

export const TAUX_CHANGE_DEFAUT: TauxChange = {
  EUR: 165,
  USD: 150,
  TRY: 4.5,
  AED: 41,
  CNY: 21
};

export const MARGES_SUGGEREES_DEFAUT: MargesSuggerees = {
  min: 25,
  recommandee: 40,
  optimale: 60
};
