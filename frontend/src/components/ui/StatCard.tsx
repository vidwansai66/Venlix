import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  glass?: boolean;
}

export const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  isLoading = false,
  variant = 'default',
  glass = false,
}: StatCardProps) => {
  const iconVariants = {
    default: 'bg-secondary/10 text-secondary',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };

  return (
    <Card 
      glass={glass} 
      hoverEffect 
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        variant === 'primary' ? 'hover:glow-primary hover:border-primary/40' : 'hover:glow-secondary hover:border-secondary/40'
      )}
    >
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-brand-border rounded-md w-1/2" />
          <div className="h-8 bg-brand-border rounded-md w-3/4" />
          <div className="h-4 bg-brand-border rounded-md w-5/6" />
        </div>
      ) : (
        <div className="flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {title}
            </span>
            {Icon && (
              <div className={cn('p-2.5 rounded-xl transition-all duration-200', iconVariants[variant])}>
                <Icon size={18} className="stroke-[2]" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-bold tracking-tight text-brand-text">
              {value}
            </h3>
            
            <div className="flex items-center gap-1.5 flex-wrap">
              {trend && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
                    trend.isPositive
                      ? 'bg-success/10 text-success'
                      : 'bg-danger/10 text-danger'
                  )}
                >
                  {trend.isPositive ? (
                    <ArrowUpRight size={12} className="stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight size={12} className="stroke-[2.5]" />
                  )}
                  {trend.value}%
                </span>
              )}
              {description && (
                <span className="text-xs text-muted font-medium">
                  {description}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
export default StatCard;
