// ============================================================
// Step 4: Address Schema
// ============================================================

import { z } from 'zod';
import { ResidenceType } from '@/types';

const addressBlockSchema = z.object({
  addressLine1: z
    .string({ message: 'Address line 1 is required' })
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  addressLine2: z
    .string()
    .max(200, 'Address must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  landmark: z
    .string()
    .max(100, 'Landmark must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  pinCode: z
    .string({ message: 'PIN code is required' })
    .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit PIN code'),
  city: z
    .string({ message: 'City is required' })
    .min(2, 'City name must be at least 2 characters')
    .max(100, 'City name must be less than 100 characters'),
  state: z
    .string({ message: 'State is required' })
    .min(2, 'State name must be at least 2 characters')
    .max(100, 'State name must be less than 100 characters'),
});

export const addressSchema = z
  .object({
    currentAddress: addressBlockSchema,
    permanentSameAsCurrent: z.boolean().default(false),
    permanentAddress: addressBlockSchema.optional().nullable().or(z.object({}).passthrough()),
    residenceType: z.nativeEnum(ResidenceType, {
      message: 'Please select your residence type',
    }),
    yearsAtCurrentAddress: z
      .number({ message: 'Please enter years at current address' })
      .min(0, 'Cannot be negative')
      .max(100, 'Please enter a valid number'),
    previousAddress: addressBlockSchema.optional().nullable().or(z.object({}).passthrough()),
  })
  .superRefine((data, ctx) => {
    // If permanent address is not same as current, validate permanent address
    if (!data.permanentSameAsCurrent) {
      if (!data.permanentAddress || Object.keys(data.permanentAddress).length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['permanentAddress', 'addressLine1'],
          message: 'Permanent address is required when different from current address',
        });
      } else {
        const res = addressBlockSchema.safeParse(data.permanentAddress);
        if (!res.success) {
          res.error.issues.forEach(issue => {
            ctx.addIssue({
              ...issue,
              path: ['permanentAddress', ...issue.path],
            });
          });
        }
      }
    }

    // If less than 2 years at current address, require previous address
    if (data.yearsAtCurrentAddress < 2) {
      if (!data.previousAddress || Object.keys(data.previousAddress).length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['previousAddress', 'addressLine1'],
          message: 'Previous address is required when less than 2 years at current address',
        });
      } else {
        const res = addressBlockSchema.safeParse(data.previousAddress);
        if (!res.success) {
          res.error.issues.forEach(issue => {
            ctx.addIssue({
              ...issue,
              path: ['previousAddress', ...issue.path],
            });
          });
        }
      }
    }
  });

export type AddressFormData = z.infer<typeof addressSchema>;
export { addressBlockSchema };
