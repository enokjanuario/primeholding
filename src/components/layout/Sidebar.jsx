import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  PiggyBank,
  Wallet,
  FileText,
  History,
  Bell,
  User,
  LogOut,
  Users,
  TrendingUp,
  ClipboardList,
  Settings,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const investidorLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/deposito', icon: PiggyBank, label: 'Avisar Depósito' },
  { to: '/resgate', icon: Wallet, label: 'Solicitar Resgate' },
  { to: '/relatorios', icon: FileText, label: 'Relatórios & Documentos' },
  { to: '/historico', icon: History, label: 'Histórico Financeiro' },
  { to: '/notificacoes', icon: Bell, label: 'Notificações' },
  { to: '/perfil', icon: User, label: 'Perfil' },
]

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/investidores', icon: Users, label: 'Investidores' },
  { to: '/admin/aportes', icon: PiggyBank, label: 'Aportes' },
  { to: '/admin/resgates', icon: Wallet, label: 'Resgates' },
  { to: '/admin/relatorios', icon: FileText, label: 'Relatórios' },
  { to: '/admin/rentabilidade', icon: TrendingUp, label: 'Rentabilidade' },
  { to: '/admin/auditoria', icon: ClipboardList, label: 'Auditoria' },
  { to: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
]

function Sidebar({ isOpen, onClose, isAdmin = false }) {
  const { logout } = useAuth()
  const links = isAdmin ? adminLinks : investidorLinks

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-dark-card border-r border-dark-border
          transform transition-transform duration-200 ease-in-out z-40
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.exact}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-md
                      transition-all duration-200
                      ${isActive
                        ? 'bg-prime-gold/10 text-prime-gold border-l-2 border-prime-gold'
                        : 'text-text-secondary hover:text-text-primary hover:bg-dark-border'
                      }
                    `}
                  >
                    <link.icon size={20} />
                    <span className="font-medium">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer - Logout */}
          <div className="p-4 border-t border-dark-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-dark-border rounded-md transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
