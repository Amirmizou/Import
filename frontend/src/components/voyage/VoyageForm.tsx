import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, 
  X, 
  AlertCircle,
  Calculator,
  Plane,
  DollarSign,
  Calendar,
  MapPin,
  Settings,
  Save as SaveIcon,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  TrendingUp,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EnhancedInput } from '@/components/ui/FormField'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { MerchandiseManager } from './MerchandiseManager'
import { useVoyageCache } from '@/hooks/useVoyageCache'
import { 
  type VoyageData, 
  type Marchandise, 
  type CalculsVoyage,
  calculerVoyage,
  calculerFraisFixesTotal,
  PLAFOND_VOYAGE,
  TAUX_DOUANE,
  FRAIS_FIXES_DEFAUT
} from '@/services/businessLogic'
import { formatCurrency, formatDate } from '@/lib/utils'

interface VoyageFormProps {
  voyage?: VoyageData & { calculs?: CalculsVoyage }
  tauxChange: any
  margesSuggerees: any
  onSave: (voyage: VoyageData & { calculs: CalculsVoyage }) => void
  onCancel: () => void
  loading?: boolean
}

export const VoyageForm: React.FC<VoyageFormProps> = ({
  voyage,
  tauxChange,
  margesSuggerees,
  onSave,
  onCancel,
  loading = false
}) => {
  const { cachedData, hasUnsavedChanges, saveToCache, clearCache, autoSave } = useVoyageCache(voyage?._id)
  
  const [voyageData, setVoyageData] = useState<VoyageData>({
    date: voyage?.date || cachedData?.date || '',
    destination: voyage?.destination || cachedData?.destination || '',
    deviseVoyage: voyage?.deviseVoyage || cachedData?.deviseVoyage || 'EUR',
    marchandises: voyage?.marchandises || cachedData?.marchandises || [],
    fraisSupplementaires: voyage?.fraisSupplementaires || cachedData?.fraisSupplementaires || 0,
    fraisFixes: voyage?.fraisFixes || cachedData?.fraisFixes || FRAIS_FIXES_DEFAUT
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showCalculations, setShowCalculations] = useState(false)

  // Auto-sauvegarde avec debounce
  useEffect(() => {
    const cleanup = autoSave(voyageData)
    return cleanup
  }, [voyageData, autoSave])

  // Charger les données depuis le cache si disponible
  useEffect(() => {
    if (cachedData && !voyage) {
      setVoyageData(cachedData)
    }
  }, [cachedData, voyage])

  const updateVoyageData = (updates: Partial<VoyageData>) => {
    setVoyageData(prev => ({ ...prev, ...updates }))
    // Effacer les erreurs du champ modifié
    const fieldErrors = Object.keys(updates)
    setErrors(prev => {
      const newErrors = { ...prev }
      fieldErrors.forEach(field => {
        if (newErrors[field]) {
          delete newErrors[field]
        }
      })
      return newErrors
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!voyageData.date) {
      newErrors.date = 'La date est requise'
    }

    if (!voyageData.destination.trim()) {
      newErrors.destination = 'La destination est requise'
    }

    if (voyageData.marchandises.length === 0) {
      newErrors.marchandises = 'Au moins une marchandise est requise'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsSaving(true)
    try {
      const calculs = calculerVoyage(voyageData, tauxChange)
      
      if (calculs.valeurDouane > PLAFOND_VOYAGE) {
        setErrors({
          plafond: `⚠️ ATTENTION: La valeur totale (${calculs.valeurDouane.toLocaleString()} DA) dépasse le plafond légal de ${PLAFOND_VOYAGE.toLocaleString()} DA par voyage!`
        })
        setIsSaving(false)
        return
      }

      // Sauvegarder comme terminé (pas un brouillon)
      saveToCache(voyageData, false)
      
      onSave({ ...voyageData, calculs })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setErrors({ save: 'Erreur lors de la sauvegarde du voyage' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?'
      )
      if (!confirmed) return
    }
    clearCache()
    onCancel()
  }

  const calculsTemp = voyageData.marchandises.length > 0 
    ? calculerVoyage(voyageData, tauxChange)
    : null

  const isFormValid = voyageData.date && voyageData.destination && voyageData.marchandises.length > 0

  return (
    <div className="space-y-6">
      {/* Header avec statut */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {voyage ? 'Modifier le voyage' : 'Nouveau voyage'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {voyage ? 'Modifiez les informations de votre voyage' : 'Créez un nouveau voyage d\'import'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Badge variant="warning" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Modifications non sauvegardées
            </Badge>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!isFormValid || isSaving || loading}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Messages d'erreur globaux */}
      <AnimatePresence>
        {Object.keys(errors).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {Object.entries(errors).map(([key, error]) => (
              <Alert key={key} variant={key === 'plafond' ? 'warning' : 'destructive'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Informations du voyage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EnhancedInput
                  label="Date du voyage"
                  type="date"
                  value={voyageData.date}
                  onChange={(e) => updateVoyageData({ date: e.target.value })}
                  error={errors.date}
                  required
                  icon={<Calendar className="h-4 w-4" />}
                />

                <EnhancedInput
                  label="Destination"
                  value={voyageData.destination}
                  onChange={(e) => updateVoyageData({ destination: e.target.value })}
                  placeholder="Entrez la destination du voyage"
                  error={errors.destination}
                  required
                  icon={<MapPin className="h-4 w-4" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Devise du voyage
                  </label>
                  <select
                    value={voyageData.deviseVoyage}
                    onChange={(e) => updateVoyageData({ deviseVoyage: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {Object.entries(tauxChange).map(([devise, taux]) => (
                      <option key={devise} value={devise}>
                        {devise} (1 {devise} = {taux} DA)
                      </option>
                    ))}
                  </select>
                </div>

                <EnhancedInput
                  label="Frais supplémentaires (DA)"
                  type="number"
                  value={voyageData.fraisSupplementaires}
                  onChange={(e) => updateVoyageData({ fraisSupplementaires: Number(e.target.value) })}
                  placeholder="Entrez le montant"
                  min="0"
                  step="0.01"
                  hint="Frais imprévus, commissions, etc."
                  icon={<DollarSign className="h-4 w-4" />}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gestion des marchandises */}
          <MerchandiseManager
            marchandises={voyageData.marchandises}
            onUpdate={(marchandises) => updateVoyageData({ marchandises })}
            deviseVoyage={voyageData.deviseVoyage}
            fraisFixes={voyageData.fraisFixes}
            tauxChange={tauxChange}
            margesSuggerees={margesSuggerees}
          />
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Frais fixes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Frais fixes du voyage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(voyageData.fraisFixes).map(([key, value]) => (
                <EnhancedInput
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  type="number"
                  value={value}
                  onChange={(e) => updateVoyageData({ 
                    fraisFixes: { 
                      ...voyageData.fraisFixes, 
                      [key]: Number(e.target.value) 
                    } 
                  })}
                  placeholder="Entrez le montant"
                  min="0"
                  step="0.01"
                />
              ))}
              
              <div className="pt-3 border-t flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                <span className="font-bold text-gray-800 dark:text-white">Total frais fixes:</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {calculerFraisFixesTotal(voyageData.fraisFixes).toLocaleString()} DA
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Calculs en temps réel */}
          {calculsTemp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Calculs du voyage
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCalculations(!showCalculations)}
                    >
                      {showCalculations ? 'Masquer' : 'Détails'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Résumé rapide */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-gray-600 dark:text-gray-400">Bénéfice</div>
                      <div className={`text-lg font-bold ${calculsTemp.beneficeNet >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(calculsTemp.beneficeNet)}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-gray-600 dark:text-gray-400">ROI</div>
                      <div className={`text-lg font-bold ${calculsTemp.roiPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {calculsTemp.roiPercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Détails */}
                  <AnimatePresence>
                    {showCalculations && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Coût d'achat:</span>
                            <span className="font-semibold">{formatCurrency(calculsTemp.coutTotalAchat)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Douane (5%):</span>
                            <span className="font-semibold text-orange-600 dark:text-orange-400">{formatCurrency(calculsTemp.fraisDouaneTotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Frais fixes:</span>
                            <span className="font-semibold">{formatCurrency(calculsTemp.fraisFixesTotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Frais suppl.:</span>
                            <span className="font-semibold">{formatCurrency(calculsTemp.fraisSupp)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between">
                            <span className="font-medium text-gray-800 dark:text-white">Coût total:</span>
                            <span className="font-bold text-red-600 dark:text-red-400">{formatCurrency(calculsTemp.coutTotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800 dark:text-white">Vente totale:</span>
                            <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(calculsTemp.venteTotal)}</span>
                          </div>
                        </div>

                        {/* Alerte plafond */}
                        {calculsTemp.valeurDouane > PLAFOND_VOYAGE && (
                          <Alert variant="warning">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Attention:</strong> La valeur ({formatCurrency(calculsTemp.valeurDouane)}) dépasse le plafond légal de {formatCurrency(PLAFOND_VOYAGE)}.
                            </AlertDescription>
                          </Alert>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Conseils */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Conseils
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Vos données sont automatiquement sauvegardées</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Respectez le plafond légal de {formatCurrency(PLAFOND_VOYAGE)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Les prix suggérés incluent tous les frais</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}