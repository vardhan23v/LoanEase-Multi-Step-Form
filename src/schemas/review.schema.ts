// ============================================================
// Step 8: Review & Consent Schema
// ============================================================

import { z } from 'zod';

export const reviewSchema = z.object({
  termsAndConditions: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must accept the Terms & Conditions',
    }),
  creditBureauCheck: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must authorize the Credit Bureau check',
    }),
  eSignAuthorization: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must authorize E-Sign',
    }),
  dataSharingAgreement: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to the Data Sharing Agreement',
    }),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
