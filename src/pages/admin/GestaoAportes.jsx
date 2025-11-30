import { useState, useEffect } from 'react'
import { Check, X, Eye, Filter } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Table, { Pagination } from '../../components/ui/Table'
import Badge, { getStatusVariant } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import aportesService from '../../services/aportes'
import { SCPS, APORTE_STATUS, CONFIG } from '../../utils/constants'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { unmaskMoney } from '../../utils/validators'

function GestaoAportes() {
  const [aportes, setAportes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Filtros
  const [filtroStatus, setFiltroStatus] = useState('')
  const [activeTab, setActiveTab] = useState('todos')

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = CONFIG.ITEMS_PER_PAGE

  // Modal de processamento
  const [showModal, setShowModal] = useState(false)
  const [selectedAporte, setSelectedAporte] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [processData, setProcessData] = useState({
    status: 'Aprovado',
    valorAprovado: '',
    observacaoInterna: '',
    mensagemCliente: '',
  })

  useEffect(() => {
    loadAportes()
  }, [])

  const loadAportes = async () => {
    setLoading(true)
    try {
      const response = await aportesService.listarTodos()
      setAportes(response.dados || [])
    } catch (err) {
      setError(err.message || 'Erro ao carregar aportes')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar por tab e status
  const aportesFiltrados = aportes.filter(aporte => {
    if (activeTab === 'pendentes' && aporte.status !== 'Em análise') return false
    if (activeTab === 'aprovados' && !['Aprovado', 'Parcialmente aprovado'].includes(aporte.status)) return false
    if (activeTab === 'negados' && aporte.status !== 'Negado') return false
    return true
  })

  // Paginação
  const totalPages = Math.ceil(aportesFiltrados.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = aportesFiltrados.slice(startIndex, startIndex + itemsPerPage)

  const handleOpenModal = (aporte) => {
    setSelectedAporte(aporte)
    setProcessData({
      status: 'Aprovado',
      valorAprovado: formatCurrency(aporte.valorSolicitado).replace('R$', '').trim(),
      observacaoInterna: '',
      mensagemCliente: '',
    })
    setShowModal(true)
  }

  const handleProcess = async () => {
    setFormLoading(true)
    setError('')

    try {
      await aportesService.processar(selectedAporte._id, {
        status: processData.status,
        valorAprovado: processData.status !== 'Negado' ? unmaskMoney(processData.valorAprovado) : 0,
        observacaoInterna: processData.observacaoInterna,
        mensagemCliente: processData.mensagemCliente,
      })

      setSuccess(`Aporte ${processData.status.toLowerCase()} com sucesso!`)
      setShowModal(false)
      loadAportes()
    } catch (err) {
      setError(err.message || 'Erro ao processar aporte')
    } finally {
      setFormLoading(false)
    }
  }

  const tabs = [
    { id: 'todos', label: 'Todos', count: aportes.length },
    { id: 'pendentes', label: 'Pendentes', count: aportes.filter(a => a.status === 'Em análise').length },
    { id: 'aprovados', label: 'Aprovados', count: aportes.filter(a => ['Aprovado', 'Parcialmente aprovado'].includes(a.status)).length },
    { id: 'negados', label: 'Negados', count: aportes.filter(a => a.status === 'Negado').length },
  ]

  const statusOptions = [
    { value: 'Aprovado', label: 'Aprovar' },
    { value: 'Parcialmente aprovado', label: 'Aprovar parcialmente' },
    { value: 'Negado', label: 'Negar' },
  ]

  const columns = [
    {
      key: 'investidorNome',
      title: 'Investidor',
      render: (value, row) => (
        <div>
          <p className="font-medium text-text-primary">{value || 'N/A'}</p>
          <p className="text-sm text-text-muted">{row.investidorEmail}</p>
        </div>
      ),
    },
    {
      key: 'scp',
      title: 'SCP',
    },
    {
      key: 'valorSolicitado',
      title: 'Valor Solicitado',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'valorAprovado',
      title: 'Valor Aprovado',
      render: (value) => value ? formatCurrency(value) : '-',
    },
    {
      key: '_createdDate',
      title: 'Data',
      render: (value) => formatDate(value),
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
      key: 'acoes',
      title: 'Ações',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          {row.status === 'Em análise' ? (
            <>
              <button
                onClick={() => handleOpenModal(row)}
                className="p-1.5 text-text-muted hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                title="Processar"
              >
                <Check size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => handleOpenModal(row)}
              className="p-1.5 text-text-muted hover:text-prime-gold hover:bg-prime-gold/10 rounded transition-colors"
              title="Ver detalhes"
            >
              <Eye size={16} />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="animate-fadeIn">
      <h1 className="font-montserrat text-2xl font-bold text-text-primary mb-6">
        Gestão de Aportes
      </h1>

      {error && (
        <Alert variant="error" message={error} onClose={() => setError('')} className="mb-4" />
      )}
      {success && (
        <Alert variant="success" message={success} onClose={() => setSuccess('')} autoClose className="mb-4" />
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setCurrentPage(1)
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-colors
              ${activeTab === tab.id
                ? 'bg-prime-gold/10 text-prime-gold border border-prime-gold/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
              }
            `}
          >
            {tab.label}
            <span className={`
              px-2 py-0.5 text-xs rounded-full
              ${activeTab === tab.id ? 'bg-prime-gold/20' : 'bg-dark-border'}
            `}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tabela */}
      <Card padding={false}>
        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage="Nenhum aporte encontrado"
        />
        {aportesFiltrados.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={aportesFiltrados.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      {/* Modal de Processamento */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Processar Aporte"
        size="md"
        footer={
          selectedAporte?.status === 'Em análise' ? (
            <>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleProcess} loading={formLoading}>
                Confirmar
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Fechar
            </Button>
          )
        }
      >
        {selectedAporte && (
          <div className="space-y-4">
            {/* Dados do aporte */}
            <div className="p-4 bg-dark-bg rounded-md">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted">Investidor</p>
                  <p className="font-medium">{selectedAporte.investidorNome}</p>
                </div>
                <div>
                  <p className="text-text-muted">SCP</p>
                  <p className="font-medium">{selectedAporte.scp}</p>
                </div>
                <div>
                  <p className="text-text-muted">Valor Solicitado</p>
                  <p className="font-medium text-prime-gold">{formatCurrency(selectedAporte.valorSolicitado)}</p>
                </div>
                <div>
                  <p className="text-text-muted">Data</p>
                  <p className="font-medium">{formatDate(selectedAporte._createdDate)}</p>
                </div>
              </div>
            </div>

            {selectedAporte.status === 'Em análise' && (
              <>
                <Select
                  label="Ação"
                  value={processData.status}
                  onChange={(e) => setProcessData(prev => ({ ...prev, status: e.target.value }))}
                  options={statusOptions}
                />

                {processData.status !== 'Negado' && (
                  <Input
                    label="Valor a Aprovar"
                    value={processData.valorAprovado}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '')
                      if (value) {
                        value = (parseInt(value) / 100).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })
                      }
                      setProcessData(prev => ({ ...prev, valorAprovado: value }))
                    }}
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Observação Interna (não visível ao cliente)
                  </label>
                  <textarea
                    value={processData.observacaoInterna}
                    onChange={(e) => setProcessData(prev => ({ ...prev, observacaoInterna: e.target.value }))}
                    rows={2}
                    className="w-full bg-dark-input border border-dark-border rounded-input px-4 py-2.5 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-prime-gold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Mensagem para o Cliente
                  </label>
                  <textarea
                    value={processData.mensagemCliente}
                    onChange={(e) => setProcessData(prev => ({ ...prev, mensagemCliente: e.target.value }))}
                    rows={2}
                    className="w-full bg-dark-input border border-dark-border rounded-input px-4 py-2.5 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-prime-gold resize-none"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default GestaoAportes
