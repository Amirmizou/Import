import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Package, 
  Calculator,
  DollarSign,
  TrendingUp,
  Copy,
  Lightbulb
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EnhancedInput } from '@/components/ui/FormField'
import { Badge } from '@/components/ui/Badge'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { 
  type Marchandise, 
  type SuggestionsPrix,
  suggererPrixVente,
  type FraisFixes,
  type TauxChange,
  type MargesSuggerees,
  convertirEnDA
} from '@/services/businessLogic'
import { formatCurrency } from '@/lib/utils'

interface MerchandiseManagerProps {
  marchandises: Marchandise[]
  onUpdate: (marchandises: Marchandise[]) => void
  deviseVoyage: string
  fraisFixes: FraisFixes
  tauxChange: TauxChange
  margesSuggerees: MargesSuggerees
  className?: string
}

interface EditingMerchandise extends Marchandise {
  isEditing?: boolean
  suggestions?: SuggestionsPrix
}

export const MerchandiseManager: React.FC<MerchandiseManagerProps> = ({
  marchandises,
  onUpdate,
  deviseVoyage,
  fraisFixes,
  tauxChange,
  margesSuggerees,
  className
}) => {
  const [editingMerchandise, setEditingMerchandise] = useState<EditingMerchandise | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const addMerchandise = (marchandise: Omit<Marchandise, 'id'>) => {
    const newMerchandise: Marchandise = {
      ...marchandise,
      id: Date.now()
    }
    onUpdate([...marchandises, newMerchandise])
    setShowAddForm(false)
  }

  const updateMerchandise = (id: number, updates: Partial<Marchandise>) => {
    const updated = marchandises.map(m => 
      m.id === id ? { ...m, ...updates } : m
    )
    onUpdate(updated)
  }

  const deleteMerchandise = (id: number) => {
    onUpdate(marchandises.filter(m => m.id !== id))
  }

  const duplicateMerchandise = (marchandise: Marchandise) => {
    const duplicated: Marchandise = {
      ...marchandise,
      id: Date.now(),
      nom: `${marchandise.nom} (copie)`
    }
    onUpdate([...marchandises, duplicated])
  }

  const startEditing = (marchandise: Marchandise) => {
    const suggestions = suggererPrixVente(
      marchandise.prixAchatUnitaire,
      deviseVoyage,
      marchandise.quantite,
      fraisFixes,
      tauxChange,
      margesSuggerees
    )
    
    setEditingMerchandise({
      ...marchandise,
      isEditing: true,
      suggestions
    })
  }

  const saveEditing = () => {
    if (editingMerchandise) {
      updateMerchandise(editingMerchandise.id, {
        nom: editingMerchandise.nom,
        quantite: editingMerchandise.quantite,
        prixAchatUnitaire: editingMerchandise.prixAchatUnitaire,
        prixVenteUnitaire: editingMerchandise.prixVenteUnitaire
      })
      setEditingMerchandise(null)
    }
  }

  const cancelEditing = () => {
    setEditingMerchandise(null)
  }

  const calculateProfit = (marchandise: Marchandise) => {
    const coutAchat = marchandise.prixAchatUnitaire * marchandise.quantite
    const coutAchatDA = convertirEnDA(coutAchat, deviseVoyage, tauxChange)
    
    // NOUVEAU CALCUL SELON LE RÉGIME FISCAL ALGÉRIEN 2025
    const valeurDouane = coutAchatDA
    const forfaitDroitsTaxes = valeurDouane * 0.05 // 5%
    const contributionSolidarite = valeurDouane * 0.03 // 3%
    const autresFrais = valeurDouane * 0.015 // 1.5%
    const coutTotalUnitaire = valeurDouane + forfaitDroitsTaxes + contributionSolidarite + autresFrais
    
    const venteTotal = marchandise.prixVenteUnitaire * marchandise.quantite
    return venteTotal - coutTotalUnitaire
  }

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-600 dark:text-green-400'
    if (profit < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Marchandises ({marchandises.length})
            </CardTitle>
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Formulaire d'ajout */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20"
              >
                <MerchandiseForm
                  onSave={addMerchandise}
                  onCancel={() => setShowAddForm(false)}
                  deviseVoyage={deviseVoyage}
                  fraisFixes={fraisFixes}
                  tauxChange={tauxChange}
                  margesSuggerees={margesSuggerees}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Liste des marchandises */}
          {marchandises.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune marchandise ajoutée</p>
              <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {marchandises.map((marchandise) => (
                <MerchandiseCard
                  key={marchandise.id}
                  marchandise={marchandise}
                  isEditing={editingMerchandise?.id === marchandise.id}
                  editingData={editingMerchandise}
                  onEdit={() => startEditing(marchandise)}
                  onSave={saveEditing}
                  onCancel={cancelEditing}
                  onDelete={() => deleteMerchandise(marchandise.id)}
                  onDuplicate={() => duplicateMerchandise(marchandise)}
                  onUpdate={(updates) => updateMerchandise(marchandise.id, updates)}
                  deviseVoyage={deviseVoyage}
                  fraisFixes={fraisFixes}
                  tauxChange={tauxChange}
                  margesSuggerees={margesSuggerees}
                />
              ))}
            </div>
          )}

          {/* Résumé */}
          {marchandises.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Résumé des marchandises
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-600 dark:text-gray-400">Total articles</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {marchandises.reduce((sum, m) => sum + m.quantite, 0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-gray-400">Coût total</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(marchandises.reduce((sum, m) => {
                      const coutAchat = m.prixAchatUnitaire * m.quantite;
                      const coutAchatDA = convertirEnDA(coutAchat, deviseVoyage, tauxChange);
                      
                      // NOUVEAU CALCUL SELON LE RÉGIME FISCAL ALGÉRIEN 2025
                      const valeurDouane = coutAchatDA;
                      const forfaitDroitsTaxes = valeurDouane * 0.05; // 5%
                      const contributionSolidarite = valeurDouane * 0.03; // 3%
                      const autresFrais = valeurDouane * 0.015; // 1.5%
                      const coutTotalUnitaire = valeurDouane + forfaitDroitsTaxes + contributionSolidarite + autresFrais;
                      
                      return sum + coutTotalUnitaire;
                    }, 0))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-gray-400">Vente totale</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(marchandises.reduce((sum, m) => sum + (m.prixVenteUnitaire * m.quantite), 0))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-gray-400">Bénéfice total</div>
                  <div className={`font-semibold ${getProfitColor(marchandises.reduce((sum, m) => sum + calculateProfit(m), 0))}`}>
                    {formatCurrency(marchandises.reduce((sum, m) => sum + calculateProfit(m), 0))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Composant pour une carte de marchandise
interface MerchandiseCardProps {
  marchandise: Marchandise
  isEditing: boolean
  editingData?: EditingMerchandise
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
  onDuplicate: () => void
  onUpdate: (updates: Partial<Marchandise>) => void
  deviseVoyage: string
  fraisFixes: FraisFixes
  tauxChange: TauxChange
  margesSuggerees: MargesSuggerees
}

const MerchandiseCard: React.FC<MerchandiseCardProps> = ({
  marchandise,
  isEditing,
  editingData,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDuplicate,
  onUpdate,
  deviseVoyage,
  fraisFixes,
  tauxChange,
  margesSuggerees
}) => {
  const profit = (marchandise.prixVenteUnitaire * marchandise.quantite) - (marchandise.prixAchatUnitaire * marchandise.quantite)
  const profitPercent = marchandise.prixAchatUnitaire > 0 
    ? ((marchandise.prixVenteUnitaire - marchandise.prixAchatUnitaire) / marchandise.prixAchatUnitaire) * 100 
    : 0

  if (isEditing && editingData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20"
      >
        <MerchandiseForm
          marchandise={editingData}
          onSave={onSave}
          onCancel={onCancel}
          deviseVoyage={deviseVoyage}
          fraisFixes={fraisFixes}
          tauxChange={tauxChange}
          margesSuggerees={margesSuggerees}
          isEditing
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {marchandise.nom}
          </h4>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Quantité: <strong>{marchandise.quantite}</strong></span>
            <span>Prix achat: <strong>{formatCurrency(marchandise.prixAchatUnitaire)} {deviseVoyage}</strong></span>
            <span>Prix vente: <strong>{formatCurrency(marchandise.prixVenteUnitaire)} DA</strong></span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="text-gray-600 dark:text-gray-400">Coût total</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency((() => {
              const coutAchat = marchandise.prixAchatUnitaire * marchandise.quantite;
              const coutAchatDA = convertirEnDA(coutAchat, deviseVoyage, tauxChange);
              
              // NOUVEAU CALCUL SELON LE RÉGIME FISCAL ALGÉRIEN 2025
              const valeurDouane = coutAchatDA;
              const forfaitDroitsTaxes = valeurDouane * 0.05; // 5%
              const contributionSolidarite = valeurDouane * 0.03; // 3%
              const autresFrais = valeurDouane * 0.015; // 1.5%
              return valeurDouane + forfaitDroitsTaxes + contributionSolidarite + autresFrais;
            })())}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="text-gray-600 dark:text-gray-400">Vente totale</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(marchandise.prixVenteUnitaire * marchandise.quantite)}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="text-gray-600 dark:text-gray-400">Bénéfice</div>
          <div className={`font-semibold ${profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(profit)}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="text-gray-600 dark:text-gray-400">Marge</div>
          <div className={`font-semibold ${profitPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {profitPercent.toFixed(1)}%
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Composant formulaire de marchandise
interface MerchandiseFormProps {
  marchandise?: EditingMerchandise
  onSave: (marchandise: Omit<Marchandise, 'id'>) => void
  onCancel: () => void
  deviseVoyage: string
  fraisFixes: FraisFixes
  tauxChange: TauxChange
  margesSuggerees: MargesSuggerees
  isEditing?: boolean
}

const MerchandiseForm: React.FC<MerchandiseFormProps> = ({
  marchandise,
  onSave,
  onCancel,
  deviseVoyage,
  fraisFixes,
  tauxChange,
  margesSuggerees,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    nom: marchandise?.nom || '',
    quantite: marchandise?.quantite || 1,
    prixAchatUnitaire: marchandise?.prixAchatUnitaire || 0,
    prixVenteUnitaire: marchandise?.prixVenteUnitaire || 0
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const suggestions = formData.prixAchatUnitaire > 0 
    ? suggererPrixVente(
        formData.prixAchatUnitaire,
        deviseVoyage,
        formData.quantite,
        fraisFixes,
        tauxChange,
        margesSuggerees
      )
    : null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    }

    if (formData.quantite <= 0) {
      newErrors.quantite = 'La quantité doit être positive'
    }

    if (formData.prixAchatUnitaire <= 0) {
      newErrors.prixAchatUnitaire = 'Le prix d\'achat doit être positif'
    }

    if (formData.prixVenteUnitaire <= 0) {
      newErrors.prixVenteUnitaire = 'Le prix de vente doit être positif'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 dark:text-white">
          {isEditing ? 'Modifier la marchandise' : 'Nouvelle marchandise'}
        </h4>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EnhancedInput
          label="Nom du produit"
          value={formData.nom}
          onChange={(e) => updateFormData('nom', e.target.value)}
          placeholder="Entrez le nom de la marchandise"
          error={errors.nom}
          required
        />

        <EnhancedInput
          label="Quantité"
          type="number"
          value={formData.quantite}
          onChange={(e) => updateFormData('quantite', Number(e.target.value))}
          min="1"
          error={errors.quantite}
          required
        />

        <EnhancedInput
          label={`Prix d'achat unitaire (${deviseVoyage})`}
          type="number"
          value={formData.prixAchatUnitaire}
          onChange={(e) => updateFormData('prixAchatUnitaire', Number(e.target.value))}
          min="0"
          step="0.01"
          error={errors.prixAchatUnitaire}
          required
        />

        <EnhancedInput
          label="Prix de vente unitaire (DA)"
          type="number"
          value={formData.prixVenteUnitaire}
          onChange={(e) => updateFormData('prixVenteUnitaire', Number(e.target.value))}
          min="0"
          step="0.01"
          error={errors.prixVenteUnitaire}
          required
        />
      </div>

      {/* Suggestions de prix */}
      {suggestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <div className="flex items-start gap-3 mb-3">
            <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 dark:text-green-300 text-sm mb-2">
                💡 Prix de vente suggérés (unitaire)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white dark:bg-gray-700 p-3 rounded border">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">Minimum</div>
                  <div className="font-bold text-yellow-700 dark:text-yellow-400">
                    {formatCurrency(suggestions.min)}
                  </div>
                  <div className="text-gray-500">Marge {margesSuggerees.min}%</div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded border border-green-300 dark:border-green-800">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">Recommandé</div>
                  <div className="font-bold text-green-700 dark:text-green-400">
                    {formatCurrency(suggestions.recommande)}
                  </div>
                  <div className="text-gray-500">Marge {margesSuggerees.recommandee}%</div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded border">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">Optimal</div>
                  <div className="font-bold text-blue-700 dark:text-blue-400">
                    {formatCurrency(suggestions.optimal)}
                  </div>
                  <div className="text-gray-500">Marge {margesSuggerees.optimale}%</div>
                </div>
              </div>
              <Button
                onClick={() => updateFormData('prixVenteUnitaire', suggestions.recommande)}
                className="mt-3 w-full bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600 transition"
                variant="secondary"
              >
                Utiliser le prix recommandé
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
