import { motion } from "framer-motion";
import { Calendar, Percent } from "lucide-react";
import { Link } from "react-router-dom";
import type { Investment } from "../../types/investment.types";
import { FundingProgress } from "../atoms/FundingProgress";
import { formatCurrency, formatDate, stringToGradient } from "../../lib/utils";

interface InvestmentCardProps {
  investment: Investment;
  index?: number;
}

export function InvestmentCard({ investment, index = 0 }: InvestmentCardProps) {
  const project = investment.project;
  const totalPayout =
    investment.payouts?.reduce((acc, p) => acc + p.amount, 0) ?? 0;
  const roi =
    investment.amount > 0
      ? ((totalPayout / investment.amount) * 100).toFixed(1)
      : "0";
  const projectName = project?.title ?? "Проект";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-accent-purple/40 transition-colors"
    >
      {/* Header with gradient */}
      <div className="relative h-24 overflow-hidden">
        {project?.coverImageUrl ? (
          <img
            src={project.coverImageUrl}
            alt={projectName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: stringToGradient(projectName) }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
      </div>

      <div className="p-4 -mt-2">
        <Link to={`/projects/${investment.projectId}`}>
          <h3 className="font-bold text-text-primary hover:text-accent-purple-light transition-colors mb-3 truncate">
            {projectName}
          </h3>
        </Link>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-bg-elevated rounded-xl">
            <p className="text-xs text-text-muted">Вложено</p>
            <p className="text-sm font-bold text-text-primary mt-0.5">
              {formatCurrency(investment.amount)}
            </p>
          </div>
          <div className="text-center p-2 bg-bg-elevated rounded-xl">
            <p className="text-xs text-text-muted">Выплачено</p>
            <p className="text-sm font-bold text-success mt-0.5">
              {formatCurrency(totalPayout)}
            </p>
          </div>
          <div className="text-center p-2 bg-bg-elevated rounded-xl">
            <p className="text-xs text-text-muted">ROI</p>
            <p
              className={`text-sm font-bold mt-0.5 ${totalPayout >= investment.amount ? "text-success" : "text-accent-cyan"}`}
            >
              {roi}%
            </p>
          </div>
        </div>

        {/* Share & meta */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <Percent className="w-3 h-3" />
            <span>
              Доля:{" "}
              <span className="text-accent-purple">
                {investment.sharePercent?.toFixed(2)}%
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(investment.createdAt)}
          </div>
        </div>

        {project && (
          <div className="mt-3">
            <FundingProgress
              current={project.currentFunding}
              goal={project.fundingGoal}
              showLabel={false}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
