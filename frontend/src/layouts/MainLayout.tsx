import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'

interface MainLayoutProps {
  children: ReactNode
  showSidebar?: boolean
  currentPage?: string
  onPageChange?: (page: string) => void
}

export function MainLayout({ children, showSidebar = true, currentPage, onPageChange }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar currentPage={currentPage} onPageChange={onPageChange} />
      
      <div className="flex">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        {showSidebar && (
          <div className="hidden lg:block">
            <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
          </div>
        )}
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`
            flex-1 
            p-4 sm:p-6 lg:p-8 xl:p-10
            pt-20 sm:pt-22 lg:pt-4
            ${showSidebar ? 'lg:ml-64' : ''}
            min-h-screen
            transition-all duration-300
          `}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  )
}