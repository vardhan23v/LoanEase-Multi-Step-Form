// ============================================================
// Step 1: Loan Type Selection Schema
// ============================================================

import { z } from 'zod';
import { LoanType } from '@/types';
import { LOAN_LIMITS } from '@/constants';

export const loanTypeSchema = z
  .object({
    loanType: z.nativeEnum(LoanType, {
      message: 'Please select a loan type',
    }),
    loanAmount: z.number({ message: 'Please enter a loan amount' }),
    tenure: z
      .number({ message: 'Please select a tenure' })
      .int('Tenure must be in whole months'),
    purpose: z
      .string({ message: 'Please select a purpose' })
      .min(1, 'Please select a purpose'),
    referralCode: z
      .string()
      .regex(/^[A-Z0-9]{4,10}$/i, 'Invalid referral code format')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const limits = LOAN_LIMITS[data.loanType];

    if (data.loanAmount < limits.minAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanAmount'],
        message: `Minimum loan amount is ₹${limits.minAmount.toLocaleString('en-IN')}`,
      });
    }

    if (data.loanAmount > limits.maxAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanAmount'],
        message: `Maximum loan amount is ₹${limits.maxAmount.toLocaleString('en-IN')}`,
      });
    }

    if (data.tenure < limits.minTenure) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tenure'],
        message: `Minimum tenure is ${limits.minTenure} months`,
      });
    }

    if (data.tenure > limits.maxTenure) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tenure'],
        message: `Maximum tenure is ${limits.maxTenure} months`,
      });
    }
  });

export type LoanTypeFormData = z.infer<typeof loanTypeSchema>;
