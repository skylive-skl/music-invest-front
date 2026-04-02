import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users, Clock, Target, Coins } from 'lucide-react';
import { projectsApi } from '../lib/api/projects.api';
import { usersApi } from '../lib/api/users.api';
import { FundingProgress } from '../components/atoms/FundingProgress';
import { StatusBadge } from '../components/atoms/StatusBadge';
import { RevenueChart } from '../components/molecules/RevenueChart';
import { InvestModal } from '../components/organisms/InvestModal';
import { Spinner } from '../components/atoms/Spinner';
import { useAuthStore } from '../store/auth.store';
import { formatCurrency, calcFundingPercent, formatDate, stringToGradient } from '../lib/utils';

// Mock chart data - in real app would come from revenue reports
function generateMockChartData(project: any) {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
  return months.map((label, i) => ({
    label,
    value: Math.floor(Math.random() * (project.fundingGoal * 0.3) + project.fundingGoal * 0.05),
    payout: Math.floor(Math.random() * 5000 + 1000),
  }));
}

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [investOpen, setInvestOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getById(id!),
    enabled: !!id,
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: usersApi.getWallet,
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-text-muted">
        <p className="text-xl font-semibold">Проект не найден</p>
        <Link to="/" className="text-accent-purple hover:underline">На главную</Link>
      </div>
    );
  }

  const artistName = project.artist?.email?.split('@')[0] ?? 'Artist';
  const percent = calcFundingPercent(project.currentFunding, project.fundingGoal);
  const chartData = generateMockChartData(project);

  return (
    <>
      <div className="min-h-screen">
        {/* Hero */}
        <div className="relative h-64 overflow-hidden">
          {project.coverImageUrl ? (
            <img src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: stringToGradient(project.title) }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />

          <Link
            to="/"
            className="absolute top-6 left-6 flex items-center gap-2 px-3 py-2 rounded-xl glass text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Назад
          </Link>
        </div>

        <div className="px-8 -mt-16 relative pb-12">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left: Main content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Title */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <StatusBadge status={project.status} className="mb-3" />
                <h1 className="text-3xl font-extrabold text-text-primary mb-2">{project.title}</h1>
                <div className="flex items-center gap-3 text-sm text-text-secondary flex-wrap">
                  <Link to={`/artists/${project.artistId}`} className="font-medium hover:text-accent-purple-light transition-colors">
                    {artistName}
                  </Link>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {project.durationMonths} мес.
                  </span>
                  <span>·</span>
                  <span>Создан {formatDate(project.createdAt)}</span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="text-base font-semibold text-text-primary mb-3">О проекте</h2>
                <p className="text-text-secondary leading-relaxed">{project.description}</p>
              </motion.div>

              {/* Revenue chart */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent-purple" />
                  График выручки
                </h2>
                <RevenueChart data={chartData} height={200} />
              </motion.div>

              {/* Media */}
              {(project.mediaAttachments?.length ?? 0) > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-bg-card border border-border rounded-2xl p-6"
                >
                  <h2 className="text-base font-semibold text-text-primary mb-4">Медиафайлы</h2>
                  <div className="space-y-2">
                    {project.mediaAttachments!.map((m) => (
                      <a
                        key={m.id}
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 bg-bg-elevated rounded-xl hover:bg-bg-hover transition-colors text-sm text-text-secondary hover:text-text-primary"
                      >
                        <span>{m.type === 'AUDIO' ? '🎵' : '🎬'}</span>
                        <span className="truncate">{m.filename}</span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Investment panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-4"
            >
              {/* Funding card */}
              <div className="bg-bg-card border border-border rounded-2xl p-6 sticky top-4">
                <h3 className="text-lg font-bold text-text-primary mb-5">Финансирование</h3>

                {/* Stats */}
                <div className="space-y-4 mb-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Собрано</span>
                      <span className="font-bold text-text-primary">{percent}%</span>
                    </div>
                    <FundingProgress current={project.currentFunding} goal={project.fundingGoal} showLabel={false} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-bg-elevated rounded-xl">
                      <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
                        <Coins size={11} />
                        Собрано
                      </div>
                      <p className="text-sm font-bold text-text-primary">
                        {formatCurrency(project.currentFunding)}
                      </p>
                    </div>
                    <div className="p-3 bg-bg-elevated rounded-xl">
                      <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
                        <Target size={11} />
                        Цель
                      </div>
                      <p className="text-sm font-bold text-text-primary">
                        {formatCurrency(project.fundingGoal)}
                      </p>
                    </div>
                  </div>

                  {/* Revenue share highlight */}
                  <div className="p-4 rounded-2xl gradient-border" style={{ background: 'rgba(124,58,237,0.06)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-accent-purple" />
                      <span className="text-sm font-semibold text-text-primary">Доля от выручки</span>
                    </div>
                    <p className="text-3xl font-extrabold text-gradient">
                      {project.revenueSharePercent}%
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      распределяется между инвесторами пропорционально вложениям
                    </p>
                  </div>

                  {/* Investors count */}
                  {(project.investments?.length ?? 0) > 0 && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Users size={14} />
                      <span>{project.investments!.length} инвесторов</span>
                    </div>
                  )}
                </div>

                {/* Invest button */}
                {project.status === 'ACTIVE' && (
                  <button
                    onClick={() => setInvestOpen(true)}
                    className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-purple hover:opacity-90 transition-opacity shadow-glow-purple text-base"
                  >
                    Инвестировать
                  </button>
                )}
                {project.status !== 'ACTIVE' && (
                  <div className="w-full py-4 rounded-2xl font-bold text-text-muted bg-bg-elevated text-center text-sm">
                    Приём инвестиций закрыт
                  </div>
                )}

                {!isAuthenticated && project.status === 'ACTIVE' && (
                  <p className="text-xs text-text-muted text-center mt-2">
                    <Link to="/login" className="text-accent-purple hover:underline">Войдите</Link>, чтобы инвестировать
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <InvestModal
        project={project}
        isOpen={investOpen}
        onClose={() => setInvestOpen(false)}
        walletBalance={wallet?.balance ?? 0}
      />
    </>
  );
}
