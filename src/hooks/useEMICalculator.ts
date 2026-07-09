// ============================================================
// useEMICalculator Hook
// ============================================================

import { useMemo } from 'react';
import { getEMIBreakdown, isEMIAffordable, getMaxAffordableEMI } from '@/utils/emi';
import { LoanType } from '@/types';
import type { EMIBreakdown } from '@/types';

interface EMICalculatorResult {
  breakdown: EMIBreakdown;
  isAffordable: boolean;
  maxEMI: number;
  affordabilityPercentage: number;
}

export function useEMICalculator(
  principal: number,
  loanType: LoanType,
  tenureMonths: number,
  monthlyIncome: number
): EMICalculatorResult {
  return useMemo(() => {
    const breakdown = getEMIBreakdown(principal, loanType, tenureMonths);
    const affordable = isEMIAffordable(breakdown.monthlyEMI, monthlyIncome);
    const maxEMI = getMaxAffordableEMI(monthlyIncome);
    const affordabilityPercentage =
      monthlyIncome > 0
        ? Math.round((breakdown.monthlyEMI / monthlyIncome) * 100)
        : 0;

    return {
      breakdown,
      isAffordable: affordable,
      maxEMI,
      affordabilityPercentage,
    };
  }, [principal, loanType, tenureMonths, monthlyIncome]);
}
