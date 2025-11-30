import { useState, useEffect } from 'react'
import { Plus, FileText, Download, Trash2, Upload } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import Loader from '../../components/ui/Loader'
import relatoriosService from '../../services/relatorios'
import { RELATORIO_TIPOS, SCPS, MESES } from '../../utils/constants'
import { formatDate } from '../../utils/formatters'

function GestaoRelatorios() {
  const [relatorios, setRelatorios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    descricao: '',
    mesReferencia: '',
    anoReferencia: new Date().getFullYear().toString(),
    scp: '',
    visibilidade: 'Todos',
    notificarEmail: false,
  })

  const currentYear = new Date().getFullYear()
  const anos = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }))

  useEffect(() => {
    loadRelatorios()
  }, [])

  const loadRelatorios = async () => {
    setLoading(true)
    try {
      const response = await relatoriosService.listarTodos()
      setRelatorios(response.dados || [])
    } catch (err) {
      setError(err.message || 'Erro ao carregar relatórios')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setFormData({
      titulo: '',
      tipo: '',
      descricao: '',
      mesReferencia: '',
      anoReferencia: new Date().getFullYear().toString(),
      scp: '',
      visibilidade: 'Todos',
      notificarEmail: false,
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.tipo) {
      setError('Preencha os campos obrigatórios')
      return
    }

    setFormLoading(true)
    setError('')

    try {
      const mesAnoReferencia = formData.mesReferencia && formData.anoReferencia
        ? `${formData.mesReferencia.padStart(2, '0')}/${formData.anoReferencia}`
        : ''

      await relatoriosService.publicar({
        titulo: formData.titulo,
        tipo: formData.tipo,
        descricao: formData.descricao,
        mesAnoReferencia,
        scp: formData.scp || undefined,
        visibilidade: formData.visibilidade,
        arquivoPdf: 'https://example.com/placeholder.pdf', // Em produção: upload real
      })

      setSuccess('Relatório publicado com sucesso!')
      setShowModal(false)
      loadRelatorios()
    } catch (err) {
      setError(err.message || 'Erro ao publicar relatório')
    } finally {
      setFormLoading(false)
    }
  }

  const getTipoBadgeColor = (tipo) => {
    switch (tipo) {
      case 'Relatório Mensal': return 'primary'
      case 'Relatório Trimestral': return 'info'
      case 'Relatório Anual': return 'success'
      default: return 'default'
    }
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-montserrat text-2xl font-bold text-text-primary">
          Gestão de Relatórios
        </h1>
        <Button leftIcon={<Plus size={18} />} onClick={handleOpenModal}>
          Publicar Relatório
        </Button>
      </div>

      {error && (
        <Alert variant="error" message={error} onClose={() => setError('')} className="mb-4" />
      )}
      {success && (
        <Alert variant="success" message={success} onClose={() => setSuccess('')} autoClose className="mb-4" />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : relatorios.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Nenhum relatório publicado
            </h3>
            <p className="text-text-secondary mb-4">
              Clique no botão acima para publicar o primeiro relatório.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatorios.map((relatorio) => (
            <Card key={relatorio._id} hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={24} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary truncate">
                    {relatorio.titulo}
                  </h3>
                  <Badge variant={getTipoBadgeColor(relatorio.tipo)} size="sm" className="mt-1">
                    {relatorio.tipo}
                  </Badge>
                  <p className="text-sm text-text-muted mt-2">
                    {formatDate(relatorio.dataPublicacao)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-dark-border">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download size={14} />}
                  onClick={() => window.open(relatorio.arquivoPdf, '_blank')}
                  fullWidth
                >
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Publicar Novo Relatório"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} loading={formLoading}>
              Publicar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Título"
            value={formData.titulo}
            onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            placeholder="Ex: Relatório Mensal - Janeiro 2025"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipo"
              value={formData.tipo}
              onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
              options={RELATORIO_TIPOS}
              placeholder="Selecione o tipo"
              required
            />
            <Select
              label="SCP (opcional)"
              value={formData.scp}
              onChange={(e) => setFormData(prev => ({ ...prev, scp: e.target.value }))}
              options={SCPS}
              placeholder="Todas as SCPs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Mês de Referência"
              value={formData.mesReferencia}
              onChange={(e) => setFormData(prev => ({ ...prev, mesReferencia: e.target.value }))}
              options={MESES.map(m => ({ value: m.value.toString(), label: m.label }))}
              placeholder="Selecione"
            />
            <Select
              label="Ano de Referência"
              value={formData.anoReferencia}
              onChange={(e) => setFormData(prev => ({ ...prev, anoReferencia: e.target.value }))}
              options={anos}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Arquivo PDF
            </label>
            <div className="border-2 border-dashed border-dark-border rounded-card p-6 text-center hover:border-prime-gold-dark transition-colors cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-text-muted mb-2" />
              <p className="text-sm text-text-secondary">
                Clique para enviar o arquivo PDF
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Descrição (opcional)
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
              className="w-full bg-dark-input border border-dark-border rounded-input px-4 py-2.5 text-text-primary resize-none"
              placeholder="Descrição do relatório..."
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.notificarEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, notificarEmail: e.target.checked }))}
              className="w-4 h-4 rounded border-dark-border bg-dark-input text-prime-gold"
            />
            <span className="text-sm text-text-secondary">
              Notificar investidores por email
            </span>
          </label>
        </div>
      </Modal>
    </div>
  )
}

export default GestaoRelatorios
