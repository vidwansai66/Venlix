import { cn } from '@/utils/cn';

interface LoadingProps {
  variant?: 'spinner' | 'shimmer' | 'overlay';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const Loading = ({
  variant = 'spinner',
  size = 'md',
  className,
  text = 'Loading...',
}: LoadingProps) => {
  const sizes = {
    sm: 'h-4 w-4 stroke-[2]',
    md: 'h-8 w-8 stroke-[2]',
    lg: 'h-12 w-12 stroke-[1.5]',
  };

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-[3px]">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-slate-100 shadow-premium">
          <svg
            className={cn('animate-spin text-primary', sizes.md)}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-semibold text-slate-700 tracking-wide">{text}</span>
        </div>
      </div>
    );
  }

  if (variant === 'shimmer') {
    return (
      <div className={cn('w-full space-y-4 animate-pulse', className)}>
        <div className="h-4 bg-slate-150 rounded-lg w-1/3" />
        <div className="h-24 bg-slate-150 rounded-2xl w-full" />
        <div className="h-4 bg-slate-150 rounded-lg w-2/3" />
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 p-4', className)}>
      <svg
        className={cn('animate-spin text-primary', sizes[size])}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {text}
        </span>
      )}
    </div>
  );
};
export default Loading;
