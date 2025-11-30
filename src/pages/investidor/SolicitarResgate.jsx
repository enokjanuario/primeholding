import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Wallet } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Alert from '../../components/ui/Alert'
import { useAuth } from '../../hooks/useAuth'
import resgatesService from '../../services/resgates'
import { SCPS, TIPOS_CONTA, BANCOS, CONFIG, SUCCESS_MESSAGES } from '../../utils/constants'
import { unmaskMoney } from '../../utils/validators'
import { formatCurrency } from '../../utils/formatters'

function SolicitarResgate() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Calcular data mínima (D+7)
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + CONFIG.DIAS_MIN_RESGATE)
  const minDateStr = minDate.toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    scp: '',
    valor: '',
    dataDesejada: minDateStr,
    banco: user?.banco || '',
    agencia: user?.agencia || '',
    conta: user?.conta || '',
    tipoConta: user?.tipoConta || '',
    titularConta: user?.titularConta || user?.nome || '',
    cpfCnpjConta: user?.cpf || '',
    descricao: '',
    concordouTermos: false,
  })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Saldo fictício por SCP (em produção viria da API)
  const saldosPorSCP = {
    'SCP 1': 80000,
    'SCP 2': 50000,
    'SCP 3': 20000,
  }

  const saldoDisponivel = saldosPorSCP[formData.scp] || 0

  const scpsDisponiveis = SCPS.filter(
    scp => user?.scpsVinculadas?.includes(scp.value) || true
  )

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

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
    } else if (valorNumerico > saldoDisponivel) {
      errors.valor = 'Valor excede o saldo disponível'
    }

    if (!formData.dataDesejada) {
      errors.dataDesejada = 'Informe a data desejada'
    }

    if (!formData.banco) errors.banco = 'Selecione o banco'
    if (!formData.agencia) errors.agencia = 'Informe a agência'
    if (!formData.conta) errors.conta = 'Informe a conta'
    if (!formData.tipoConta) errors.tipoConta = 'Selecione o tipo de conta'
    if (!formData.titularConta) errors.titularConta = 'Informe o titular'
    if (!formData.cpfCnpjConta) errors.cpfCnpjConta = 'Informe o CPF/CNPJ'

    if (!formData.concordouTermos) {
      errors.concordouTermos = 'Você deve concordar com os termos'
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
      await resgatesService.solicitar({
        scp: formData.scp,
        valor: unmaskMoney(formData.valor),
        dataDesejada: formData.dataDesejada,
        banco: formData.banco,
        agencia: formData.agencia,
        conta: formData.conta,
        tipoConta: formData.tipoConta,
        titularConta: formData.titularConta,
        cpfCnpjConta: formData.cpfCnpjConta,
        descricao: formData.descricao,
        concordouTermos: true,
      })

      setSuccess(true)

      setTimeout(() => {
        navigate('/historico')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Erro ao solicitar resgate')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <Alert
          variant="success"
          title="Resgate solicitado!"
          message={SUCCESS_MESSAGES.RESGATE_SOLICITADO}
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <h1 className="font-montserrat text-2xl font-bold text-text-primary mb-2">
        Solicitar Resgate
      </h1>
      <p className="text-text-secondary mb-6">
        Preencha os dados para solicitar o resgate dos seus investimentos
      </p>

      {/* Saldo disponível */}
      {formData.scp && (
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-prime-gold/10 flex items-center justify-center">
              <Wallet className="text-prime-gold" size={24} />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Saldo disponível em {formData.scp}</p>
              <p className="text-2xl font-bold text-prime-gold font-montserrat">
                {formatCurrency(saldoDisponivel)}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        {error && (
          <Alert variant="error" message={error} onClose={() => setError('')} className="mb-4" />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do resgate */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Dados do Resgate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                label="Valor a Resgatar"
                name="valor"
                value={formData.valor}
                onChange={handleValorChange}
                error={formErrors.valor}
                placeholder="R$ 0,00"
                required
              />

              <Input
                label="Data Desejada"
                type="date"
                name="dataDesejada"
                value={formData.dataDesejada}
                onChange={handleChange}
                error={formErrors.dataDesejada}
                min={minDateStr}
                helperText="Prazo mínimo de D+7"
                required
              />
            </div>
          </div>

          {/* Dados bancários */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Dados Bancários</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Banco"
                name="banco"
                value={formData.banco}
                onChange={handleChange}
                options={BANCOS}
                error={formErrors.banco}
                placeholder="Selecione o banco"
                required
              />

              <Select
                label="Tipo de Conta"
                name="tipoConta"
                value={formData.tipoConta}
                onChange={handleChange}
                options={TIPOS_CONTA}
                error={formErrors.tipoConta}
                placeholder="Selecione o tipo"
                required
              />

              <Input
                label="Agência"
                name="agencia"
                value={formData.agencia}
                onChange={handleChange}
                error={formErrors.agencia}
                placeholder="0000"
                required
              />

              <Input
                label="Conta"
                name="conta"
                value={formData.conta}
                onChange={handleChange}
                error={formErrors.conta}
                placeholder="00000-0"
                required
              />

              <Input
                label="Titular da Conta"
                name="titularConta"
                value={formData.titularConta}
                onChange={handleChange}
                error={formErrors.titularConta}
                placeholder="Nome completo"
                required
              />

              <Input
                label="CPF/CNPJ do Titular"
                name="cpfCnpjConta"
                value={formData.cpfCnpjConta}
                onChange={handleChange}
                error={formErrors.cpfCnpjConta}
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>

          {/* Observações */}
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
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Termos */}
          <div className="p-4 bg-dark-bg rounded-md">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="concordouTermos"
                checked={formData.concordouTermos}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-input text-prime-gold focus:ring-prime-gold focus:ring-offset-dark-bg"
              />
              <span className="text-sm text-text-secondary">
                Li e concordo com os prazos de liquidação. Entendo que o resgate será processado
                em até 7 dias úteis após aprovação e que a transferência será realizada para a
                conta informada.
              </span>
            </label>
            {formErrors.concordouTermos && (
              <p className="text-sm text-red-500 mt-2">{formErrors.concordouTermos}</p>
            )}
          </div>

          <div className="flex items-center gap-2 p-3 bg-dark-bg rounded-md">
            <AlertCircle size={18} className="text-prime-gold flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              Sua solicitação será analisada pela equipe. Você receberá uma notificação
              quando o resgate for processado.
            </p>
          </div>

          <div className="flex gap-3">
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
              Solicitar Resgate
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default SolicitarResgate
