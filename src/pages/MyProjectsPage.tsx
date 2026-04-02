import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Music2, Coins, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../lib/api/projects.api';
import { useAuthStore } from '../store/auth.store';
import { ProjectCard } from '../components/molecules/ProjectCard';
import { StatusBadge } from '../components/atoms/StatusBadge';
import { FundingProgress } from '../components/atoms/FundingProgress';
import { Spinner } from '../components/atoms/Spinner';
import { CreateProjectModal } from '../components/organisms/CreateProjectModal';
import { formatCurrency, calcFundingPercent } from '../lib/utils';

export function MyProjectsPage() {
  const { user } = useAuthStore();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['my-projects', user?.id],
    queryFn: () => projectsApi.getByArtist(user!.id),
    enabled: !!user?.id,
  });

  const totalFunding = projects?.reduce((acc, p) => acc + p.currentFunding, 0) ?? 0;
  const totalGoal = projects?.reduce((acc, p) => acc + p.fundingGoal, 0) ?? 0;
  const activeCount = projects?.filter((p) => p.status === 'ACTIVE').length ?? 0;
  const fundedCount = projects?.filter((p) => p.status === 'FUNDED').length ?? 0;

  return (
    <>
      <div className="min-h-screen px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Music2 className="w-6 h-6 text-accent-purple" />
              <h1 className="text-3xl font-bold text-text-primary">Мои проекты</h1>
            </div>
            <p className="text-text-secondary">
              Управляйте своими краудфандинг-кампаниями
            </p>
          </div>
        </motion.div>

        {/* Summary stats */}
        {(projects?.length ?? 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="p-5 bg-bg-card border border-border rounded-2xl">
              <p className="text-xs text-text-muted mb-1">Всего проектов</p>
              <p className="text-2xl font-extrabold text-text-primary">{projects?.length}</p>
            </div>
            <div className="p-5 bg-bg-card border border-border rounded-2xl">
              <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
                <TrendingUp size={11} className="text-success" />
                Активных
              </div>
              <p className="text-2xl font-extrabold text-success">{activeCount}</p>
            </div>
            <div className="p-5 bg-bg-card border border-border rounded-2xl">
              <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
                <Coins size={11} className="text-accent-cyan" />
                Собрано
              </div>
              <p className="text-2xl font-extrabold text-accent-cyan">{formatCurrency(totalFunding)}</p>
            </div>
            <div className="p-5 bg-bg-card border border-border rounded-2xl">
              <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
                <Clock size={11} className="text-accent-purple" />
                Профинансировано
              </div>
              <p className="text-2xl font-extrabold text-accent-purple">{fundedCount}</p>
            </div>
          </motion.div>
        )}

        {/* Projects list */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : !projects || projects.length === 0 ? (
            /* Empty state */
            <div className="text-center py-24 space-y-5">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
                <Music2 className="w-9 h-9 text-accent-purple opacity-70" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">У вас пока нет проектов</h3>
                <p className="text-text-secondary mt-2 max-w-sm mx-auto">
                  Создайте краудфандинг-кампанию, привлеките инвесторов и запишите свой альбом
                </p>
              </div>
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-purple text-white font-semibold hover:opacity-90 transition-opacity shadow-glow-purple"
              >
                <Plus size={18} />
                Создать первый проект
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table-style list */}
              <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
                {/* Header row */}
                <div className="grid grid-cols-[1fr_160px_140px_100px] gap-4 px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border">
                  <span>Проект</span>
                  <span>Финансирование</span>
                  <span>Цель</span>
                  <span>Статус</span>
                </div>

                {/* Project rows */}
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-[1fr_160px_140px_100px] gap-4 px-5 py-4 items-center border-b border-border/50 last:border-0 hover:bg-bg-elevated/60 transition-colors group"
                  >
                    {/* Title + meta */}
                    <div className="min-w-0">
                      <Link
                        to={`/projects/${project.id}`}
                        className="font-semibold text-text-primary group-hover:text-accent-purple-light transition-colors truncate block"
                      >
                        {project.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <TrendingUp size={10} />
                          {project.revenueSharePercent}% доля
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {project.durationMonths} мес.
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <FundingProgress
                        current={project.currentFunding}
                        goal={project.fundingGoal}
                        showLabel={false}
                      />
                      <p className="text-xs text-text-muted">
                        {calcFundingPercent(project.currentFunding, project.fundingGoal)}% из 100%
                      </p>
                    </div>

                    {/* Goal */}
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {formatCurrency(project.currentFunding)}
                      </p>
                      <p className="text-xs text-text-muted">
                        / {formatCurrency(project.fundingGoal)}
                      </p>
                    </div>

                    {/* Status */}
                    <StatusBadge status={project.status} />
                  </motion.div>
                ))}
              </div>

              {/* Card grid below the table — optional second view */}
              <div className="mt-8">
                <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent-purple" />
                  Карточки проектов
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {projects.map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.06 }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* ➕ Sticky "Add Project" button at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center pt-4 pb-8"
        >
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-purple text-white font-bold text-base hover:opacity-90 transition-opacity shadow-glow-purple hover:shadow-[0_0_50px_rgba(124,58,237,0.5)]"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Plus size={14} />
            </div>
            Добавить новый проект
          </button>
        </motion.div>
      </div>

      <CreateProjectModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}
