import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Plus, Edit, Trash2, Calculator, DollarSign, TrendingUp, Save, AlertCircle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useConfiguration } from '@/hooks/useConfiguration'
import { useBusinessConfig } from '@/hooks/useBusinessConfig'

export function Configuration() {
  const { configurations, loading, error, createConfiguration, updateConfiguration, deleteConfiguration, clearError } = useConfiguration()
  const { 
    tauxChange, 
    margesSuggerees, 
    loading: configLoading, 
    error: configError,
    setTauxChange,
    setMargesSuggerees,
    saveTauxChange,
    saveMargesSuggerees
  } = useBusinessConfig()

  const [activeTab, setActiveTab] = useState<'taux' | 'marges'>('taux')

  const handleSaveTauxChange = async () => {
    try {
      await saveTauxChange(tauxChange)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des taux de change:', err)
    }
  }

  const handleSaveMarges = async () => {
    try {
      await saveMargesSuggerees(margesSuggerees)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des marges:', err)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Configuration
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gérez vos paramètres et configurations
            </p>
          </div>
        </div>
      </motion.div>

      {/* Onglets */}
      <div className="flex border-b bg-white dark:bg-gray-800 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('taux')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition ${
            activeTab === 'taux'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>Taux de change</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('marges')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition ${
            activeTab === 'marges'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>Marges</span>
          </div>
        </button>
      </div>

      {/* Affichage des erreurs */}
      {(error || configError) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-400 text-sm">{error || configError}</p>
          <Button variant="ghost" size="sm" onClick={clearError} className="ml-auto">
            ×
          </Button>
        </motion.div>
      )}

      {/* Contenu des onglets */}
      {activeTab === 'taux' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Taux de change (1 devise = X DA)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(tauxChange).map(([devise, taux]) => (
                <div key={devise} className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 dark:text-gray-300 font-medium w-20">{devise}:</label>
                  <Input
                    type="number"
                    value={taux}
                    onChange={(e) => setTauxChange({ ...tauxChange, [devise]: Number(e.target.value) })}
                    className="flex-1"
                    placeholder="Entrez le montant"
                    min="0"
                    step="0.01"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">DA</span>
                </div>
              ))}

              <Button 
                onClick={handleSaveTauxChange}
                disabled={configLoading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {configLoading ? 'Sauvegarde...' : 'Sauvegarder les taux de change'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 'marges' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Marges suggérées (%)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700 dark:text-gray-300 w-32">Minimale:</label>
                <Input
                  type="number"
                  value={margesSuggerees.min}
                  onChange={(e) => setMargesSuggerees({ ...margesSuggerees, min: Number(e.target.value) })}
                  className="flex-1"
                  min="0"
                  max="100"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700 dark:text-gray-300 w-32">Recommandée:</label>
                <Input
                  type="number"
                  value={margesSuggerees.recommandee}
                  onChange={(e) => setMargesSuggerees({ ...margesSuggerees, recommandee: Number(e.target.value) })}
                  className="flex-1"
                  min="0"
                  max="100"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700 dark:text-gray-300 w-32">Optimale:</label>
                <Input
                  type="number"
                  value={margesSuggerees.optimale}
                  onChange={(e) => setMargesSuggerees({ ...margesSuggerees, optimale: Number(e.target.value) })}
                  className="flex-1"
                  min="0"
                  max="100"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
              </div>

              <Button 
                onClick={handleSaveMarges}
                disabled={configLoading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {configLoading ? 'Sauvegarde...' : 'Sauvegarder les marges'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Conseils */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Conseils
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Actualisez les taux de change avant chaque voyage</li>
              <li>• Les frais fixes sont configurés individuellement pour chaque voyage</li>
              <li>• La douane (5%) est calculée sur le prix d'achat en DA</li>
              <li>• Les marges suggérées incluent tous les frais</li>
              <li>• Respectez le plafond légal de 1 800 000 DA par voyage</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}