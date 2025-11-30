import { useState, useEffect } from 'react'
import { Check, X, Eye, CheckCheck } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Table, { Pagination } from '../../components/ui/Table'
import Badge, { getStatusVariant } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import resgatesService from '../../services/resgates'
import { CONFIG } from '../../utils/constants'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { unmaskMoney } from '../../utils/validators'

function GestaoResgates() {
  const [resgates, setResgates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [activeTab, setActiveTab] = useState('todos')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = CONFIG.ITEMS_PER_PAGE

  const [showModal, setShowModal] = useState(false)
  const [selectedResgate, setSelectedResgate] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [processData, setProcessData] = useState({
    status: 'Aprovado',
    valorAprovado: '',
    dataEfetiva: new Date().toISOString().split('T')[0],
    observacaoInterna: '',
    mensagemCliente: '',
  })

  useEffect(() => {
    loadResgates()
  }, [])

  const loadResgates = async () => {
    setLoading(true)
    try {
      const response = await resgatesService.listarTodos()
      setResgates(response.dados || [])
    } catch (err) {
      setError(err.message || 'Erro ao carregar resgates')
    } finally {
      setLoading(false)
    }
  }

  const resgatesFiltrados = resgates.filter(resgate => {
    if (activeTab === 'pendentes' && resgate.status !== 'Em análise') return false
    if (activeTab === 'aprovados' && resgate.status !== 'Aprovado') return false
    if (activeTab === 'concluidos' && resgate.status !== 'Concluído') return false
    if (activeTab === 'negados' && resgate.status !== 'Negado') return false
    return true
  })

  const totalPages = Math.ceil(resgatesFiltrados.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = resgatesFiltrados.slice(startIndex, startIndex + itemsPerPage)

  const handleOpenModal = (resgate, action = 'process') => {
    setSelectedResgate({ ...resgate, action })
    setProcessData({
      status: action === 'concluir' ? 'Concluído' : 'Aprovado',
      valorAprovado: formatCurrency(resgate.valorSolicitado).replace('R$', '').trim(),
      dataEfetiva: new Date().toISOString().split('T')[0],
      observacaoInterna: '',
      mensagemCliente: '',
    })
    setShowModal(true)
  }

  const handleProcess = async () => {
    setFormLoading(true)
    setError('')

    try {
      await resgatesService.processar(selectedResgate._id, {
        status: processData.status,
        valorAprovado: processData.status !== 'Negado' ? unmaskMoney(processData.valorAprovado) : 0,
        dataEfetiva: processData.status === 'Concluído' ? processData.dataEfetiva : undefined,
        observacaoInterna: processData.observacaoInterna,
        mensagemCliente: processData.mensagemCliente,
      })

      setSuccess(`Resgate ${processData.status.toLowerCase()} com sucesso!`)
      setShowModal(false)
      loadResgates()
    } catch (err) {
      setError(err.message || 'Erro ao processar resgate')
    } finally {
      setFormLoading(false)
    }
  }

  const tabs = [
    { id: 'todos', label: 'Todos', count: resgates.length },
    { id: 'pendentes', label: 'Pendentes', count: resgates.filter(r => r.status === 'Em análise').length },
    { id: 'aprovados', label: 'Aprovados', count: resgates.filter(r => r.status === 'Aprovado').length },
    { id: 'concluidos', label: 'Concluídos', count: resgates.filter(r => r.status === 'Concluído').length },
    { id: 'negados', label: 'Negados', count: resgates.filter(r => r.status === 'Negado').length },
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
      title: 'Valor',
      render: (value) => (
        <span className="text-red-400">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'banco',
      title: 'Dados Bancários',
      render: (value, row) => (
        <div className="text-sm">
          <p>{value}</p>
          <p className="text-text-muted">Ag: {row.agencia} | Cc: {row.conta}</p>
        </div>
      ),
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
          {row.status === 'Em análise' && (
            <button
              onClick={() => handleOpenModal(row, 'process')}
              className="p-1.5 text-text-muted hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
              title="Processar"
            >
              <Check size={16} />
            </button>
          )}
          {row.status === 'Aprovado' && (
            <button
              onClick={() => handleOpenModal(row, 'concluir')}
              className="p-1.5 text-text-muted hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
              title="Concluir"
            >
              <CheckCheck size={16} />
            </button>
          )}
          <button
            onClick={() => handleOpenModal(row, 'view')}
            className="p-1.5 text-text-muted hover:text-prime-gold hover:bg-prime-gold/10 rounded transition-colors"
            title="Ver detalhes"
          >
            <Eye size={16} />
          </button>
        </div>
      ),
    },
  ]

  const getStatusOptions = () => {
    if (selectedResgate?.action === 'concluir') {
      return [{ value: 'Concluído', label: 'Concluir transferência' }]
    }
    return [
      { value: 'Aprovado', label: 'Aprovar' },
      { value: 'Negado', label: 'Negar' },
    ]
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="font-montserrat text-2xl font-bold text-text-primary mb-6">
        Gestão de Resgates
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
            <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-prime-gold/20' : 'bg-dark-border'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <Card padding={false}>
        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage="Nenhum resgate encontrado"
        />
        {resgatesFiltrados.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={resgatesFiltrados.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          selectedResgate?.action === 'concluir' ? 'Concluir Resgate' :
          selectedResgate?.action === 'view' ? 'Detalhes do Resgate' : 'Processar Resgate'
        }
        size="md"
        footer={
          selectedResgate?.action !== 'view' && ['Em análise', 'Aprovado'].includes(selectedResgate?.status) ? (
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
        {selectedResgate && (
          <div className="space-y-4">
            <div className="p-4 bg-dark-bg rounded-md">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted">Investidor</p>
                  <p className="font-medium">{selectedResgate.investidorNome}</p>
                </div>
                <div>
                  <p className="text-text-muted">Valor</p>
                  <p className="font-medium text-red-400">{formatCurrency(selectedResgate.valorSolicitado)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-text-muted">Dados Bancários</p>
                  <p className="font-medium">
                    {selectedResgate.banco} | Ag: {selectedResgate.agencia} | Cc: {selectedResgate.conta}
                  </p>
                  <p className="text-sm text-text-muted">
                    {selectedResgate.titularConta} - {selectedResgate.cpfCnpjConta}
                  </p>
                </div>
              </div>
            </div>

            {selectedResgate.action !== 'view' && ['Em análise', 'Aprovado'].includes(selectedResgate.status) && (
              <>
                <Select
                  label="Ação"
                  value={processData.status}
                  onChange={(e) => setProcessData(prev => ({ ...prev, status: e.target.value }))}
                  options={getStatusOptions()}
                />

                {processData.status === 'Concluído' && (
                  <Input
                    label="Data Efetiva da Transferência"
                    type="date"
                    value={processData.dataEfetiva}
                    onChange={(e) => setProcessData(prev => ({ ...prev, dataEfetiva: e.target.value }))}
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Mensagem para o Cliente
                  </label>
                  <textarea
                    value={processData.mensagemCliente}
                    onChange={(e) => setProcessData(prev => ({ ...prev, mensagemCliente: e.target.value }))}
                    rows={2}
                    className="w-full bg-dark-input border border-dark-border rounded-input px-4 py-2.5 text-text-primary resize-none"
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

export default GestaoResgates
