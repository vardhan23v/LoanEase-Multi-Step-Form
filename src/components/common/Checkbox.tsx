// ============================================================
// Checkbox Component — Liquid Glass
// ============================================================

import { type InputHTMLAttributes, forwardRef, useId } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string | React.ReactNode;
  error?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, description, className = '', id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;

    return (
      <div className="space-y-1">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={`
              mt-0.5 h-5 w-5 rounded border-white/20
              bg-white/5 text-primary-500 cursor-pointer
              focus:ring-2 focus:ring-primary-400/20 focus:ring-offset-0
              disabled:opacity-40 disabled:cursor-not-allowed
              accent-primary-500
              ${error ? 'border-danger-500/50' : ''}
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          <div className="flex-1">
            <label
              htmlFor={id}
              className="text-sm text-white/70 cursor-pointer select-none leading-5"
            >
              {label}
            </label>
            {description && (
              <p className="text-xs text-white/30 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {error && (
          <p
            id={errorId}
            className="text-sm text-danger-400 ml-8"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
