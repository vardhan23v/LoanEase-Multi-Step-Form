// ============================================================
// Step 5: Employment Schema (Discriminated Union)
// ============================================================

import { z } from 'zod';
import { EmploymentType } from '@/types';
import { isValidGST } from '@/utils/validators';

const salariedSchema = z.object({
  employmentType: z.literal(EmploymentType.SALARIED),
  companyName: z
    .string({ message: 'Company name is required' })
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name is too long'),
  designation: z
    .string({ message: 'Designation is required' })
    .min(2, 'Designation must be at least 2 characters')
    .max(100, 'Designation is too long'),
  yearsOfExperience: z
    .number({ message: 'Years of experience is required' })
    .min(0, 'Cannot be negative')
    .max(50, 'Please enter a valid number'),
  monthlySalary: z
    .number({ message: 'Monthly salary is required' })
    .min(10000, 'Minimum salary must be ₹10,000')
    .max(100000000, 'Please enter a valid salary amount'),
  employerType: z
    .string({ message: 'Employer type is required' })
    .min(1, 'Please select an employer type'),
});

const selfEmployedSchema = z.object({
  employmentType: z.literal(EmploymentType.SELF_EMPLOYED),
  profession: z
    .string({ message: 'Profession is required' })
    .min(2, 'Profession must be at least 2 characters')
    .max(100, 'Profession is too long'),
  yearsOfPractice: z
    .number({ message: 'Years of practice is required' })
    .min(0, 'Cannot be negative')
    .max(50, 'Please enter a valid number'),
  monthlyIncome: z
    .number({ message: 'Monthly income is required' })
    .min(10000, 'Minimum income must be ₹10,000')
    .max(100000000, 'Please enter a valid income amount'),
  professionalRegistration: z
    .string()
    .max(50, 'Registration number is too long')
    .optional()
    .or(z.literal('')),
});

const businessOwnerSchema = z.object({
  employmentType: z.literal(EmploymentType.BUSINESS_OWNER),
  businessName: z
    .string({ message: 'Business name is required' })
    .min(2, 'Business name must be at least 2 characters')
    .max(200, 'Business name is too long'),
  businessType: z
    .string({ message: 'Business type is required' })
    .min(1, 'Please select a business type'),
  gstNumber: z
    .string({ message: 'GST number is required' })
    .transform((val) => val.toUpperCase())
    .pipe(
      z
        .string()
        .length(15, 'GST number must be exactly 15 characters')
        .refine((val) => isValidGST(val), {
          message: 'Please enter a valid GST number (e.g., 27AADCB2230M1ZR)',
        })
    ),
  yearsInBusiness: z
    .number({ message: 'Years in business is required' })
    .min(0, 'Cannot be negative')
    .max(100, 'Please enter a valid number'),
  annualTurnover: z
    .number({ message: 'Annual turnover is required' })
    .min(100000, 'Minimum annual turnover is ₹1,00,000')
    .max(10000000000, 'Please enter a valid amount'),
  monthlyIncome: z
    .number({ message: 'Monthly income is required' })
    .min(10000, 'Minimum income must be ₹10,000')
    .max(100000000, 'Please enter a valid income amount'),
});

export const employmentSchema = z.discriminatedUnion('employmentType', [
  salariedSchema,
  selfEmployedSchema,
  businessOwnerSchema,
]);

export type EmploymentFormData = z.infer<typeof employmentSchema>;

export { salariedSchema, selfEmployedSchema, businessOwnerSchema };

/**
 * Get monthly income from employment data regardless of type.
 */
export function getMonthlyIncome(employment: EmploymentFormData): number {
  switch (employment.employmentType) {
    case EmploymentType.SALARIED:
      return employment.monthlySalary;
    case EmploymentType.SELF_EMPLOYED:
    case EmploymentType.BUSINESS_OWNER:
      return employment.monthlyIncome;
  }
}
