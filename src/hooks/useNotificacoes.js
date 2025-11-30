import { useState, useEffect, useCallback } from 'react'
import notificacoesService from '../services/notificacoes'
import { useAuth } from './useAuth'

export function useNotificacoes() {
  const { user } = useAuth()
  const [notificacoes, setNotificacoes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Contagem de não lidas
  const unreadCount = notificacoes.filter(n => !n.lida).length

  // Carregar notificações
  const loadNotificacoes = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await notificacoesService.listar()
      setNotificacoes(response.dados || [])
    } catch (err) {
      console.error('Erro ao carregar notificações:', err)
      setError(err.message || 'Erro ao carregar notificações')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Carregar ao montar
  useEffect(() => {
    loadNotificacoes()
  }, [loadNotificacoes])

  // Marcar como lida
  const marcarComoLida = useCallback(async (id) => {
    try {
      await notificacoesService.marcarComoLida(id)
      setNotificacoes(prev =>
        prev.map(n => n._id === id ? { ...n, lida: true } : n)
      )
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err)
      throw err
    }
  }, [])

  // Marcar todas como lidas
  const marcarTodasComoLidas = useCallback(async () => {
    try {
      await notificacoesService.marcarTodasComoLidas()
      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err)
      throw err
    }
  }, [])

  // Recarregar
  const refresh = useCallback(() => {
    loadNotificacoes()
  }, [loadNotificacoes])

  return {
    notificacoes,
    unreadCount,
    loading,
    error,
    marcarComoLida,
    marcarTodasComoLidas,
    refresh,
  }
}

export default useNotificacoes
