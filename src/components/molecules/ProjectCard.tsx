import { motion } from 'framer-motion';
import { TrendingUp, Users, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../../types/project.types';
import { FundingProgress } from '../atoms/FundingProgress';
import { StatusBadge } from '../atoms/StatusBadge';
import { formatCurrency, stringToGradient, cn } from '../../lib/utils';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const artistEmail = project.artist?.email ?? 'Artist';
  const artistName = artistEmail.split('@')[0];

  return (
    <Link to={`/projects/${project.id}`}>
      <motion.div
        className={cn(
          'group relative rounded-2xl overflow-hidden cursor-pointer',
          'bg-bg-card border border-border hover:border-accent-purple/50',
          'transition-colors duration-300 shadow-card',
          className
        )}
        whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.12)' }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Cover / Gradient Header */}
        <div className="relative h-40 overflow-hidden">
          {project.coverImageUrl ? (
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: stringToGradient(project.title) }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/30 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <StatusBadge status={project.status} />
          </div>

          {/* Revenue share badge */}
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white bg-black/50 backdrop-blur-sm">
              <TrendingUp className="w-3 h-3 text-accent-cyan" />
              {project.revenueSharePercent}% доля
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-base text-text-primary group-hover:text-accent-purple-light transition-colors leading-tight line-clamp-2">
              {project.title}
            </h3>
          </div>

          <p className="text-xs text-text-secondary mb-3 line-clamp-2">
            {project.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {artistName}
            </span>
            <span className="flex items-center gap-1">
              <Coins className="w-3 h-3" />
              {formatCurrency(project.currentFunding)}
            </span>
          </div>

          <FundingProgress current={project.currentFunding} goal={project.fundingGoal} />

          <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
            <span>Цель: {formatCurrency(project.fundingGoal)}</span>
            <span>{project.durationMonths} мес.</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
