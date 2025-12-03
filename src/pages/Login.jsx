import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Alert from '../components/ui/Alert'
import { isValidEmail } from '../utils/validators'

function Login() {
  const navigate = useNavigate()
  const { login, loading, error, clearError, user, isAdmin } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  })
  const [formErrors, setFormErrors] = useState({})

  // Redirecionar quando o user for definido
  useEffect(() => {
    console.log('Login useEffect - user:', user, 'isAdmin:', isAdmin)
    if (user) {
      const targetPath = isAdmin ? '/admin' : '/dashboard'
      console.log('Redirecting to:', targetPath)
      navigate(targetPath, { replace: true })
    }
  }, [user, isAdmin, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Limpar erro do campo
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Limpar erro de API
    if (error) {
      clearError()
    }
  }

  const validate = () => {
    const errors = {}

    if (!formData.email) {
      errors.email = 'Email é obrigatório'
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Email inválido'
    }

    if (!formData.senha) {
      errors.senha = 'Senha é obrigatória'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    try {
      await login(formData.email, formData.senha)
      // Redirecionamento é feito pelo useEffect quando user é atualizado
    } catch (err) {
      // Erro já é tratado pelo AuthContext
      console.error('Erro no login:', err)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <img
            src="/logo-prime.png"
            alt="Prime Holding"
            className="h-16 mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <h1 className="font-montserrat text-2xl font-bold text-prime-gold">
            Portal do Investidor
          </h1>
          <p className="text-text-secondary mt-2">
            Acesso exclusivo para investidores
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-dark-card border border-dark-border rounded-card p-6 shadow-xl">
          {/* Alerta de erro */}
          {error && (
            <Alert
              variant="error"
              message={error}
              onClose={clearError}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              placeholder="seu@email.com"
              leftIcon={<Mail size={18} />}
              autoComplete="email"
              required
            />

            <Input
              label="Senha"
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              error={formErrors.senha}
              placeholder="Digite sua senha"
              leftIcon={<Lock size={18} />}
              autoComplete="current-password"
              required
            />

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-prime-gold hover:text-prime-gold-light transition-colors"
                onClick={() => {
                  // TODO: Implementar recuperação de senha
                  alert('Funcionalidade em desenvolvimento. Entre em contato com o suporte.')
                }}
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              size="lg"
            >
              Entrar
            </Button>
          </form>
        </div>

        {/* Aviso legal */}
        <p className="text-center text-xs text-text-muted mt-6 px-4">
          Ao acessar, você concorda com os Termos de Uso e Política de Privacidade
          da Prime Holding Investimentos.
        </p>

        {/* Copyright */}
        <p className="text-center text-xs text-text-muted mt-4">
          &copy; {new Date().getFullYear()} Prime Holding Investimentos. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}

export default Login
