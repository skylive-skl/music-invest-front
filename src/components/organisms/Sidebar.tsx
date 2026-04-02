import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Search,
  Heart,
  TrendingUp,
  LogOut,
  User,
  Music2,
  Wallet,
  Clapperboard,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { Avatar } from '../atoms/Avatar';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/search', icon: Search, label: 'Поиск' },
  { to: '/collection', icon: Heart, label: 'Моя коллекция' },
  { to: '/investments', icon: TrendingUp, label: 'Инвестиции' },
];

// Only for ARTIST and ADMIN roles
const artistNavItems = [
  { to: '/my-projects', icon: Clapperboard, label: 'Мои проекты' },
];

export function Sidebar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40
      bg-bg-secondary border-r border-border">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-gradient-purple flex items-center justify-center">
          <Music2 className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-gradient">MusicInvest</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent-purple/15 text-accent-purple-light border border-accent-purple/20'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('w-4.5 h-4.5', isActive ? 'text-accent-purple' : '')} size={18} />
                {label}
              </>
            )}
          </NavLink>
        ))}

        {/* Artist-only section */}
        {isAuthenticated && user && (user.role === 'ARTIST' || user.role === 'ADMIN') && (
          <>
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
                Для артиста
              </p>
            </div>
            {artistNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-accent-purple/15 text-accent-purple-light border border-accent-purple/20'
                      : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('w-4.5 h-4.5', isActive ? 'text-accent-purple' : '')} size={18} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </>
        )}

        {/* Divider */}
        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
            Аккаунт
          </p>
        </div>

        {isAuthenticated ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent-purple/15 text-accent-purple-light border border-accent-purple/20'
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                )
              }
            >
              <User size={18} />
              Профиль
            </NavLink>
            <NavLink
              to="/wallet"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent-purple/15 text-accent-purple-light border border-accent-purple/20'
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                )
              }
            >
              <Wallet size={18} />
              Кошелёк
            </NavLink>
          </>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-all duration-200"
          >
            <User size={18} />
            Войти
          </NavLink>
        )}
      </nav>

      {/* User footer */}
      {isAuthenticated && user && (
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-elevated transition-colors group">
            <Avatar name={user.email} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user.email.split('@')[0]}
              </p>
              <p className="text-xs text-text-muted capitalize">{user.role.toLowerCase()}</p>
            </div>
            <button
              onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-danger/10 hover:text-danger text-text-muted"
              title="Выйти"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
