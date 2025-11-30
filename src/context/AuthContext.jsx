import { createContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/auth'
import { getToken, removeToken } from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken()

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const userData = await authService.getMe()
        setUser(userData)
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err)
        removeToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login
  const login = useCallback(async (email, senha) => {
    setError(null)
    setLoading(true)

    try {
      const response = await authService.login(email, senha)
      setUser(response.investidor)
      return response
    } catch (err) {
      setError(err.message || 'Erro ao fazer login')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout
  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setError(null)
  }, [])

  // Atualizar dados do usuário
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getMe()
      setUser(userData)
      return userData
    } catch (err) {
      console.error('Erro ao atualizar dados do usuário:', err)
      throw err
    }
  }, [])

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
