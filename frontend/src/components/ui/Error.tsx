import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  inline?: boolean;
}

export const Error = ({
  title = 'An error occurred',
  message = 'We could not fetch the required information. Please check your connection and try again.',
  onRetry,
  className,
  inline = false,
}: ErrorProps) => {
  if (inline) {
    return (
      <div className={cn('flex items-center gap-3 p-4 rounded-xl border border-danger/10 bg-danger/5 text-danger text-sm', className)}>
        <AlertCircle size={18} className="flex-shrink-0" />
        <div className="flex-1 font-medium">{message}</div>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="h-8 px-2 hover:bg-danger/10 text-danger hover:text-danger/90">
            <RefreshCw size={14} className="mr-1.5" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-slate-100 bg-white shadow-soft max-w-md mx-auto my-6', className)}>
      <div className="p-3.5 bg-danger/10 text-danger rounded-full mb-4">
        <AlertCircle size={32} className="stroke-[1.75]" />
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
        {title}
      </h3>
      
      <p className="text-sm text-slate-500 mt-2 mb-6 max-w-xs leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw size={14} />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
export default Error;
