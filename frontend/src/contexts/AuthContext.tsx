import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  location?: string
  isActive: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string, location?: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  // Import de la fonction centralisée
  const getApiBaseUrl = () => {
    if (import.meta.env.PROD) {
      return 'https://importb.onrender.com/api'
    }
    if (import.meta.env.VITE_API_URL) {
      return `${import.meta.env.VITE_API_URL}/api`
    }
    return 'http://localhost:5000/api'
  }

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Important pour les cookies
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.data)
        }
      }
    } catch (error) {
      console.error('Erreur de vérification auth:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: 'POST',
        credentials: 'include', // Important pour les cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.data.user)
      } else {
        throw new Error(data.message || 'Erreur de connexion')
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string, location?: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${getApiBaseUrl()}/auth/register`, {
        method: 'POST',
        credentials: 'include', // Important pour les cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, location }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.data.user)
      } else {
        throw new Error(data.message || 'Erreur d\'inscription')
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Important pour les cookies
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
    } finally {
      setUser(null)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true)
      const response = await fetch(`${getApiBaseUrl()}/auth/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.data)
      } else {
        throw new Error(result.message || 'Erreur de mise à jour')
      }
    } catch (error) {
      console.error('Erreur de mise à jour:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${getApiBaseUrl()}/auth/change-password`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Erreur de changement de mot de passe')
      }
    } catch (error) {
      console.error('Erreur de changement de mot de passe:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}