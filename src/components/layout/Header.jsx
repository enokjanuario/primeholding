import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Settings, Menu, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useNotificacoes } from '../../hooks/useNotificacoes'

function Header({ onMenuToggle, isMobileMenuOpen }) {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotificacoes()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-dark-card border-b border-dark-border z-40">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side - Logo and mobile menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-text-muted hover:text-text-primary hover:bg-dark-border rounded-md transition-colors"
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo-prime.png"
              alt="Prime Holding"
              className="h-8 w-auto"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <span className="hidden sm:block font-montserrat font-bold text-lg text-prime-gold">
              Prime Holding
            </span>
          </Link>
        </div>

        {/* Right side - Notifications and user */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link
            to="/notificacoes"
            className="relative p-2 text-text-muted hover:text-text-primary hover:bg-dark-border rounded-md transition-colors"
            aria-label="Notificações"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 text-text-muted hover:text-text-primary hover:bg-dark-border rounded-md transition-colors"
            >
              <div className="w-8 h-8 bg-prime-gold/20 rounded-full flex items-center justify-center">
                <User size={18} className="text-prime-gold" />
              </div>
              <span className="hidden md:block text-sm font-medium text-text-primary">
                {user?.nome?.split(' ')[0] || 'Usuário'}
              </span>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-card shadow-xl animate-slideIn">
                <div className="p-3 border-b border-dark-border">
                  <p className="font-medium text-text-primary truncate">{user?.nome}</p>
                  <p className="text-sm text-text-muted truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/perfil"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-dark-border rounded-md transition-colors"
                  >
                    <Settings size={16} />
                    Meu Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-border rounded-md transition-colors"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
