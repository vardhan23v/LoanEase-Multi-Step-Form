// ============================================================
// Step 2: Personal Information Schema
// ============================================================

import { z } from 'zod';
import { Gender, MaritalStatus } from '@/types';
import { calculateAge } from '@/utils/validators';

export const personalInfoSchema = z
  .object({
    fullName: z
      .string({ message: 'Full name is required' })
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name must be less than 100 characters')
      .regex(/^[a-zA-Z\s.]+$/, 'Name can only contain letters, spaces, and periods'),
    dateOfBirth: z
      .string({ message: 'Date of birth is required' })
      .min(1, 'Date of birth is required')
      .refine(
        (dob) => {
          const age = calculateAge(dob);
          return age >= 18;
        },
        { message: 'You must be at least 18 years old' }
      )
      .refine(
        (dob) => {
          const age = calculateAge(dob);
          return age <= 65;
        },
        { message: 'Applicant must be 65 years or younger' }
      ),
    gender: z.nativeEnum(Gender, {
      message: 'Please select your gender',
    }),
    maritalStatus: z.nativeEnum(MaritalStatus, {
      message: 'Please select your marital status',
    }),
    fatherName: z
      .string({ message: "Father's name is required" })
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name must be less than 100 characters')
      .regex(/^[a-zA-Z\s.]+$/, 'Name can only contain letters, spaces, and periods'),
    motherName: z
      .string({ message: "Mother's name is required" })
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name must be less than 100 characters')
      .regex(/^[a-zA-Z\s.]+$/, 'Name can only contain letters, spaces, and periods'),
    email: z
      .string({ message: 'Email is required' })
      .email('Please enter a valid email address')
      .max(254, 'Email is too long'),
    mobile: z
      .string({ message: 'Mobile number is required' })
      .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
    alternateMobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (
      data.alternateMobile &&
      data.alternateMobile.length > 0 &&
      data.alternateMobile === data.mobile
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['alternateMobile'],
        message: 'Alternate mobile must be different from primary mobile',
      });
    }
  });

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
