import React from 'react';
import { cn } from '@/utils/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-xs font-semibold uppercase tracking-wider text-slate-500 select-none flex items-center gap-1',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-danger">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
