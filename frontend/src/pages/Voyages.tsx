import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Plane, Calculator, TrendingUp, DollarSign, Package, MapPin, Calendar, Edit, Trash2, Save, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useVoyages, useVoyageStats, type Voyage } from '@/hooks/useVoyages'
import { useBusinessConfig } from '@/hooks/useBusinessConfig'
import { VoyageForm } from '@/components/voyage/VoyageForm'
import { calculerVoyage, type VoyageData, type CalculsVoyage } from '@/services/businessLogic'

export function Voyages() {
  const { voyages, loading, error, createVoyage, updateVoyage, deleteVoyage, clearError } = useVoyages()
  const { stats: voyageStats } = useVoyageStats()
  const { tauxChange, margesSuggerees } = useBusinessConfig()
  const [showForm, setShowForm] = useState(false)
  const [editingVoyage, setEditingVoyage] = useState<Voyage | null>(null)
  const [expandedVoyage, setExpandedVoyage] = useState<string | null>(null)

  const stats = voyageStats || {
    totalVoyages: 0,
    totalBenefice: 0,
    totalValeur: 0,
    moyenneROI: 0,
    statuts: [],
    destinations: []
  }

  const handleSaveVoyage = async (voyageData: VoyageData & { calculs: CalculsVoyage }) => {
    try {
      if (editingVoyage) {
        await updateVoyage(editingVoyage._id, voyageData)
      } else {
        await createVoyage(voyageData)
      }
      setShowForm(false)
      setEditingVoyage(null)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
    }
  }

  const handleEditVoyage = (voyage: Voyage) => {
    setEditingVoyage(voyage)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingVoyage(null)
  }

  if (showForm) {
    return (
      <div className="p-6">
        <VoyageForm
          voyage={editingVoyage}
          tauxChange={tauxChange}
          margesSuggerees={margesSuggerees}
          onSave={handleSaveVoyage}
          onCancel={handleCancelForm}
          loading={loading}
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Gestion des Voyages
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gérez vos voyages d'import et calculez vos bénéfices
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau Voyage
          </Button>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          <Button variant="ghost" size="sm" onClick={clearError} className="ml-auto">
            ×
          </Button>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Voyages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalVoyages}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Plane className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bénéfice Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalBenefice)}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ROI Moyen</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.moyenneROI.toFixed(1)}%</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ce Mois</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.statuts.find(s => s._id === 'en_cours')?.count || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Voyages List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Mes Voyages</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Chargement des voyages...</div>
            ) : voyages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Aucun voyage enregistré. Cliquez sur "Nouveau Voyage" pour commencer.
              </div>
            ) : (
              <div className="space-y-4">
                {voyages.map((voyage) => (
                  <Card key={voyage._id} className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-3">
                          <Plane className="h-6 w-6 text-blue-600" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {voyage.destination}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(new Date(voyage.date))}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Package className="h-4 w-4" />
                                <span>{voyage.marchandises.length} produits</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setExpandedVoyage(expandedVoyage === voyage._id ? null : voyage._id)}
                          >
                            {expandedVoyage === voyage._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditVoyage(voyage)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteVoyage(voyage._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Bénéfice</p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(voyage.calculs.beneficeNet)}</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
                          <p className="text-lg font-bold text-blue-600">{voyage.statut}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
                          <p className="text-lg font-bold text-purple-600">{voyage.calculs.roiPercent.toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* Détails du voyage */}
                      {expandedVoyage === voyage._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                        >
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-white dark:bg-gray-700 p-2 rounded">
                              <span className="text-gray-600 dark:text-gray-400 text-xs">Coût d'achat:</span>
                              <div className="font-semibold text-gray-800 dark:text-white">{voyage.calculs.coutTotalAchat.toLocaleString()} DA</div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-2 rounded">
                              <span className="text-gray-600 dark:text-gray-400 text-xs">Douane (5%):</span>
                              <div className="font-semibold text-orange-600 dark:text-orange-400">{voyage.calculs.fraisDouaneTotal.toLocaleString()} DA</div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-2 rounded">
                              <span className="text-gray-600 dark:text-gray-400 text-xs">Frais fixes:</span>
                              <div className="font-semibold text-gray-800 dark:text-white">{voyage.calculs.fraisFixesTotal.toLocaleString()} DA</div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-2 rounded">
                              <span className="text-gray-600 dark:text-gray-400 text-xs">Frais suppl.:</span>
                              <div className="font-semibold text-gray-800 dark:text-white">{voyage.calculs.fraisSupp.toLocaleString()} DA</div>
                            </div>
                            <div className="col-span-2 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                              <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">Coût total:</span>
                              <div className="font-bold text-red-600 dark:text-red-400 text-lg">{voyage.calculs.coutTotal.toLocaleString()} DA</div>
                            </div>
                            <div className="col-span-2 bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                              <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">Vente totale:</span>
                              <div className="font-bold text-green-600 dark:text-green-400 text-lg">{voyage.calculs.venteTotal.toLocaleString()} DA</div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Détails des marchandises:</div>
                            <div className="space-y-2">
                              {voyage.calculs.detailsMarchandises.map((m, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-700 p-3 rounded border">
                                  <div className="font-semibold text-gray-800 dark:text-white mb-2">{m.nom}</div>
                                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <div>Quantité: <span className="font-semibold">{m.quantite}</span></div>
                                    <div>Coût achat: <span className="font-semibold">{m.coutAchatDA.toLocaleString()} DA</span></div>
                                    <div>Douane: <span className="font-semibold text-orange-600 dark:text-orange-400">{m.fraisDouane.toLocaleString()} DA</span></div>
                                    <div>Vente: <span className="font-semibold text-green-600 dark:text-green-400">{m.vente.toLocaleString()} DA</span></div>
                                    <div className="col-span-2 pt-2 border-t mt-1">
                                      Bénéfice: <span className={`font-bold ${(m.vente - m.coutAchatDA - m.fraisDouane) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {(m.vente - m.coutAchatDA - m.fraisDouane).toLocaleString()} DA
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}