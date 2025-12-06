import { useState, useEffect, useCallback } from 'react'
import kpisService from '../services/kpis'
import { useAuth } from './useAuth'

export function useInvestidor() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [evolucaoPatrimonio, setEvolucaoPatrimonio] = useState([])
  const [rentabilidadeMensal, setRentabilidadeMensal] = useState([])
  const [distribuicaoSCP, setDistribuicaoSCP] = useState([])
  const [movimentacoes, setMovimentacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carregar dados do dashboard
  const loadDashboard = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const [dashboardData, evolucao, rentabilidade, distribuicao, movs] = await Promise.all([
        kpisService.getDashboard(),
        kpisService.getEvolucaoPatrimonio(),
        kpisService.getRentabilidadeMensal(),
        kpisService.getDistribuicaoSCP(),
        kpisService.getMovimentacoes(5),
      ])

      setDashboard(dashboardData)
      setEvolucaoPatrimonio(evolucao.dados || [])
      setRentabilidadeMensal(rentabilidade.dados || [])
      setDistribuicaoSCP(distribuicao.dados || [])
      setMovimentacoes(movs.dados || [])
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err)
      setError(err.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Carregar ao montar ou quando usuário mudar
  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  // Recarregar dados
  const refresh = useCallback(() => {
    loadDashboard()
  }, [loadDashboard])

  return {
    dashboard,
    evolucaoPatrimonio,
    rentabilidadeMensal,
    distribuicaoSCP,
    movimentacoes,
    loading,
    error,
    refresh,
  }
}

export default useInvestidor
