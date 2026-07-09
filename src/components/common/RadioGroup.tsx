// ============================================================
// RadioGroup Component — Liquid Glass
// ============================================================

import { forwardRef, useId } from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  label: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  direction?: 'horizontal' | 'vertical';
  required?: boolean;
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    {
      name,
      label,
      options,
      value,
      onChange,
      error,
      direction = 'horizontal',
      required,
    },
    _ref
  ) => {
    const groupId = useId();
    const errorId = `${groupId}-error`;

    return (
      <fieldset className="space-y-2" role="radiogroup" aria-labelledby={`${groupId}-label`}>
        <legend
          id={`${groupId}-label`}
          className="block text-sm font-medium text-white/70"
        >
          {label}
          {required && (
            <span className="text-primary-400 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </legend>

        <div
          className={`flex gap-3 ${
            direction === 'vertical' ? 'flex-col' : 'flex-wrap'
          }`}
        >
          {options.map((option) => {
            const optionId = `${groupId}-${option.value}`;
            const isSelected = value === option.value;

            return (
              <label
                key={option.value}
                htmlFor={optionId}
                className={`
                  flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer
                  transition-all duration-300 text-sm
                  ${
                    isSelected
                      ? 'border-primary-400/50 bg-primary-500/15 text-white shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                      : 'border-white/8 bg-white/4 text-white/60 hover:border-white/15 hover:bg-white/6'
                  }
                `}
              >
                <input
                  id={optionId}
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onChange?.(option.value)}
                  className="sr-only"
                  aria-describedby={error ? errorId : undefined}
                />
                <div
                  className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                    transition-all duration-300
                    ${isSelected ? 'border-primary-400 shadow-[0_0_6px_rgba(37,99,235,0.5)]' : 'border-white/20'}
                  `}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-primary-400" />
                  )}
                </div>
                <div>
                  <span className="font-medium">{option.label}</span>
                  {option.description && (
                    <p className="text-xs text-white/30 mt-0.5">
                      {option.description}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {error && (
          <p
            id={errorId}
            className="text-sm text-danger-400"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
