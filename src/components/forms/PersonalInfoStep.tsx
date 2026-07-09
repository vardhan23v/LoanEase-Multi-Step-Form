// ============================================================
// Step 2: Personal Information
// ============================================================

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { personalInfoSchema, type PersonalInfoFormData } from '@/schemas';
import { useFormStore, useWizardStore } from '@/store';
import { Input, Select, RadioGroup } from '@/components/common';
import { Gender, MaritalStatus } from '@/types';

const GENDER_OPTIONS = [
  { value: Gender.MALE, label: 'Male' },
  { value: Gender.FEMALE, label: 'Female' },
  { value: Gender.OTHER, label: 'Other' },
];

const MARITAL_OPTIONS = [
  { value: MaritalStatus.SINGLE, label: 'Single' },
  { value: MaritalStatus.MARRIED, label: 'Married' },
  { value: MaritalStatus.DIVORCED, label: 'Divorced' },
  { value: MaritalStatus.WIDOWED, label: 'Widowed' },
];

interface StepProps {
  onValidChange: (isValid: boolean) => void;
}

export default function PersonalInfoStep({ onValidChange }: StepProps) {
  const storeData = useFormStore((s) => s.personalInfo);
  const setPersonalInfo = useFormStore((s) => s.setPersonalInfo);
  const setStepValid = useWizardStore((s) => s.setStepValid);

  const {
    register,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: storeData,
    mode: 'onChange',
  });

  useEffect(() => {
    onValidChange(isValid);
    setStepValid(2, isValid);
  }, [isValid, onValidChange, setStepValid]);

  useEffect(() => {
    const subscription = watch((value) => {
      setPersonalInfo(value as PersonalInfoFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setPersonalInfo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">
          Personal Information
        </h2>
        <p className="text-white/40">
          Tell us about yourself. This information will be used for KYC verification.
        </p>
      </div>

      <div className="space-y-8">
        <Input
          label="Full Name (as per PAN)"
          required
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          isValid={isValid && !errors.fullName}
          autoFocus
          {...register('fullName')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Date of Birth"
            required
            type="date"
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
              .toISOString()
              .split('T')[0]}
            min={new Date(new Date().setFullYear(new Date().getFullYear() - 65))
              .toISOString()
              .split('T')[0]}
            error={errors.dateOfBirth?.message}
            isValid={!errors.dateOfBirth && watch('dateOfBirth')?.length! > 0}
            helperText="Age must be between 18 and 65"
            {...register('dateOfBirth')}
          />

          <Select
            label="Marital Status"
            required
            options={MARITAL_OPTIONS}
            error={errors.maritalStatus?.message}
            isValid={isValid && !errors.maritalStatus}
            {...register('maritalStatus')}
          />
        </div>

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name={field.name}
              label="Gender"
              required
              options={GENDER_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.gender?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Father's Name"
            required
            placeholder="Enter father's name"
            error={errors.fatherName?.message}
            isValid={!errors.fatherName && watch('fatherName')?.length! > 0}
            {...register('fatherName')}
          />
          <Input
            label="Mother's Name"
            required
            placeholder="Enter mother's name"
            error={errors.motherName?.message}
            isValid={!errors.motherName && watch('motherName')?.length! > 0}
            {...register('motherName')}
          />
        </div>

        <Input
          label="Email Address"
          required
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          isValid={!errors.email && watch('email')?.includes('@')}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          {...register('email')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Mobile Number"
            required
            type="tel"
            placeholder="9876543210"
            maxLength={10}
            error={errors.mobile?.message}
            isValid={!errors.mobile && watch('mobile')?.length === 10}
            helperText="10-digit Indian mobile number"
            leftIcon={<span className="text-sm font-semibold text-white/40 group-focus-within:text-primary-400 transition-colors">+91</span>}
            {...register('mobile')}
          />
          <Input
            label="Alternate Mobile (Optional)"
            type="tel"
            placeholder="9876543210"
            maxLength={10}
            error={errors.alternateMobile?.message}
            isValid={!errors.alternateMobile && watch('alternateMobile')?.length === 10}
            leftIcon={<span className="text-sm font-semibold text-white/40 group-focus-within:text-primary-400 transition-colors">+91</span>}
            {...register('alternateMobile')}
          />
        </div>
      </div>
    </motion.div>
  );
}
