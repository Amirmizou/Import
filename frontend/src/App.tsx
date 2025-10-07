import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/layouts/MainLayout'
import { Home } from '@/pages/Home'
import { Dashboard } from '@/pages/Dashboard'
import { Voyages } from '@/pages/Voyages'
import { Configuration } from '@/pages/Configuration'
import { Guide } from '@/pages/Guide'
import { Profile } from '@/pages/Profile'
import { Settings } from '@/pages/Settings'

type Page = 'home' | 'dashboard' | 'voyages' | 'configuration' | 'guide' | 'profile' | 'settings'

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'dashboard':
        return <Dashboard />
      case 'voyages':
        return <Voyages />
      case 'configuration':
        return <Configuration />
      case 'guide':
        return <Guide />
      case 'profile':
        return <Profile />
      case 'settings':
        return <Settings />
      default:
        return <Home />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <MainLayout 
        showSidebar={currentPage !== 'home'} 
        currentPage={currentPage}
        onPageChange={(page: string) => setCurrentPage(page as Page)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </MainLayout>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}

export default App