import { useState, useEffect } from 'react'
import { Plus, Search, Download, Edit, Mail, MoreVertical } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Table, { Pagination } from '../../components/ui/Table'
import Badge, { getStatusVariant } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import investidoresService from '../../services/investidores'
import { SCPS, INVESTIDOR_STATUS, CONFIG } from '../../utils/constants'
import { formatCurrency, formatCPF } from '../../utils/formatters'

function GestaoInvestidores() {
  const [investidores, setInvestidores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Filtros
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroScp, setFiltroScp] = useState('')

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = CONFIG.ITEMS_PER_PAGE

  // Modal
  const [showModal, setShowModal] = useState(false)
  const [editingInvestidor, setEditingInvestidor] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    scpsVinculadas: [],
    status: 'Ativo',
  })

  // Máscaras de input
  const maskCPF = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11)
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const maskTelefone = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11)
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }

  // Identificar erros por campo a partir da mensagem
  const parseFieldErrors = (errorMessage) => {
    const errors = {}
    const msg = errorMessage.toLowerCase()
    if (msg.includes('nome')) errors.nome = true
    if (msg.includes('email')) errors.email = true
    if (msg.includes('cpf')) errors.cpf = true
    if (msg.includes('telefone')) errors.telefone = true
    return errors
  }

  useEffect(() => {
    loadInvestidores()
  }, [])

  const loadInvestidores = async () => {
    setLoading(true)
    try {
      const response = await investidoresService.listar()
      setInvestidores(response.dados || [])
    } catch (err) {
      setError(err.message || 'Erro ao carregar investidores')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar investidores
  const investidoresFiltrados = investidores.filter(inv => {
    if (busca) {
      const search = busca.toLowerCase()
      if (!inv.nome?.toLowerCase().includes(search) &&
          !inv.email?.toLowerCase().includes(search) &&
          !inv.cpf?.includes(search)) {
        return false
      }
    }
    if (filtroStatus && inv.status !== filtroStatus) return false
    if (filtroScp && !inv.scpsVinculadas?.includes(filtroScp)) return false
    return true
  })

  // Paginação
  const totalPages = Math.ceil(investidoresFiltrados.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = investidoresFiltrados.slice(startIndex, startIndex + itemsPerPage)

  const handleOpenModal = (investidor = null) => {
    setFormError('')
    setFieldErrors({})
    if (investidor) {
      setEditingInvestidor(investidor)
      setFormData({
        nome: investidor.nome || '',
        email: investidor.email || '',
        cpf: maskCPF(investidor.cpf || ''),
        telefone: maskTelefone(investidor.telefone || ''),
        scpsVinculadas: investidor.scpsVinculadas || [],
        status: investidor.status || 'Ativo',
      })
    } else {
      setEditingInvestidor(null)
      setFormData({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        scpsVinculadas: [],
        status: 'Ativo',
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async () => {
    setFormLoading(true)
    setFormError('')
    setFieldErrors({})

    try {
      if (editingInvestidor) {
        await investidoresService.atualizar(editingInvestidor._id, formData)
        setSuccess('Investidor atualizado com sucesso!')
      } else {
        await investidoresService.criar(formData)
        setSuccess('Investidor criado com sucesso!')
      }
      setShowModal(false)
      loadInvestidores()
    } catch (err) {
      const errorMsg = err.message || 'Erro ao salvar investidor'
      setFormError(errorMsg)
      setFieldErrors(parseFieldErrors(errorMsg))
    } finally {
      setFormLoading(false)
    }
  }

  const handleScpChange = (scp) => {
    setFormData(prev => ({
      ...prev,
      scpsVinculadas: prev.scpsVinculadas.includes(scp)
        ? prev.scpsVinculadas.filter(s => s !== scp)
        : [...prev.scpsVinculadas, scp],
    }))
  }

  const statusOptions = Object.values(INVESTIDOR_STATUS).map(s => ({
    value: s,
    label: s,
  }))

  const columns = [
    {
      key: 'nome',
      title: 'Nome',
      render: (value, row) => (
        <div>
          <p className="font-medium text-text-primary">{value}</p>
          <p className="text-sm text-text-muted">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'cpf',
      title: 'CPF',
      render: (value) => formatCPF(value),
    },
    {
      key: 'scpsVinculadas',
      title: 'SCPs',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value?.map(scp => (
            <Badge key={scp} variant="primary" size="sm">{scp}</Badge>
          )) || '-'}
        </div>
      ),
    },
    {
      key: 'patrimonioAtual',
      title: 'Patrimônio',
      render: (value) => formatCurrency(value || 0),
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
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 text-text-muted hover:text-prime-gold hover:bg-prime-gold/10 rounded transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => {
              // TODO: Implementar reenvio de convite
              alert('Funcionalidade em desenvolvimento')
            }}
            className="p-1.5 text-text-muted hover:text-prime-gold hover:bg-prime-gold/10 rounded transition-colors"
            title="Reenviar convite"
          >
            <Mail size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-montserrat text-2xl font-bold text-text-primary">
          Gestão de Investidores
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<Download size={18} />}
            onClick={() => alert('Exportação em desenvolvimento')}
          >
            Exportar
          </Button>
          <Button
            leftIcon={<Plus size={18} />}
            onClick={() => handleOpenModal()}
          >
            Novo Investidor
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" message={error} onClose={() => setError('')} className="mb-4" />
      )}
      {success && (
        <Alert variant="success" message={success} onClose={() => setSuccess('')} autoClose className="mb-4" />
      )}

      {/* Filtros */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value)
              setCurrentPage(1)
            }}
            leftIcon={<Search size={18} />}
          />
          <Select
            value={filtroStatus}
            onChange={(e) => {
              setFiltroStatus(e.target.value)
              setCurrentPage(1)
            }}
            options={statusOptions}
            placeholder="Status"
          />
          <Select
            value={filtroScp}
            onChange={(e) => {
              setFiltroScp(e.target.value)
              setCurrentPage(1)
            }}
            options={SCPS}
            placeholder="SCP"
          />
          <Button
            variant="ghost"
            onClick={() => {
              setBusca('')
              setFiltroStatus('')
              setFiltroScp('')
              setCurrentPage(1)
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      </Card>

      {/* Tabela */}
      <Card padding={false}>
        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage="Nenhum investidor encontrado"
        />
        {investidoresFiltrados.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={investidoresFiltrados.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingInvestidor ? 'Editar Investidor' : 'Novo Investidor'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} loading={formLoading}>
              {editingInvestidor ? 'Salvar Alterações' : 'Criar Investidor'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && (
            <Alert variant="error" message={formError} onClose={() => setFormError('')} />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
              error={fieldErrors.nome}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled={!!editingInvestidor}
              error={fieldErrors.email}
            />
            <Input
              label="CPF"
              value={formData.cpf}
              onChange={(e) => setFormData(prev => ({ ...prev, cpf: maskCPF(e.target.value) }))}
              placeholder="000.000.000-00"
              required
              disabled={!!editingInvestidor}
              error={fieldErrors.cpf}
              maxLength={14}
            />
            <Input
              label="Telefone"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: maskTelefone(e.target.value) }))}
              placeholder="(00) 00000-0000"
              error={fieldErrors.telefone}
              maxLength={15}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              SCPs Vinculadas
            </label>
            <div className="flex flex-wrap gap-2">
              {SCPS.map(scp => (
                <button
                  key={scp.value}
                  type="button"
                  onClick={() => handleScpChange(scp.value)}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${formData.scpsVinculadas.includes(scp.value)
                      ? 'bg-prime-gold text-dark-bg'
                      : 'bg-dark-border text-text-secondary hover:text-text-primary'
                    }
                  `}
                >
                  {scp.label}
                </button>
              ))}
            </div>
          </div>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            options={statusOptions}
          />
        </div>
      </Modal>
    </div>
  )
}

export default GestaoInvestidores
