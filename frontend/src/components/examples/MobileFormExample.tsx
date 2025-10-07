import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { MobileForm, MobileFormField, MobileFormActions, MobileInput, MobileButton } from '@/components/ui/MobileForm'
import { ResponsiveText } from '@/components/ui/ResponsiveText'
import { Container } from '@/components/ui/Container'

export function MobileFormExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple validation
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Le nom est requis'
    if (!formData.email) newErrors.email = 'L\'email est requis'
    if (!formData.phone) newErrors.phone = 'Le téléphone est requis'
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData)
      // Handle form submission
    }
  }

  return (
    <Container size="md" padding="md">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <ResponsiveText as="h1" size="3xl" weight="bold" color="primary">
            Exemple de Formulaire Mobile
          </ResponsiveText>
          <ResponsiveText as="p" size="lg" color="secondary" align="center">
            Formulaire optimisé pour une expérience mobile parfaite
          </ResponsiveText>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              Contactez-nous
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MobileForm onSubmit={handleSubmit}>
              <MobileFormField 
                label="Nom complet" 
                error={errors.name}
                required
              >
                <MobileInput
                  type="text"
                  placeholder="Votre nom complet"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                />
              </MobileFormField>

              <MobileFormField 
                label="Adresse email" 
                error={errors.email}
                required
              >
                <MobileInput
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full"
                />
              </MobileFormField>

              <MobileFormField 
                label="Numéro de téléphone" 
                error={errors.phone}
                required
              >
                <MobileInput
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full"
                />
              </MobileFormField>

              <MobileFormField 
                label="Message" 
                error={errors.message}
              >
                <textarea
                  placeholder="Votre message..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation resize-none"
                  rows={4}
                />
              </MobileFormField>

              <MobileFormActions>
                <MobileButton
                  type="submit"
                  variant="default"
                  fullWidth
                  className="order-2 sm:order-1"
                >
                  Envoyer le message
                </MobileButton>
                <MobileButton
                  type="button"
                  variant="outline"
                  fullWidth
                  className="order-1 sm:order-2"
                  onClick={() => setFormData({ name: '', email: '', phone: '', message: '' })}
                >
                  Effacer
                </MobileButton>
              </MobileFormActions>
            </MobileForm>
          </CardContent>
        </Card>

        {/* Exemple de boutons d'action */}
        <div className="max-w-2xl mx-auto">
          <ResponsiveText as="h2" size="2xl" weight="semibold" color="primary" className="mb-4">
            Boutons d'Action Mobile
          </ResponsiveText>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MobileButton variant="default" fullWidth>
              Action Principale
            </MobileButton>
            <MobileButton variant="outline" fullWidth>
              Action Secondaire
            </MobileButton>
            <MobileButton variant="ghost" fullWidth>
              Action Tertiaire
            </MobileButton>
            <MobileButton variant="default" size="lg" fullWidth>
              Bouton Large
            </MobileButton>
          </div>
        </div>
      </div>
    </Container>
  )
}
