import { cn } from '../../lib/utils';
import { calcFundingPercent } from '../../lib/utils';

interface FundingProgressProps {
  current: number;
  goal: number;
  className?: string;
  showLabel?: boolean;
}

export function FundingProgress({ current, goal, className, showLabel = true }: FundingProgressProps) {
  const percent = calcFundingPercent(current, goal);

  return (
    <div className={cn('space-y-1.5', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-secondary">
          <span>{percent}% собрано</span>
          <span>{goal.toLocaleString('ru-RU')} ₸</span>
        </div>
      )}
      <div className="h-1.5 w-full bg-bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percent}%`,
            background: percent >= 100
              ? 'linear-gradient(90deg, #10b981, #06b6d4)'
              : 'linear-gradient(90deg, #7c3aed, #9d5cf6)',
            boxShadow: '0 0 8px rgba(124, 58, 237, 0.6)',
          }}
        />
      </div>
    </div>
  );
}
