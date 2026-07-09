// ============================================================
// Step 5: Employment Details (Dynamic Forms)
// ============================================================

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { employmentSchema, type EmploymentFormData, getMonthlyIncome } from '@/schemas';
import { useFormStore, useWizardStore } from '@/store';
import { useEMICalculator } from '@/hooks';
import { Input, Select, Card, CurrencyInput } from '@/components/common';
import { EmploymentType } from '@/types';
import { EMPLOYER_TYPES, PROFESSIONS, BUSINESS_TYPES } from '@/constants';
import { formatINR } from '@/utils';
import { AccountAggregator } from './AccountAggregator';

const EMPLOYMENT_OPTIONS = [
  { value: EmploymentType.SALARIED, label: 'Salaried', icon: '💼', desc: 'Full-time employee' },
  { value: EmploymentType.SELF_EMPLOYED, label: 'Self Employed', icon: '👨‍💻', desc: 'Professional / Freelance' },
  { value: EmploymentType.BUSINESS_OWNER, label: 'Business Owner', icon: '🏭', desc: 'Own a business' },
];

interface StepProps {
  onValidChange: (isValid: boolean) => void;
}

export default function EmploymentStep({ onValidChange }: StepProps) {
  const storeData = useFormStore((s) => s.employment);
  const setEmployment = useFormStore((s) => s.setEmployment);
  const loanTypeData = useFormStore((s) => s.loanTypeData);
  const setStepValid = useWizardStore((s) => s.setStepValid);
  const [isAggregatorOpen, setIsAggregatorOpen] = useState(false);

  const {
    register,
    watch,
    setValue,
    formState: { errors: rawErrors, isValid },
  } = useForm<EmploymentFormData>({
    resolver: zodResolver(employmentSchema),
    defaultValues: storeData,
    mode: 'onChange',
  });

  const errors = rawErrors as any;

  const employmentType = watch('employmentType');
  const watchAll = watch();

  // Calculate monthly income based on employment type
  let monthlyIncome = 0;
  try {
    monthlyIncome = getMonthlyIncome(watchAll as EmploymentFormData);
  } catch {
    monthlyIncome = 0;
  }

  const { breakdown, isAffordable, affordabilityPercentage } = useEMICalculator(
    loanTypeData.loanAmount,
    loanTypeData.loanType,
    loanTypeData.tenure,
    monthlyIncome
  );

  useEffect(() => {
    onValidChange(isValid);
    setStepValid(5, isValid);
  }, [isValid, onValidChange, setStepValid]);

  useEffect(() => {
    const subscription = watch((value) => {
      setEmployment(value as EmploymentFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setEmployment]);

  const handleTypeChange = (type: EmploymentType) => {
    setValue('employmentType', type, { shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">
          Employment Details
        </h2>
        <p className="text-white/40">
          Provide your employment and income information for eligibility assessment
        </p>
      </div>

      <div className="space-y-8">
        {/* Employment Type Selector */}
        <fieldset>
          <legend className="block text-sm font-medium text-white/70 mb-3">
            Employment Type <span className="text-danger-400">*</span>
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {EMPLOYMENT_OPTIONS.map((opt) => {
              const isSelected = employmentType === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeChange(opt.value)}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all cursor-pointer
                    ${isSelected
                      ? 'border-primary-500 bg-primary-500/10 shadow-sm'
                      : 'border-white/10 bg-white hover:border-surface-300'
                    }
                  `}
                  aria-pressed={isSelected}
                >
                  <div className="text-2xl mb-1">{opt.icon}</div>
                  <div className="font-semibold text-sm text-white">{opt.label}</div>
                  <div className="text-xs text-white/40">{opt.desc}</div>
                </motion.button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex items-center justify-between p-4 bg-primary-500/10 rounded-xl border border-primary-500/20">
          <div>
            <h3 className="font-bold text-primary-300">Auto-fill Income Details</h3>
            <p className="text-sm text-primary-400 mt-0.5">Connect your bank account securely to verify income instantly.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAggregatorOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Connect Bank
          </button>
        </div>

        {/* Dynamic Form Fields */}
        <AnimatePresence mode="wait">
          <motion.div
            key={employmentType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="space-y-4">
                {employmentType === EmploymentType.SALARIED && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Company Name"
                        required
                        placeholder="e.g. Infosys"
                        error={(errors as Record<string, { message?: string }>).companyName?.message}
                        isValid={!errors.companyName && watch('companyName')?.length! > 0}
                        {...register('companyName')}
                      />
                      <Input
                        label="Designation"
                        required
                        placeholder="e.g. Senior Developer"
                        error={(errors as Record<string, { message?: string }>).designation?.message}
                        isValid={!errors.designation && watch('designation')?.length! > 0}
                        {...register('designation')}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Years of Experience"
                        required
                        type="number"
                        min={0}
                        max={50}
                        placeholder="e.g. 5"
                        error={(errors as Record<string, { message?: string }>).yearsOfExperience?.message}
                        isValid={!errors.yearsOfExperience && typeof watch('yearsOfExperience') === 'number'}
                        {...register('yearsOfExperience', { valueAsNumber: true })}
                      />
                      <Select
                        label="Employer Type"
                        required
                        options={[...EMPLOYER_TYPES]}
                        error={(errors as Record<string, { message?: string }>).employerType?.message}
                        isValid={!errors.employerType && watch('employerType')?.length! > 0}
                        {...register('employerType')}
                      />
                    </div>
                    <CurrencyInput
                      label="Monthly Salary (Net)"
                      required
                      min={10000}
                      placeholder="e.g. 75000"
                      error={(errors as Record<string, { message?: string }>).monthlySalary?.message}
                      isValid={!errors.monthlySalary && typeof watch('monthlySalary') === 'number' && (watch('monthlySalary') ?? 0) >= 10000}
                      leftIcon={<span className="text-xs font-medium group-focus-within:text-primary-400 transition-colors">₹</span>}
                      {...register('monthlySalary', { valueAsNumber: true })}
                    />
                  </>
                )}

                {employmentType === EmploymentType.SELF_EMPLOYED && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="Profession"
                        required
                        options={[...PROFESSIONS]}
                        error={(errors as Record<string, { message?: string }>).profession?.message}
                        isValid={!errors.profession && watch('profession')?.length! > 0}
                        {...register('profession')}
                      />
                      <Input
                        label="Years of Practice"
                        required
                        type="number"
                        min={0}
                        max={50}
                        placeholder="e.g. 8"
                        error={(errors as Record<string, { message?: string }>).yearsOfPractice?.message}
                        isValid={!errors.yearsOfPractice && typeof watch('yearsOfPractice') === 'number'}
                        {...register('yearsOfPractice', { valueAsNumber: true })}
                      />
                    </div>
                    <Input
                      label="Professional Registration No. (Optional)"
                      placeholder="Optional"
                      error={(errors as Record<string, { message?: string }>).professionalRegistration?.message}
                      isValid={!errors.professionalRegistration && watch('professionalRegistration')?.length! > 0}
                      {...register('professionalRegistration')}
                    />
                    <CurrencyInput
                      label="Monthly Income (Net)"
                      required
                      min={10000}
                      placeholder="e.g. 100000"
                      error={(errors as Record<string, { message?: string }>).monthlyIncome?.message}
                      isValid={!errors.monthlyIncome && typeof watch('monthlyIncome') === 'number' && (watch('monthlyIncome') ?? 0) >= 10000}
                      leftIcon={<span className="text-xs font-medium group-focus-within:text-primary-400 transition-colors">₹</span>}
                      {...register('monthlyIncome', { valueAsNumber: true })}
                    />
                  </>
                )}

                {employmentType === EmploymentType.BUSINESS_OWNER && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Business Name"
                        required
                        placeholder="e.g. ABC Enterprises"
                        error={(errors as Record<string, { message?: string }>).businessName?.message}
                        {...register('businessName')}
                      />
                      <Select
                        label="Business Type"
                        required
                        options={[...BUSINESS_TYPES]}
                        error={(errors as Record<string, { message?: string }>).businessType?.message}
                        {...register('businessType')}
                      />
                    </div>
                    <Input
                      label="GST Number"
                      required
                      placeholder="27AADCB2230M1ZR"
                      maxLength={15}
                      error={(errors as Record<string, { message?: string }>).gstNumber?.message}
                      helperText="15-character GST identification number"
                      {...register('gstNumber', {
                        onChange: (e) => {
                          e.target.value = e.target.value.toUpperCase();
                        },
                      })}
                      className="uppercase tracking-wider font-mono"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Years in Business"
                        required
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 10"
                        error={(errors as Record<string, { message?: string }>).yearsInBusiness?.message}
                        {...register('yearsInBusiness', { valueAsNumber: true })}
                      />
                      <CurrencyInput
                        label="Annual Turnover"
                        required
                        min={100000}
                        placeholder="e.g. 5000000"
                        error={(errors as Record<string, { message?: string }>).annualTurnover?.message}
                        leftIcon={<span className="text-xs font-medium">₹</span>}
                        {...register('annualTurnover', { valueAsNumber: true })}
                      />
                    </div>
                    <CurrencyInput
                      label="Monthly Income (Net)"
                      required
                      min={10000}
                      placeholder="e.g. 150000"
                      error={(errors as Record<string, { message?: string }>).monthlyIncome?.message}
                      leftIcon={<span className="text-xs font-medium">₹</span>}
                      {...register('monthlyIncome', { valueAsNumber: true })}
                    />
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* EMI Affordability Indicator */}
        {monthlyIncome > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className={`${
                isAffordable
                  ? 'border-accent-500/20 bg-accent-500/10/50'
                  : 'border-warning-500/30 bg-warning-50/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`text-2xl ${isAffordable ? '' : ''}`}
                >
                  {isAffordable ? '✅' : '⚠️'}
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-white">
                    EMI Affordability Check
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-white/40 block">Monthly EMI</span>
                      <span className="font-semibold text-white">
                        {formatINR(breakdown.monthlyEMI, true)}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Monthly Income</span>
                      <span className="font-semibold text-white">
                        {formatINR(monthlyIncome, false)}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/40 block">EMI/Income</span>
                      <span
                        className={`font-semibold ${
                          isAffordable ? 'text-accent-400' : 'text-warning-600'
                        }`}
                      >
                        {affordabilityPercentage}%
                      </span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Status</span>
                      <span
                        className={`font-semibold ${
                          isAffordable ? 'text-accent-400' : 'text-warning-600'
                        }`}
                      >
                        {isAffordable ? 'Affordable' : 'High EMI'}
                      </span>
                    </div>
                  </div>
                  {!isAffordable && (
                    <p className="text-xs text-warning-600">
                      EMI exceeds 40% of monthly income. A co-applicant may be required.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
      
      <AccountAggregator
        isOpen={isAggregatorOpen}
        onClose={() => setIsAggregatorOpen(false)}
        onSuccess={(income) => {
          setIsAggregatorOpen(false);
          if (employmentType === EmploymentType.SALARIED) {
            setValue('monthlySalary', income, { shouldValidate: true, shouldDirty: true });
          } else {
            setValue('monthlyIncome', income, { shouldValidate: true, shouldDirty: true });
          }
        }}
      />
    </motion.div>
  );
}
