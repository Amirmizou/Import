import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Sparkles, LogOut, User, ChevronDown, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface NavbarProps {
  className?: string
  currentPage?: string
  onPageChange?: (page: string) => void
}

export function Navbar({ className, currentPage, onPageChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { isDark, toggleTheme } = useDarkMode()
  const { user, logout } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Fonction pour tronquer le nom d'utilisateur
  const truncateName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name
    return name.substring(0, maxLength) + '...'
  }

  // Fonction pour obtenir les initiales
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Fermer le menu utilisateur quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navItems = [
    { name: 'Accueil', page: 'home' },
    { name: 'Dashboard', page: 'dashboard' },
    { name: 'Voyages', page: 'voyages' },
    { name: 'Configuration', page: 'configuration' },
    { name: 'Guide', page: 'guide' },
    { name: 'Profil', page: 'profile' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 dark:bg-gray-900/90 dark:border-gray-700/50 shadow-sm",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <div className="relative">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <span className="hidden sm:inline">MicroImport Pro</span>
                <span className="sm:hidden">MIP</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">
                Gestion d'import
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => onPageChange?.(item.page)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium transition-all duration-300 relative",
                  currentPage === item.page
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                    : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {item.name}
                {currentPage === item.page && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* User Menu & Theme Toggle */}
          <div className="flex items-center space-x-3">

            {/* User Menu Dropdown */}
            <div className="relative hidden md:block" ref={userMenuRef}>
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-white">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white max-w-32 truncate">
                    {user?.name ? truncateName(user.name, 15) : 'Utilisateur'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 max-w-32 truncate">
                    {user?.email ? truncateName(user.email, 20) : 'user@example.com'}
                  </span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 text-gray-500 transition-transform duration-200",
                  isUserMenuOpen && "rotate-180"
                )} />
              </motion.button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {user?.name ? getInitials(user.name) : 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.name || 'Utilisateur'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onPageChange?.('profile')
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center space-x-3"
                      >
                        <User className="h-4 w-4" />
                        <span>Mon Profil</span>
                      </button>
                      <button
                        onClick={() => {
                          onPageChange?.('settings')
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center space-x-3"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Paramètres</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                      <button
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 flex items-center space-x-3"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <motion.div 
              className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Switch
                checked={isDark}
                onCheckedChange={toggleTheme}
                aria-label="Toggle dark mode"
              />
              <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-xl"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </motion.nav>
  )
}