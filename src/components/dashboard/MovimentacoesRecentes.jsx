import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import Badge, { getStatusVariant } from '../ui/Badge'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { SkeletonTable } from '../ui/Loader'

function MovimentacoesRecentes({ movimentacoes = [], loading = false }) {
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Aporte':
        return 'text-green-400'
      case 'Resgate':
        return 'text-red-400'
      case 'Lucro':
        return 'text-prime-gold'
      default:
        return 'text-text-primary'
    }
  }

  return (
    <Card
      title="Movimentações Recentes"
      headerAction={
        <Link
          to="/historico"
          className="flex items-center gap-1 text-sm text-prime-gold hover:text-prime-gold-light transition-colors"
        >
          Ver histórico completo
          <ArrowRight size={14} />
        </Link>
      }
      padding={false}
    >
      {loading ? (
        <SkeletonTable rows={5} columns={4} />
      ) : movimentacoes.length === 0 ? (
        <div className="p-8 text-center text-text-muted">
          Nenhuma movimentação encontrada
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                  SCP
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-text-secondary">
                  Valor
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-text-secondary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {movimentacoes.map((mov) => (
                <tr
                  key={mov._id}
                  className="hover:bg-dark-border/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-text-primary">
                    {formatDate(mov.data)}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium ${getTipoColor(mov.tipo)}`}>
                    {mov.tipo}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {mov.scp}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${
                    mov.valor >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(mov.valor, true)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={getStatusVariant(mov.status)} size="sm">
                      {mov.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

export default MovimentacoesRecentes
