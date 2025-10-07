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
        {showSidebar && <Sidebar currentPage={currentPage} onPageChange={onPageChange} />}
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex-1 p-4 lg:p-8 ${showSidebar ? 'ml-64' : ''}`}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}