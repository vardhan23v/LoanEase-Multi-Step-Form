// ============================================================
// Step 3: Identity Verification Schema
// ============================================================

import { z } from 'zod';
import { isValidAadhaar } from '@/utils/validators';

export const identitySchema = z.object({
  panNumber: z
    .string({ message: 'PAN number is required' })
    .length(10, 'PAN must be exactly 10 characters')
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]$/,
      'PAN format must be ABCDE1234F (5 letters, 4 digits, 1 letter)'
    )
    .transform((val) => val.toUpperCase()),
  aadhaarNumber: z
    .string({ message: 'Aadhaar number is required' })
    .transform((val) => val.replace(/\s/g, ''))
    .pipe(
      z
        .string()
        .length(12, 'Aadhaar must be exactly 12 digits')
        .regex(/^\d{12}$/, 'Aadhaar must contain only digits')
        .refine((val) => val[0] !== '0' && val[0] !== '1', {
          message: 'Aadhaar cannot start with 0 or 1',
        })
        .refine((val) => isValidAadhaar(val), {
          message: 'Invalid Aadhaar number (Verhoeff checksum failed)',
        })
    ),
  panVerified: z.boolean().default(false),
  aadhaarVerified: z.boolean().default(false),
  identityConsent: z
    .boolean({ message: 'You must consent to identity verification' })
    .refine((val) => val === true, {
      message: 'You must consent to identity verification to proceed',
    }),
});

export type IdentityFormData = z.infer<typeof identitySchema>;
