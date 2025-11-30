import { useState, useEffect } from 'react'
import { Filter, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Table, { Pagination } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import kpisService from '../../services/kpis'
import { CONFIG } from '../../utils/constants'
import { formatDateTime } from '../../utils/formatters'

function Auditoria() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filtros, setFiltros] = useState({
    usuario: '',
    acao: '',
    dataInicio: '',
    dataFim: '',
  })
  const [showFiltros, setShowFiltros] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = CONFIG.ITEMS_PER_PAGE

  const [expandedRow, setExpandedRow] = useState(null)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setLoading(true)
    try {
      const response = await kpisService.getAuditoria(filtros)
      setLogs(response.dados || [])
    } catch (err) {
      setError(err.message || 'Erro ao carregar logs')
    } finally {
      setLoading(false)
    }
  }

  const handleFiltrar = () => {
    setCurrentPage(1)
    loadLogs()
  }

  const handleLimparFiltros = () => {
    setFiltros({
      usuario: '',
      acao: '',
      dataInicio: '',
      dataFim: '',
    })
    setCurrentPage(1)
    loadLogs()
  }

  const getAcaoBadgeColor = (acao) => {
    if (acao.includes('CRIAR') || acao.includes('APROVAR')) return 'success'
    if (acao.includes('NEGAR') || acao.includes('DELETE')) return 'danger'
    if (acao.includes('UPDATE') || acao.includes('EDITAR')) return 'warning'
    return 'info'
  }

  const totalPages = Math.ceil(logs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = logs.slice(startIndex, startIndex + itemsPerPage)

  const acoes = [
    { value: 'LOGIN', label: 'Login' },
    { value: 'CRIAR_INVESTIDOR', label: 'Criar Investidor' },
    { value: 'CRIAR_APORTE', label: 'Criar Aporte' },
    { value: 'APROVAR_APORTE', label: 'Aprovar Aporte' },
    { value: 'NEGAR_APORTE', label: 'Negar Aporte' },
    { value: 'CRIAR_RESGATE', label: 'Solicitar Resgate' },
    { value: 'APROVAR_RESGATE', label: 'Aprovar Resgate' },
    { value: 'CONCLUIR_RESGATE', label: 'Concluir Resgate' },
    { value: 'PUBLICAR_RELATORIO', label: 'Publicar Relatório' },
    { value: 'REGISTRAR_RENTABILIDADE', label: 'Registrar Rentabilidade' },
  ]

  const columns = [
    {
      key: '_createdDate',
      title: 'Data/Hora',
      render: (value) => formatDateTime(value),
    },
    {
      key: 'usuarioNome',
      title: 'Usuário',
      render: (value, row) => (
        <div>
          <p className="font-medium text-text-primary">{value || 'Sistema'}</p>
          <p className="text-sm text-text-muted">{row.usuarioEmail}</p>
        </div>
      ),
    },
    {
      key: 'acao',
      title: 'Ação',
      render: (value) => (
        <Badge variant={getAcaoBadgeColor(value)} size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'entidade',
      title: 'Entidade',
      render: (value, row) => (
        <span className="text-text-secondary">
          {value} {row.entidadeId && `(${row.entidadeId.substring(0, 8)}...)`}
        </span>
      ),
    },
    {
      key: 'ip',
      title: 'IP',
      render: (value) => value || '-',
    },
    {
      key: 'expand',
      title: '',
      render: (_, row) => (
        <button
          onClick={() => setExpandedRow(expandedRow === row._id ? null : row._id)}
          className="p-1 text-text-muted hover:text-text-primary rounded transition-colors"
        >
          {expandedRow === row._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      ),
    },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-montserrat text-2xl font-bold text-text-primary">
          Logs de Auditoria
        </h1>
        <Button
          variant="secondary"
          leftIcon={<Filter size={18} />}
          onClick={() => setShowFiltros(!showFiltros)}
        >
          Filtros
        </Button>
      </div>

      {error && (
        <Alert variant="error" message={error} onClose={() => setError('')} className="mb-4" />
      )}

      {/* Filtros */}
      {showFiltros && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              label="Usuário"
              value={filtros.usuario}
              onChange={(e) => setFiltros(prev => ({ ...prev, usuario: e.target.value }))}
              placeholder="Nome ou email"
            />
            <Select
              label="Ação"
              value={filtros.acao}
              onChange={(e) => setFiltros(prev => ({ ...prev, acao: e.target.value }))}
              options={acoes}
              placeholder="Todas"
            />
            <Input
              label="Data Início"
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
            />
            <Input
              label="Data Fim"
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
            />
            <div className="flex items-end gap-2">
              <Button onClick={handleFiltrar} fullWidth>
                Filtrar
              </Button>
              <Button variant="ghost" onClick={handleLimparFiltros}>
                Limpar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tabela */}
      <Card padding={false}>
        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage="Nenhum log encontrado"
        />

        {/* Linha expandida */}
        {paginatedData.map((log) => (
          expandedRow === log._id && (
            <div key={`detail-${log._id}`} className="px-4 py-3 bg-dark-bg border-t border-dark-border">
              <h4 className="text-sm font-medium text-text-primary mb-2">Detalhes:</h4>
              <pre className="text-xs text-text-muted bg-dark-card p-3 rounded-md overflow-x-auto">
                {JSON.stringify(JSON.parse(log.detalhes || '{}'), null, 2)}
              </pre>
            </div>
          )
        ))}

        {logs.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={logs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </div>
  )
}

export default Auditoria
