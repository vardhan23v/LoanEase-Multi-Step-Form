// ============================================================
// Step 7: Documents Schema
// ============================================================

import { z } from 'zod';
import { FILE_CONSTRAINTS } from '@/constants';

export const documentFileSchema = z.object({
  id: z.string(),
  type: z.string(),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z
    .number()
    .max(FILE_CONSTRAINTS.maxSizeBytes, `File size must be less than ${FILE_CONSTRAINTS.maxSizeMB}MB`),
  mimeType: z.string().refine(
    (type) => FILE_CONSTRAINTS.acceptedTypes.includes(type as any),
    { message: 'Only JPEG, PNG, WebP, and PDF files are accepted' }
  ),
  preview: z.string().optional(),
  base64: z.string().optional(),
  uploadProgress: z.number().min(0).max(100),
  uploadedAt: z.string(),
});

export const documentsSchema = z.object({
  documents: z
    .array(documentFileSchema)
    .min(1, 'At least one document must be uploaded'),
  signatureBase64: z
    .string({ message: 'Signature is required' })
    .min(100, 'Please provide your signature')
    .refine(
      (val) => val.startsWith('data:image/png;base64,'),
      { message: 'Invalid signature format' }
    ),
});

export type DocumentsFormData = z.infer<typeof documentsSchema>;
