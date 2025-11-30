import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, AlertCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Alert from '../../components/ui/Alert'
import { useAuth } from '../../hooks/useAuth'
import aportesService from '../../services/aportes'
import { SCPS, SUCCESS_MESSAGES } from '../../utils/constants'
import { unmaskMoney } from '../../utils/validators'

function AvisoDeposito() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    scp: '',
    valor: '',
    dataDeposito: new Date().toISOString().split('T')[0],
    descricao: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Filtrar SCPs do investidor
  const scpsDisponiveis = SCPS.filter(
    scp => user?.scpsVinculadas?.includes(scp.value) || true
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleValorChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value) {
      value = (parseInt(value) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    }
    setFormData(prev => ({ ...prev, valor: value }))

    if (formErrors.valor) {
      setFormErrors(prev => ({ ...prev, valor: '' }))
    }
  }

  const validate = () => {
    const errors = {}

    if (!formData.scp) {
      errors.scp = 'Selecione uma SCP'
    }

    const valorNumerico = unmaskMoney(formData.valor)
    if (!formData.valor || valorNumerico <= 0) {
      errors.valor = 'Informe um valor válido'
    }

    if (!formData.dataDeposito) {
      errors.dataDeposito = 'Informe a data do depósito'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setError('')

    try {
      await aportesService.registrar({
        scp: formData.scp,
        valor: unmaskMoney(formData.valor),
        dataDeposito: formData.dataDeposito,
        descricao: formData.descricao,
      })

      setSuccess(true)

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/historico')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Erro ao registrar aviso de depósito')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto animate-fadeIn">
        <Alert
          variant="success"
          title="Aviso registrado!"
          message={SUCCESS_MESSAGES.APORTE_REGISTRADO}
        />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto animate-fadeIn">
      <h1 className="font-montserrat text-2xl font-bold text-text-primary mb-2">
        Avisar Depósito
      </h1>
      <p className="text-text-secondary mb-6">
        Informe os dados do depósito realizado para agilizar a análise
      </p>

      <Card>
        {error && (
          <Alert variant="error" message={error} onClose={() => setError('')} className="mb-4" />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="SCP"
            name="scp"
            value={formData.scp}
            onChange={handleChange}
            options={scpsDisponiveis}
            error={formErrors.scp}
            placeholder="Selecione a SCP"
            required
          />

          <Input
            label="Valor do Depósito"
            name="valor"
            value={formData.valor}
            onChange={handleValorChange}
            error={formErrors.valor}
            placeholder="R$ 0,00"
            required
          />

          <Input
            label="Data do Depósito"
            type="date"
            name="dataDeposito"
            value={formData.dataDeposito}
            onChange={handleChange}
            error={formErrors.dataDeposito}
            max={new Date().toISOString().split('T')[0]}
            required
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Comprovante (opcional)
            </label>
            <div className="border-2 border-dashed border-dark-border rounded-card p-6 text-center hover:border-prime-gold-dark transition-colors cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-text-muted mb-2" />
              <p className="text-sm text-text-secondary">
                Clique para enviar ou arraste o arquivo
              </p>
              <p className="text-xs text-text-muted mt-1">
                PDF, JPG ou PNG até 5MB
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Observações (opcional)
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={3}
              className="w-full bg-dark-input border border-dark-border rounded-input px-4 py-2.5 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-prime-gold focus:border-transparent resize-none"
              placeholder="Informações adicionais sobre o depósito..."
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-dark-bg rounded-md">
            <AlertCircle size={18} className="text-prime-gold flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              Após o envio, nossa equipe analisará o depósito em até 24 horas úteis.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={loading}
            >
              Enviar Aviso
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AvisoDeposito
