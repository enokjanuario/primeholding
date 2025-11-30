import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency, formatPercent } from '../../utils/formatters'

function KPICard({
  title,
  value,
  type = 'currency', // 'currency' | 'percent' | 'number'
  trend = null, // positivo, negativo ou null
  trendValue = null,
  icon: Icon,
  highlight = false,
  loading = false,
}) {
  const formatValue = () => {
    if (loading) return '---'

    switch (type) {
      case 'currency':
        return formatCurrency(value)
      case 'percent':
        return formatPercent(value, 2, true)
      case 'number':
        return value?.toLocaleString('pt-BR') || '0'
      default:
        return value
    }
  }

  const getTrendColor = () => {
    if (trend === null) return 'text-text-muted'
    return trend >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getTrendIcon = () => {
    if (trend === null) return Minus
    return trend >= 0 ? TrendingUp : TrendingDown
  }

  const TrendIcon = getTrendIcon()

  return (
    <div
      className={`
        bg-dark-card border rounded-card p-4
        transition-all duration-200
        ${highlight ? 'border-prime-gold' : 'border-dark-border hover:border-prime-gold-dark'}
        ${loading ? 'animate-pulse' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-text-secondary truncate pr-2">
          {title}
        </h4>
        {Icon && (
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-prime-gold/10 flex items-center justify-center">
            <Icon size={16} className="text-prime-gold" />
          </div>
        )}
      </div>

      <div className={`text-2xl font-bold font-montserrat ${highlight ? 'text-prime-gold' : 'text-text-primary'}`}>
        {formatValue()}
      </div>

      {trendValue !== null && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor()}`}>
          <TrendIcon size={14} />
          <span>{formatPercent(Math.abs(trendValue), 1)}</span>
          <span className="text-text-muted">vs mês anterior</span>
        </div>
      )}
    </div>
  )
}

export default KPICard
