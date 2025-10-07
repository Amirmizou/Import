import { motion } from 'framer-motion'
import { BookOpen, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function Guide() {
  const steps = [
    {
      title: "Créer un voyage",
      description: "Ajoutez un nouveau voyage avec destination, date et devise",
      icon: CheckCircle
    },
    {
      title: "Ajouter des marchandises",
      description: "Définissez les produits à importer avec quantités et prix",
      icon: CheckCircle
    },
    {
      title: "Configurer les frais",
      description: "Saisissez les frais de douane, transport et autres coûts",
      icon: CheckCircle
    },
    {
      title: "Calculer les bénéfices",
      description: "L'application calcule automatiquement vos marges et ROI",
      icon: CheckCircle
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Guide d'utilisation
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Apprenez à utiliser MicroImport Pro efficacement
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Étapes de base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <step.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Conseils importants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Vérifiez les taux de change
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Mettez à jour régulièrement les taux de change pour des calculs précis.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    Sauvegardez vos données
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Vos données sont automatiquement sauvegardées dans le cloud.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}