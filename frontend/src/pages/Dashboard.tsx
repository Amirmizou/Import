import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useDashboard } from '@/hooks/useDashboard'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'

// Fonction pour générer les données de revenus basées sur les vraies données
const generateRevenueData = (voyages: any[]) => {
  if (!voyages || voyages.length === 0) {
    return [
      { month: 'Jan', revenue: 0, profit: 0 },
      { month: 'Fév', revenue: 0, profit: 0 },
      { month: 'Mar', revenue: 0, profit: 0 },
      { month: 'Avr', revenue: 0, profit: 0 },
      { month: 'Mai', revenue: 0, profit: 0 },
      { month: 'Jun', revenue: 0, profit: 0 },
    ]
  }

  const monthlyData = voyages.reduce((acc, voyage) => {
    const month = new Date(voyage.date).toLocaleDateString('fr-FR', { month: 'short' })
    const revenue = voyage.marchandises?.reduce((sum: number, marchandise: any) => 
      sum + (marchandise.prixVenteUnitaire * marchandise.quantite), 0) || 0
    // Calculer le profit réel basé sur les calculs du voyage
    const profit = voyage.calculs ? voyage.calculs.beneficeNet : revenue * 0.3
    
    if (!acc[month]) {
      acc[month] = { revenue: 0, profit: 0 }
    }
    acc[month].revenue += revenue
    acc[month].profit += profit
    
    return acc
  }, {})

  return Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
    month,
    revenue: data.revenue,
    profit: data.profit
  }))
}

// Fonction pour générer les données de destinations
const generateDestinationData = (voyages: any[]) => {
  if (!voyages || voyages.length === 0) {
    return [
      { name: 'Aucune', value: 100, color: '#6b7280' }
    ]
  }

  const destinationCounts = voyages.reduce((acc: any, voyage) => {
    const dest = voyage.destination || 'Inconnue'
    acc[dest] = (acc[dest] || 0) + 1
    return acc
  }, {})

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']
  
  return Object.entries(destinationCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 6)
    .map(([name, value], index) => ({
      name,
      value: value as number,
      color: colors[index % colors.length]
    }))
}

// Fonction pour générer les données de catégories
const generateCategoryData = (voyages: any[]) => {
  if (!voyages || voyages.length === 0) {
    return [
      { category: 'Aucune', value: 0 }
    ]
  }

  const categoryData = voyages.reduce((acc: any, voyage) => {
    voyage.marchandises?.forEach((marchandise: any) => {
      const category = marchandise.nom || 'Inconnue'
      const value = marchandise.prixVenteUnitaire * marchandise.quantite
      
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += value
    })
    
    return acc
  }, {})

  return Object.entries(categoryData)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 6)
    .map(([category, value]) => ({
      category,
      value: value as number
    }))
}

export function Dashboard() {
  const { stats: dashboardStats, loading, error, clearError } = useDashboard()
  
  // Générer les données basées sur les vraies données
  const revenueData = generateRevenueData(dashboardStats?.voyages || [])
  const pieData = generateDestinationData(dashboardStats?.voyages || [])
  const barData = generateCategoryData(dashboardStats?.voyages || [])

  const stats = [
    {
      title: 'Revenus Totaux',
      value: formatCurrency(dashboardStats.totalValeur),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Voyages',
      value: dashboardStats.totalVoyages.toString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Bénéfices',
      value: formatCurrency(dashboardStats.totalBenefice),
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Taux de Conversion',
      value: '68.5%',
      change: '+5.3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Vue d'ensemble de vos performances et statistiques
        </p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.title === 'Revenus Totaux' ? formatCurrency(parseInt(stat.value)) : stat.value}
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">vs mois dernier</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), '']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Destinations Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Destination</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Categories Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Ventes par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Ventes']}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
