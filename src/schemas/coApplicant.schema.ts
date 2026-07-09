// ============================================================
// Step 6: Co-Applicant Schema (Conditional)
// ============================================================

import { z } from 'zod';
import { RelationshipType } from '@/types';

export const coApplicantSchema = z
  .object({
    required: z.boolean(),
    fullName: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name is too long')
      .regex(/^[a-zA-Z\s.]+$/, 'Name can only contain letters, spaces, and periods')
      .optional()
      .or(z.literal('')),
    panNumber: z
      .string()
      .regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]$/,
        'PAN format must be ABCDE1234F'
      )
      .optional()
      .or(z.literal('')),
    relationship: z.nativeEnum(RelationshipType).optional(),
    monthlyIncome: z
      .number()
      .min(10000, 'Minimum income must be ₹10,000')
      .optional(),
    coApplicantConsent: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.required) return; // Skip validation if co-applicant not required

    if (!data.fullName || data.fullName.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fullName'],
        message: "Co-applicant's full name is required",
      });
    }

    if (!data.panNumber || data.panNumber.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['panNumber'],
        message: "Co-applicant's PAN number is required",
      });
    }

    if (!data.relationship) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['relationship'],
        message: 'Please select the relationship with co-applicant',
      });
    }

    if (!data.monthlyIncome || data.monthlyIncome < 10000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['monthlyIncome'],
        message: "Co-applicant's monthly income is required (min ₹10,000)",
      });
    }

    if (!data.coApplicantConsent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['coApplicantConsent'],
        message: 'Co-applicant consent is required',
      });
    }
  });

export type CoApplicantFormData = z.infer<typeof coApplicantSchema>;
