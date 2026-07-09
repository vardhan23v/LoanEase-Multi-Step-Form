// ============================================================
// EMI Calculation Utilities
// ============================================================

import type { EMIBreakdown } from '@/types';
import { INTEREST_RATES, PROCESSING_FEE_RATES } from '@/constants';
import { LoanType } from '@/types';

/**
 * Standard EMI Formula:
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 *
 * Where:
 *   P = Principal loan amount
 *   r = Monthly interest rate (annual rate / 12 / 100)
 *   n = Tenure in months
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): number {
  if (principal <= 0 || annualInterestRate <= 0 || tenureMonths <= 0) {
    return 0;
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const power = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * power) / (power - 1);

  return Math.round(emi * 100) / 100;
}

/**
 * Calculate total interest payable over the loan tenure.
 */
export function calculateTotalInterest(
  emi: number,
  tenureMonths: number,
  principal: number
): number {
  return Math.round((emi * tenureMonths - principal) * 100) / 100;
}

/**
 * Calculate processing fee based on loan type.
 */
export function calculateProcessingFee(
  principal: number,
  loanType: LoanType
): number {
  const rate = PROCESSING_FEE_RATES[loanType];
  return Math.round((principal * rate) / 100);
}

/**
 * Complete EMI breakdown for a given loan configuration.
 */
export function getEMIBreakdown(
  principal: number,
  loanType: LoanType,
  tenureMonths: number
): EMIBreakdown {
  const interestRate = INTEREST_RATES[loanType];
  const monthlyEMI = calculateEMI(principal, interestRate, tenureMonths);
  const totalInterest = calculateTotalInterest(monthlyEMI, tenureMonths, principal);
  const processingFee = calculateProcessingFee(principal, loanType);
  const totalCost = principal + totalInterest + processingFee;

  return {
    monthlyEMI,
    totalInterest,
    processingFee,
    totalCost,
    principal,
    interestRate,
    tenure: tenureMonths,
  };
}

/**
 * Check if EMI is affordable based on monthly income.
 * EMI should not exceed 40% of monthly income.
 */
export function isEMIAffordable(
  emi: number,
  monthlyIncome: number,
  maxRatio = 0.4
): boolean {
  if (monthlyIncome <= 0) return false;
  return emi / monthlyIncome <= maxRatio;
}

/**
 * Get the maximum affordable EMI for a given income.
 */
export function getMaxAffordableEMI(
  monthlyIncome: number,
  maxRatio = 0.4
): number {
  return Math.floor(monthlyIncome * maxRatio);
}
