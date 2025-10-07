import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileJson, 
  Database,
  Calendar,
  Filter,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select, SelectOption } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Badge, BadgeGroup } from '@/components/ui/Badge'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { formatDate } from '@/lib/utils'
import { useVoyages } from '@/hooks/useVoyages'
import { useConfiguration } from '@/hooks/useConfiguration'

interface ExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf'
  dataType: 'voyages' | 'configurations' | 'all'
  dateFrom: string
  dateTo: string
  includeCalculations: boolean
  includeImages: boolean
}

interface ExportJob {
  id: string
  name: string
  format: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  createdAt: string
  completedAt?: string
  downloadUrl?: string
  error?: string
  data?: any
}

interface ExportPanelProps {
  className?: string
}

const formatOptions: SelectOption[] = [
  { value: 'csv', label: 'CSV (Excel compatible)' },
  { value: 'excel', label: 'Excel (.xlsx)' },
  { value: 'json', label: 'JSON' },
  { value: 'pdf', label: 'PDF' }
]

const dataTypeOptions: SelectOption[] = [
  { value: 'voyages', label: 'Voyages uniquement' },
  { value: 'configurations', label: 'Configurations uniquement' },
  { value: 'all', label: 'Toutes les données' }
]

export const ExportPanel: React.FC<ExportPanelProps> = ({ className }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dataType: 'voyages',
    dateFrom: '',
    dateTo: '',
    includeCalculations: true,
    includeImages: false
  })
  
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { voyages, loading: voyagesLoading } = useVoyages()
  const { configurations, loading: configLoading } = useConfiguration()

  // Fonction pour créer un nouvel export job
  const createExportJob = (options: ExportOptions): ExportJob => {
    const id = Date.now().toString()
    const name = `Export ${options.dataType} - ${new Date().toLocaleDateString('fr-FR')}`
    
    return {
      id,
      name,
      format: options.format,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
      data: getExportData(options)
    }
  }

  // Fonction pour récupérer les données à exporter
  const getExportData = (options: ExportOptions) => {
    let data: any = {}
    
    if (options.dataType === 'voyages' || options.dataType === 'all') {
      data.voyages = voyages || []
    }
    
    if (options.dataType === 'configurations' || options.dataType === 'all') {
      data.configurations = configurations || []
    }
    
    return data
  }

  // Fonction pour simuler l'export
  const simulateExport = async (job: ExportJob) => {
    return new Promise<void>((resolve, reject) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 20
        
        setExportJobs(prev => prev.map(j => 
          j.id === job.id 
            ? { ...j, progress: Math.min(progress, 100), status: progress >= 100 ? 'completed' : 'processing' }
            : j
        ))
        
        if (progress >= 100) {
          clearInterval(interval)
          
          // Générer l'URL de téléchargement
          const downloadUrl = generateDownloadUrl(job)
          
          setExportJobs(prev => prev.map(j => 
            j.id === job.id 
              ? { 
                  ...j, 
                  status: 'completed', 
                  progress: 100,
                  completedAt: new Date().toISOString(),
                  downloadUrl
                }
              : j
          ))
          
          resolve()
        }
      }, 500)
    })
  }

  // Fonction pour générer l'URL de téléchargement
  const generateDownloadUrl = (job: ExportJob): string => {
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `export-${job.dataType}-${timestamp}.${job.format}`
    return `/api/export/download/${filename}`
  }

  // Fonction pour exporter les données
  const handleExport = async () => {
    if (!exportOptions.dateFrom || !exportOptions.dateTo) {
      setError('Veuillez sélectionner une période')
      return
    }

    setIsExporting(true)
    setError(null)

    try {
      const newJob = createExportJob(exportOptions)
      setExportJobs(prev => [newJob, ...prev])
      
      await simulateExport(newJob)
    } catch (err) {
      setError('Erreur lors de l\'export')
      setExportJobs(prev => prev.map(j => 
        j.id === newJob.id 
          ? { ...j, status: 'error', error: 'Erreur lors de l\'export' }
          : j
      ))
    } finally {
      setIsExporting(false)
    }
  }

  // Fonction pour télécharger un fichier
  const handleDownload = (job: ExportJob) => {
    if (job.downloadUrl) {
      const link = document.createElement('a')
      link.href = job.downloadUrl
      link.download = `${job.name}.${job.format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Fonction pour supprimer un job
  const handleDeleteJob = (jobId: string) => {
    setExportJobs(prev => prev.filter(job => job.id !== jobId))
  }

  // Fonction pour obtenir l'icône du format
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4" />
      case 'json':
        return <FileJson className="h-4 w-4" />
      case 'pdf':
        return <FileText className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Terminé</Badge>
      case 'processing':
        return <Badge variant="warning">En cours</Badge>
      case 'error':
        return <Badge variant="error">Erreur</Badge>
      default:
        return <Badge variant="secondary">En attente</Badge>
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Configuration d'export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exporter les données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format d'export</label>
              <Select
                value={exportOptions.format}
                onValueChange={(value) => setExportOptions(prev => ({ ...prev, format: value as any }))}
                options={formatOptions}
                placeholder="Choisissez un format d'export"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de données</label>
              <Select
                value={exportOptions.dataType}
                onValueChange={(value) => setExportOptions(prev => ({ ...prev, dataType: value as any }))}
                options={dataTypeOptions}
                placeholder="Choisissez le type de données"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de début</label>
              <Input
                type="date"
                value={exportOptions.dateFrom}
                onChange={(e) => setExportOptions(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de fin</label>
              <Input
                type="date"
                value={exportOptions.dateTo}
                onChange={(e) => setExportOptions(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportOptions.includeCalculations}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeCalculations: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Inclure les calculs</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportOptions.includeImages}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeImages: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Inclure les images</span>
            </label>
          </div>
          
          <Button
            onClick={handleExport}
            disabled={isExporting || !exportOptions.dateFrom || !exportOptions.dateTo}
            className="w-full"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Lancer l'export
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Historique des exports */}
      {exportJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Historique des exports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exportJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {getFormatIcon(job.format)}
                    <div>
                      <h4 className="font-medium">{job.name}</h4>
                      <p className="text-sm text-gray-500">
                        Créé le {formatDate(job.createdAt)}
                      </p>
                      {job.status === 'processing' && (
                        <div className="mt-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{job.progress}%</p>
                        </div>
                      )}
                      {job.error && (
                        <p className="text-sm text-red-600 mt-1">{job.error}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(job.status)}
                    
                    {job.status === 'completed' && job.downloadUrl && (
                      <Button
                        size="sm"
                        onClick={() => handleDownload(job)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Télécharger
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteJob(job.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}