// ============================================================
// Select Component — Liquid Glass
// ============================================================

import { type SelectHTMLAttributes, forwardRef, useId } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[] | readonly string[];
  placeholder?: string;
  isValid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder = 'Select an option',
      isValid = false,
      className = '',
      id: providedId,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;

    const normalizedOptions: SelectOption[] = options.map((opt) =>
      typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    return (
      <div className="space-y-2">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-white/70 tracking-wide"
        >
          {label}
          {required && (
            <span className="text-primary-400 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={`
              w-full px-5 py-3.5 rounded-xl border text-base font-medium
              liquid-glass-input text-white appearance-none
              bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M6%208L1%203h10z%22/%3E%3C/svg%3E')]
              bg-no-repeat bg-[right_16px_center]
              transition-all duration-300
              focus:outline-none
              disabled:opacity-40 disabled:cursor-not-allowed
              ${
                error
                  ? 'border-danger-500/50 focus:border-danger-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
                  : isValid
                    ? 'border-accent-500/40 focus:border-accent-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]'
                    : ''
              }
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            aria-required={required}
            {...props}
          >
            <option value="" disabled className="bg-[#141c32] text-white/50">
              {placeholder}
            </option>
            {normalizedOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#141c32] text-white">
                {opt.label}
              </option>
            ))}
          </select>

          {isValid && !error && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-accent-400 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="text-sm font-medium text-danger-400 flex items-center gap-1.5 animate-slide-up"
            role="alert"
            aria-live="polite"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
