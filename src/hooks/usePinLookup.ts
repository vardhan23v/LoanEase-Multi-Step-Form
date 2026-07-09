// ============================================================
// usePinLookup Hook — Debounced PIN → City/State
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { PIN_CODE_DATABASE } from '@/constants';
import type { PinLookupResult } from '@/types';

export function usePinLookup(pinCode: string, debounceMs = 300) {
  const [result, setResult] = useState<PinLookupResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lookup = useCallback((pin: string) => {
    if (pin.length !== 6 || !/^[1-9]\d{5}$/.test(pin)) {
      setResult(null);
      return;
    }

    setIsLoading(true);

    // Simulate API latency
    setTimeout(() => {
      const data = PIN_CODE_DATABASE[pin];
      if (data) {
        setResult({
          city: data.city,
          state: data.state,
          district: data.district,
          found: true,
        });
      } else {
        setResult({ city: '', state: '', district: '', found: false });
      }
      setIsLoading(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (pinCode.length === 6) {
      timerRef.current = setTimeout(() => {
        lookup(pinCode);
      }, debounceMs);
    } else {
      setResult(null);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pinCode, debounceMs, lookup]);

  return { result, isLoading };
}
