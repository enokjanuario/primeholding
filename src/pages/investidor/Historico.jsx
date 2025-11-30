import { useState, useEffect } from 'react'
import { Filter, Download } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Table, { Pagination } from '../../components/ui/Table'
import Badge, { getStatusVariant } from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import kpisService from '../../services/kpis'
import { SCPS, MOVIMENTACAO_TIPOS, CONFIG } from '../../utils/constants'
import { formatCurrency, formatDate } from '../../utils/formatters'

function Historico() {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filtros
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    tipo: '',
    scp: '',
  })
  const [showFiltros, setShowFiltros] = useState(false)

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = CONFIG.ITEMS_PER_PAGE

  useEffect(() => {
    loadMovimentacoes()
  }, [])

  const loadMovimentacoes = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await kpisService.getMovimentacoes(100)
      setMovimentacoes(response.dados || [])
    } catch (err) {
      setError(err.message || 'Erro ao carregar histórico')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar movimentações
  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    if (filtros.tipo && mov.tipo !== filtros.tipo) return false
    if (filtros.scp && mov.scp !== filtros.scp) return false
    if (filtros.dataInicio && new Date(mov.data) < new Date(filtros.dataInicio)) return false
    if (filtros.dataFim && new Date(mov.data) > new Date(filtros.dataFim)) return false
    return true
  })

  // Paginação
  const totalPages = Math.ceil(movimentacoesFiltradas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = movimentacoesFiltradas.slice(startIndex, startIndex + itemsPerPage)

  const handleFiltroChange = (e) => {
    const { name, value } = e.target
    setFiltros(prev => ({ ...prev, [name]: value }))
    setCurrentPage(1)
  }

  const limparFiltros = () => {
    setFiltros({
      dataInicio: '',
      dataFim: '',
      tipo: '',
      scp: '',
    })
    setCurrentPage(1)
  }

  const tiposOptions = Object.values(MOVIMENTACAO_TIPOS).map(tipo => ({
    value: tipo,
    label: tipo,
  }))

  const columns = [
    {
      key: 'data',
      title: 'Data',
      render: (value) => formatDate(value),
    },
    {
      key: 'tipo',
      title: 'Tipo',
      render: (value) => (
        <span className={`font-medium ${
          value === 'Aporte' || value === 'Lucro' ? 'text-green-400' :
          value === 'Resgate' ? 'text-red-400' :
          'text-text-primary'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'scp',
      title: 'SCP',
    },
    {
      key: 'valor',
      title: 'Valor',
      cellClassName: 'text-right',
      render: (value) => (
        <span className={value >= 0 ? 'text-green-400' : 'text-red-400'}>
          {formatCurrency(value, true)}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <Badge variant={getStatusVariant(value)} size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'descricao',
      title: 'Observações',
      render: (value) => (
        <span className="text-text-muted">{value || '-'}</span>
      ),
    },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-montserrat text-2xl font-bold text-text-primary">
            Histórico Financeiro
          </h1>
          <p className="text-text-secondary mt-1">
            Visualize todas as suas movimentações
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            leftIcon={<Filter size={18} />}
            onClick={() => setShowFiltros(!showFiltros)}
          >
            Filtros
          </Button>
          <Button
            variant="outline"
            leftIcon={<Download size={18} />}
            onClick={() => {
              // TODO: Implementar exportação
              alert('Funcionalidade em desenvolvimento')
            }}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFiltros && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              label="Data Início"
              type="date"
              name="dataInicio"
              value={filtros.dataInicio}
              onChange={handleFiltroChange}
            />
            <Input
              label="Data Fim"
              type="date"
              name="dataFim"
              value={filtros.dataFim}
              onChange={handleFiltroChange}
            />
            <Select
              label="Tipo"
              name="tipo"
              value={filtros.tipo}
              onChange={handleFiltroChange}
              options={tiposOptions}
              placeholder="Todos"
            />
            <Select
              label="SCP"
              name="scp"
              value={filtros.scp}
              onChange={handleFiltroChange}
              options={SCPS}
              placeholder="Todas"
            />
            <div className="flex items-end">
              <Button variant="ghost" onClick={limparFiltros} fullWidth>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </Card>
      )}

      {error && (
        <Alert variant="error" message={error} className="mb-6" />
      )}

      <Card padding={false}>
        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage="Nenhuma movimentação encontrada"
        />
        {movimentacoesFiltradas.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={movimentacoesFiltradas.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </div>
  )
}

export default Historico
