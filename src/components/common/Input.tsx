// ============================================================
// Input Component — Liquid Glass
// ============================================================

import { type InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isMasked?: boolean;
  isValid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isMasked = false,
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
    const helperId = `${id}-helper`;

    // Determine the right icon based on validation state if no custom rightIcon is provided
    const displayRightIcon = rightIcon || (isValid && !error ? (
      <svg className="w-5 h-5 text-accent-400 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    ) : null);

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

        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none group-focus-within:text-primary-400 transition-colors">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            className={`
              w-full px-5 py-3.5 rounded-xl text-base font-medium
              liquid-glass-input text-white
              placeholder:text-white/25 placeholder:font-normal
              transition-all duration-300
              focus:outline-none
              disabled:opacity-40 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-11' : ''}
              ${displayRightIcon ? 'pr-11' : ''}
              ${
                error
                  ? 'border-danger-500/50 focus:border-danger-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15),0_0_20px_rgba(239,68,68,0.1)]'
                  : isValid
                    ? 'border-accent-500/40 focus:border-accent-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15),0_0_20px_rgba(16,185,129,0.1)]'
                    : ''
              }
              ${isMasked ? 'tracking-[0.3em] font-mono' : ''}
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            aria-required={required}
            {...props}
          />

          {displayRightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
              {displayRightIcon}
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

        {!error && helperText && (
          <p id={helperId} className="text-sm text-white/40">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
