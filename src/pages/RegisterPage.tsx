import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import type { UserRole } from '../types/user.types';
import { authApi } from '../lib/api/auth.api';
import { usersApi } from '../lib/api/users.api';
import { useAuthStore } from '../store/auth.store';

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'USER', label: 'Слушатель / Инвестор', desc: 'Слушайте музыку и инвестируйте в проекты' },
  { value: 'ARTIST', label: 'Артист', desc: 'Создавайте проекты и загружайте треки' },
];

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.register({ email, password, role }),
    onSuccess: async (data) => {
      localStorage.setItem('access_token', data.access_token);
      try {
        const user = await usersApi.getMe();
        login(data.access_token, user);
      } catch {
        login(data.access_token, { id: '', email, role, balance: 0, createdAt: '', updatedAt: '' });
      }
      navigate('/');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message ?? 'Ошибка при регистрации');
    },
  });

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.5), transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-purple flex items-center justify-center">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl text-gradient">MusicInvest</span>
        </div>

        <div className="bg-bg-card border border-border rounded-3xl p-8 shadow-card">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Создать аккаунт</h1>
          <p className="text-text-secondary text-sm mb-6">Выберите роль и заполните данные</p>

          {/* Role selector */}
          <div className="grid grid-cols-1 gap-3 mb-5">
            {roles.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setRole(value)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  role === value
                    ? 'border-accent-purple bg-accent-purple/10'
                    : 'border-border bg-bg-elevated hover:border-border-light'
                }`}
              >
                <p className={`text-sm font-semibold ${role === value ? 'text-accent-purple-light' : 'text-text-primary'}`}>
                  {label}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{desc}</p>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 8 символов"
                  className="w-full px-4 py-3 pr-12 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger"
              >
                <AlertCircle size={14} />
                {errorMsg}
              </motion.div>
            )}

            <button
              onClick={() => mutate()}
              disabled={isPending || !email || !password}
              className="w-full py-3.5 rounded-2xl font-semibold text-white bg-gradient-purple hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Регистрация...' : 'Создать аккаунт'}
            </button>
          </div>

          <p className="text-center text-sm text-text-muted mt-6">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-accent-purple hover:text-accent-purple-light transition-colors font-medium">
              Войти
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
