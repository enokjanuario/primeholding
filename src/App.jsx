import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Layouts
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'

// Pages
import Login from './pages/Login'

// Investidor Pages
import Dashboard from './pages/investidor/Dashboard'
import AvisoDeposito from './pages/investidor/AvisoDeposito'
import SolicitarResgate from './pages/investidor/SolicitarResgate'
import Relatorios from './pages/investidor/Relatorios'
import Historico from './pages/investidor/Historico'
import Notificacoes from './pages/investidor/Notificacoes'
import Perfil from './pages/investidor/Perfil'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import GestaoInvestidores from './pages/admin/GestaoInvestidores'
import GestaoAportes from './pages/admin/GestaoAportes'
import GestaoResgates from './pages/admin/GestaoResgates'
import GestaoRelatorios from './pages/admin/GestaoRelatorios'
import Rentabilidade from './pages/admin/Rentabilidade'
import Auditoria from './pages/admin/Auditoria'
import Configuracoes from './pages/admin/Configuracoes'

// Componente de Loader
import Loader from './components/ui/Loader'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={user ? <Navigate to={user.isAdmin ? "/admin" : "/dashboard"} replace /> : <Login />}
      />

      {/* Rotas do Investidor */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="deposito" element={<AvisoDeposito />} />
        <Route path="resgate" element={<SolicitarResgate />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="historico" element={<Historico />} />
        <Route path="notificacoes" element={<Notificacoes />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>

      {/* Rotas do Admin */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="investidores" element={<GestaoInvestidores />} />
        <Route path="aportes" element={<GestaoAportes />} />
        <Route path="resgates" element={<GestaoResgates />} />
        <Route path="relatorios" element={<GestaoRelatorios />} />
        <Route path="rentabilidade" element={<Rentabilidade />} />
        <Route path="auditoria" element={<Auditoria />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
