import {
  Wallet,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  CalendarDays,
} from 'lucide-react'
import KPICard from './KPICard'
import { SkeletonCard } from '../ui/Loader'

function KPIGrid({ data, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  const kpis = [
    {
      title: 'Patrimônio Atual',
      value: data?.patrimonioAtual || 0,
      type: 'currency',
      icon: Wallet,
      highlight: true,
    },
    {
      title: 'Aportes Acumulados',
      value: data?.aportesAcumulados || 0,
      type: 'currency',
      icon: ArrowUpCircle,
    },
    {
      title: 'Resgates Acumulados',
      value: data?.resgatesAcumulados || 0,
      type: 'currency',
      icon: ArrowDownCircle,
    },
    {
      title: 'Rentabilidade Total',
      value: data?.rentabilidadeTotal || 0,
      type: 'percent',
      trend: data?.rentabilidadeTotal || 0,
      icon: TrendingUp,
    },
    {
      title: 'Rentabilidade no Ano',
      value: data?.rentabilidadeAno || 0,
      type: 'percent',
      trend: data?.rentabilidadeAno || 0,
      icon: Calendar,
    },
    {
      title: 'Rentabilidade no Mês',
      value: data?.rentabilidadeMes || 0,
      type: 'percent',
      trend: data?.rentabilidadeMes || 0,
      icon: CalendarDays,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  )
}

export default KPIGrid
