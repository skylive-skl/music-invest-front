import { cn, getStatusColor, getStatusLabel } from '../../lib/utils';

interface BadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        'bg-bg-elevated border border-border',
        getStatusColor(status),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {getStatusLabel(status)}
    </span>
  );
}
