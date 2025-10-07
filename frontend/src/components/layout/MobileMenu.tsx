import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, BarChart3, Package, Settings, BookOpen, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  currentPage?: string
  onPageChange?: (page: string) => void
}

const menuItems = [
  { icon: Home, label: 'Accueil', page: 'home' },
  { icon: BarChart3, label: 'Dashboard', page: 'dashboard' },
  { icon: Package, label: 'Voyages', page: 'voyages' },
  { icon: Settings, label: 'Configuration', page: 'configuration' },
  { icon: BookOpen, label: 'Guide', page: 'guide' },
  { icon: User, label: 'Profil', page: 'profile' },
]

export function MobileMenu({ isOpen, onClose, currentPage, onPageChange }: MobileMenuProps) {
  const { user, logout } = useAuth()

  // Fonction pour obtenir les initiales
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const handlePageChange = (page: string) => {
    onPageChange?.(page)
    onClose()
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Menu
                </h2>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-lg font-bold text-white">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {user?.name || 'Utilisateur'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.page}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handlePageChange(item.page)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                        currentPage === item.page
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
