import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../lib/api/auth.api';
import { usersApi } from '../lib/api/users.api';
import { useAuthStore } from '../store/auth.store';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.login({ email, password }),
    onSuccess: async (data) => {
      localStorage.setItem('access_token', data.accessToken);
      try {
        const user = await usersApi.getMe();
        login(data.accessToken, user);
      } catch {
        login(data.accessToken, { id: '', email, role: 'USER', balance: 0, createdAt: '', updatedAt: '' });
      }
      navigate('/');

    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message ?? 'Неверный email или пароль');
    },
  });

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      {/* BG gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.6), transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-purple flex items-center justify-center">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl text-gradient">MusicInvest</span>
        </div>

        <div className="bg-bg-card border border-border rounded-3xl p-8 shadow-card">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Добро пожаловать</h1>
          <p className="text-text-secondary text-sm mb-7">Войдите в свой аккаунт</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
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
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onKeyDown={(e) => e.key === 'Enter' && mutate()}
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
              className="w-full py-3.5 rounded-2xl font-semibold text-white bg-gradient-purple hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? 'Вход...' : 'Войти'}
            </button>
          </div>

          <p className="text-center text-sm text-text-muted mt-6">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-accent-purple hover:text-accent-purple-light transition-colors font-medium">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
