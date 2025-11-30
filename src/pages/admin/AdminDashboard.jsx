import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Wallet, PiggyBank, TrendingUp, ArrowRight, Check, X } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import kpisService from '../../services/kpis'
import aportesService from '../../services/aportes'
import resgatesService from '../../services/resgates'
import { formatCurrency, formatDate } from '../../utils/formatters'

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await kpisService.getAdminDashboard()
      setDashboard(data)
    } catch (err) {
      setError(err.message || 'Erro ao carregar dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleAprovarAporte = async (id, valor) => {
    setActionLoading(id)
    try {
      await aportesService.aprovar(id, valor)
      loadDashboard()
    } catch (err) {
      setError(err.message || 'Erro ao aprovar aporte')
    } finally {
      setActionLoading(null)
    }
  }

  const handleAprovarResgate = async (id, valor) => {
    setActionLoading(id)
    try {
      await resgatesService.aprovar(id, valor)
      loadDashboard()
    } catch (err) {
      setError(err.message || 'Erro ao aprovar resgate')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    )
  }

  const kpis = [
    {
      title: 'Investidores Ativos',
      value: dashboard?.totalInvestidores || 0,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Patrimônio Total',
      value: formatCurrency(dashboard?.patrimonioTotal || 0),
      icon: Wallet,
      color: 'text-prime-gold',
      bgColor: 'bg-prime-gold/10',
    },
    {
      title: 'Aportes Pendentes',
      value: dashboard?.aportesPendentes || 0,
      icon: PiggyBank,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      badge: true,
    },
    {
      title: 'Resgates Pendentes',
      value: dashboard?.resgatesPendentes || 0,
      icon: TrendingUp,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      badge: true,
    },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="font-montserrat text-2xl font-bold text-text-primary">
        Dashboard Administrativo
      </h1>

      {error && (
        <Alert variant="error" message={error} onClose={() => setError('')} />
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${kpi.bgColor} flex items-center justify-center`}>
                <kpi.icon className={kpi.color} size={24} />
              </div>
              <div>
                <p className="text-sm text-text-secondary">{kpi.title}</p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold font-montserrat ${
                    kpi.badge && kpi.value > 0 ? kpi.color : 'text-text-primary'
                  }`}>
                    {kpi.value}
                  </p>
                  {kpi.badge && kpi.value > 0 && (
                    <Badge variant="warning" size="sm">Pendente</Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Listas de pendentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aportes Pendentes */}
        <Card
          title="Aportes Pendentes"
          headerAction={
            <Link
              to="/admin/aportes"
              className="flex items-center gap-1 text-sm text-prime-gold hover:text-prime-gold-light"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          }
          padding={false}
        >
          {dashboard?.ultimosAportes?.length === 0 ? (
            <div className="p-6 text-center text-text-muted">
              Nenhum aporte pendente
            </div>
          ) : (
            <div className="divide-y divide-dark-border">
              {dashboard?.ultimosAportes?.slice(0, 5).map((aporte) => (
                <div key={aporte._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">
                      {aporte.investidorNome || 'Investidor'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {aporte.scp} • {formatDate(aporte._createdDate)}
                    </p>
                    <p className="text-lg font-semibold text-prime-gold mt-1">
                      {formatCurrency(aporte.valorSolicitado)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      leftIcon={<Check size={14} />}
                      onClick={() => handleAprovarAporte(aporte._id, aporte.valorSolicitado)}
                      loading={actionLoading === aporte._id}
                    >
                      Aprovar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Resgates Pendentes */}
        <Card
          title="Resgates Pendentes"
          headerAction={
            <Link
              to="/admin/resgates"
              className="flex items-center gap-1 text-sm text-prime-gold hover:text-prime-gold-light"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          }
          padding={false}
        >
          {dashboard?.ultimosResgates?.length === 0 ? (
            <div className="p-6 text-center text-text-muted">
              Nenhum resgate pendente
            </div>
          ) : (
            <div className="divide-y divide-dark-border">
              {dashboard?.ultimosResgates?.slice(0, 5).map((resgate) => (
                <div key={resgate._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">
                      {resgate.investidorNome || 'Investidor'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {resgate.scp} • {formatDate(resgate._createdDate)}
                    </p>
                    <p className="text-lg font-semibold text-red-400 mt-1">
                      {formatCurrency(resgate.valorSolicitado)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      leftIcon={<Check size={14} />}
                      onClick={() => handleAprovarResgate(resgate._id, resgate.valorSolicitado)}
                      loading={actionLoading === resgate._id}
                    >
                      Aprovar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
