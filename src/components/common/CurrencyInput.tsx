// ============================================================
// CurrencyInput Component — Real-time formatting
// ============================================================

import { forwardRef, useState, useEffect, type ChangeEvent } from 'react';
import { Input } from './Input';

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  isValid?: boolean;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>((props, ref) => {
  const { onChange, value, ...rest } = props;
  const [displayValue, setDisplayValue] = useState('');

  // Sync internal display value when external value changes (e.g. initial load or RHF reset)
  useEffect(() => {
    if (value !== undefined && value !== null && value !== '') {
      const num = Number(value);
      if (!isNaN(num)) {
        setDisplayValue(new Intl.NumberFormat('en-IN').format(num));
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const rawValue = e.target.value.replace(/\D/g, '');
    
    // Update visual state immediately
    if (rawValue) {
      const parsed = parseInt(rawValue, 10);
      setDisplayValue(new Intl.NumberFormat('en-IN').format(parsed));
    } else {
      setDisplayValue('');
    }

    // Proxy the raw value to react-hook-form
    if (onChange) {
      // Clone the event to override the target value with the unformatted number string.
      // RHF's valueAsNumber will successfully parse this string into a number.
      const eventClone = {
        ...e,
        target: {
          ...e.target,
          value: rawValue,
          name: e.target.name
        }
      } as ChangeEvent<HTMLInputElement>;
      
      onChange(eventClone);
    }
  };

  return (
    <Input
      ref={ref}
      {...rest}
      type="text" // Must be text to support commas
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
    />
  );
});

CurrencyInput.displayName = 'CurrencyInput';
