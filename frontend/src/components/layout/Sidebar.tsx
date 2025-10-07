import { motion } from 'framer-motion'
import { 
  Home, 
  BarChart3, 
  Package, 
  Settings, 
  BookOpen, 
  User 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
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

export function Sidebar({ className, currentPage, onPageChange }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40",
        className
      )}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.page}
              onClick={() => onPageChange?.(item.page)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300",
                currentPage === item.page
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>
    </motion.aside>
  )
}