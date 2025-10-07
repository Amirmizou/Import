import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { ResponsiveGrid } from '@/components/ui/ResponsiveGrid'
import { ResponsiveText } from '@/components/ui/ResponsiveText'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export function ResponsiveExample() {
  const sampleData = [
    { id: 1, title: 'Voyage 1', destination: 'Paris', status: 'En cours' },
    { id: 2, title: 'Voyage 2', destination: 'Londres', status: 'Terminé' },
    { id: 3, title: 'Voyage 3', destination: 'New York', status: 'Planifié' },
    { id: 4, title: 'Voyage 4', destination: 'Tokyo', status: 'En cours' },
  ]

  return (
    <Container size="lg" padding="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <ResponsiveText as="h1" size="3xl" weight="bold" color="primary">
            Exemple Responsive
          </ResponsiveText>
          <ResponsiveText as="p" size="lg" color="secondary" align="center">
            Cette page démontre l'utilisation des composants responsives
          </ResponsiveText>
        </div>

        {/* Stats Cards */}
        <ResponsiveGrid 
          cols={{ default: 1, sm: 2, lg: 4 }}
          gap="md"
        >
          {[
            { title: 'Total Voyages', value: '24', color: 'blue' },
            { title: 'En Cours', value: '8', color: 'green' },
            { title: 'Terminés', value: '16', color: 'gray' },
            { title: 'Revenus', value: '€12,450', color: 'purple' },
          ].map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4 sm:p-6">
                <ResponsiveText as="h3" size="2xl" weight="bold" color="primary">
                  {stat.value}
                </ResponsiveText>
                <ResponsiveText as="p" size="sm" color="secondary">
                  {stat.title}
                </ResponsiveText>
              </CardContent>
            </Card>
          ))}
        </ResponsiveGrid>

        {/* Voyages Grid */}
        <div className="space-y-4">
          <ResponsiveText as="h2" size="2xl" weight="semibold" color="primary">
            Mes Voyages
          </ResponsiveText>
          
          <ResponsiveGrid 
            cols={{ default: 1, sm: 2, lg: 3 }}
            gap="md"
          >
            {sampleData.map((voyage) => (
              <Card key={voyage.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    {voyage.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <ResponsiveText as="span" size="sm" color="secondary">
                      Destination:
                    </ResponsiveText>
                    <ResponsiveText as="span" size="sm" weight="medium">
                      {voyage.destination}
                    </ResponsiveText>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <ResponsiveText as="span" size="sm" color="secondary">
                      Statut:
                    </ResponsiveText>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      voyage.status === 'En cours' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : voyage.status === 'Terminé'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {voyage.status}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      Voir
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ResponsiveGrid>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button size="lg" className="w-full sm:w-auto">
            Créer un Nouveau Voyage
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Voir Tous les Voyages
          </Button>
        </div>
      </div>
    </Container>
  )
}
