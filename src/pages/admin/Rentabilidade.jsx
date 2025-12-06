import { useState, useEffect } from 'react'
import { Plus, TrendingUp } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Table, { Pagination } from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import Loader from '../../components/ui/Loader'
import kpisService from '../../services/kpis'
import { SCPS, MESES, CONFIG } from '../../utils/constants'
import { formatPercent } from '../../utils/formatters'

function Rentabilidade() {
  const [rentabilidades, setRentabilidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [filtroMes, setFiltroMes] = useState('')
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear().toString())
  const [filtroScp, setFiltroScp] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = CONFIG.ITEMS_PER_PAGE

  const [showModal, setShowModal] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formData, setFormData] = useState({
    mes: (new Date().getMonth() + 1).toString(),
    ano: new Date().getFullYear().toString(),
    scp: '',
    rentabilidadePercent: '',
    aplicarParaTodos: true,
  })

  const currentYear = new Date().getFullYear()
  const anos = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }))

  // Identificar erros por campo a partir da mensagem
  const parseFieldErrors = (errorMessage) => {
    const errors = {}
    const msg = errorMessage.toLowerCase()
    if (msg.includes('scp')) errors.scp = true
    if (msg.includes('rentabilidade') || msg.includes('percentual')) errors.rentabilidadePercent = true
    if (msg.includes('mês') || msg.includes('mes')) errors.mes = true
    if (msg.includes('ano')) errors.ano = true
    return errors
  }

  useEffect(() => {
    loadRentabilidades()
  }, [filtroMes, filtroAno, filtroScp])

  const loadRentabilidades = async () => {
    setLoading(true)
    try {
      const response = await kpisService.listarRentabilidades({
        mes: filtroMes || undefined,
        ano: filtroAno || undefined,
        scp: filtroScp || undefined,
      })
      setRentabilidades(response.dados || [])
    } catch (err) {
      setError(err.message || 'Erro ao carregar rentabilidades')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setFormError('')
    setFieldErrors({})
    setFormData({
      mes: (new Date().getMonth() + 1).toString(),
      ano: new Date().getFullYear().toString(),
      scp: '',
      rentabilidadePercent: '',
      aplicarParaTodos: true,
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    setFormLoading(true)
    setFormError('')
    setFieldErrors({})

    // Validação local
    if (!formData.scp || !formData.rentabilidadePercent) {
      const errors = {}
      if (!formData.scp) errors.scp = true
      if (!formData.rentabilidadePercent) errors.rentabilidadePercent = true
      setFormError('Preencha todos os campos obrigatórios')
      setFieldErrors(errors)
      setFormLoading(false)
      return
    }

    try {
      await kpisService.registrarRentabilidade({
        mes: parseInt(formData.mes),
        ano: parseInt(formData.ano),
        scp: formData.scp,
        rentabilidadePercent: parseFloat(formData.rentabilidadePercent.replace(',', '.')),
        aplicarParaTodos: formData.aplicarParaTodos,
      })

      setSuccess('Rentabilidade registrada com sucesso!')
      setShowModal(false)
      loadRentabilidades()
    } catch (err) {
      const errorMsg = err.message || 'Erro ao registrar rentabilidade'
      setFormError(errorMsg)
      setFieldErrors(parseFieldErrors(errorMsg))
    } finally {
      setFormLoading(false)
    }
  }

  const totalPages = Math.ceil(rentabilidades.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = rentabilidades.slice(startIndex, startIndex + itemsPerPage)

  const columns = [
    {
      key: 'mesAno',
      title: 'Período',
      render: (value, row) => `${MESES.find(m => m.value === row.mes)?.label || row.mes}/${row.ano}`,
    },
    {
      key: 'scp',
      title: 'SCP',
    },
    {
      key: 'rentabilidadePercent',
      title: 'Rentabilidade',
      render: (value) => (
        <span className={value >= 0 ? 'text-green-400' : 'text-red-400'}>
          {formatPercent(value, 2, true)}
        </span>
      ),
    },
    {
      key: 'investidorNome',
      title: 'Investidor',
      render: (value) => value || 'Todos',
    },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-montserrat text-2xl font-bold text-text-primary">
          Rentabilidade
        </h1>
        <Button leftIcon={<Plus size={18} />} onClick={handleOpenModal}>
          Registrar Rentabilidade
        </Button>
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
          <Select
            label="Mês"
            value={filtroMes}
            onChange={(e) => {
              setFiltroMes(e.target.value)
              setCurrentPage(1)
            }}
            options={MESES.map(m => ({ value: m.value.toString(), label: m.label }))}
            placeholder="Todos"
          />
          <Select
            label="Ano"
            value={filtroAno}
            onChange={(e) => {
              setFiltroAno(e.target.value)
              setCurrentPage(1)
            }}
            options={anos}
          />
          <Select
            label="SCP"
            value={filtroScp}
            onChange={(e) => {
              setFiltroScp(e.target.value)
              setCurrentPage(1)
            }}
            options={SCPS}
            placeholder="Todas"
          />
          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={() => {
                setFiltroMes('')
                setFiltroAno(new Date().getFullYear().toString())
                setFiltroScp('')
                setCurrentPage(1)
              }}
              fullWidth
            >
              Limpar
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabela */}
      <Card padding={false}>
        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage="Nenhuma rentabilidade registrada"
        />
        {rentabilidades.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={rentabilidades.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Registrar Rentabilidade"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} loading={formLoading}>
              Registrar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && (
            <Alert variant="error" message={formError} onClose={() => setFormError('')} />
          )}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Mês"
              value={formData.mes}
              onChange={(e) => setFormData(prev => ({ ...prev, mes: e.target.value }))}
              options={MESES.map(m => ({ value: m.value.toString(), label: m.label }))}
              required
              error={fieldErrors.mes}
            />
            <Select
              label="Ano"
              value={formData.ano}
              onChange={(e) => setFormData(prev => ({ ...prev, ano: e.target.value }))}
              options={anos}
              required
              error={fieldErrors.ano}
            />
          </div>

          <Select
            label="SCP"
            value={formData.scp}
            onChange={(e) => setFormData(prev => ({ ...prev, scp: e.target.value }))}
            options={SCPS}
            placeholder="Selecione a SCP"
            required
            error={fieldErrors.scp}
          />

          <Input
            label="Rentabilidade (%)"
            value={formData.rentabilidadePercent}
            onChange={(e) => setFormData(prev => ({ ...prev, rentabilidadePercent: e.target.value }))}
            placeholder="Ex: 2,5"
            helperText={fieldErrors.rentabilidadePercent ? undefined : "Use valores negativos para perdas"}
            required
            error={fieldErrors.rentabilidadePercent}
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.aplicarParaTodos}
              onChange={(e) => setFormData(prev => ({ ...prev, aplicarParaTodos: e.target.checked }))}
              className="w-4 h-4 rounded border-dark-border bg-dark-input text-prime-gold"
            />
            <span className="text-sm text-text-secondary">
              Aplicar para todos os investidores desta SCP
            </span>
          </label>
        </div>
      </Modal>
    </div>
  )
}

export default Rentabilidade
