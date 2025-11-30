import { useAuth } from '../../hooks/useAuth'
import { useInvestidor } from '../../hooks/useInvestidor'
import Card from '../../components/ui/Card'
import Alert from '../../components/ui/Alert'
import KPIGrid from '../../components/dashboard/KPIGrid'
import MovimentacoesRecentes from '../../components/dashboard/MovimentacoesRecentes'
import EvolucaoPatrimonioChart from '../../components/charts/EvolucaoPatrimonioChart'
import RentabilidadeMensalChart from '../../components/charts/RentabilidadeMensalChart'
import DistribuicaoSCPChart from '../../components/charts/DistribuicaoSCPChart'
import { mockDistribuicaoSCP } from '../../mocks/data'

function Dashboard() {
  const { user } = useAuth()
  const {
    dashboard,
    evolucaoPatrimonio,
    rentabilidadeMensal,
    movimentacoes,
    loading,
    error,
  } = useInvestidor()

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-montserrat text-2xl font-bold text-text-primary">
          Olá, {user?.nome?.split(' ')[0]}!
        </h1>
        <p className="text-text-secondary mt-1">
          Acompanhe seus investimentos e movimentações
        </p>
      </div>

      {/* Erro */}
      {error && (
        <Alert variant="error" message={error} />
      )}

      {/* KPIs */}
      <KPIGrid data={dashboard} loading={loading} />

      {/* Gráficos - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Evolução do Patrimônio">
          <EvolucaoPatrimonioChart dados={evolucaoPatrimonio} />
        </Card>

        <Card title="Distribuição por SCP">
          <DistribuicaoSCPChart dados={mockDistribuicaoSCP} />
        </Card>
      </div>

      {/* Gráfico de rentabilidade */}
      <Card title="Rentabilidade Mensal">
        <RentabilidadeMensalChart dados={rentabilidadeMensal} />
      </Card>

      {/* Movimentações recentes */}
      <MovimentacoesRecentes movimentacoes={movimentacoes} loading={loading} />
    </div>
  )
}

export default Dashboard
