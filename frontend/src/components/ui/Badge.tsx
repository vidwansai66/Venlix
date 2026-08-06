import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'info';
  pill?: boolean;
}

export const Badge = ({
  className,
  variant = 'primary',
  pill = false,
  ...props
}: BadgeProps) => {
  const variants = {
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200/50',
    success: 'bg-success/10 text-success border border-success/20',
    danger: 'bg-danger/10 text-danger border border-danger/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    info: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    outline: 'bg-transparent border border-slate-200 text-slate-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors duration-200',
        pill ? 'rounded-full' : 'rounded-md',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
