// ============================================================
// Step 1: Loan Type Selection
// ============================================================

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { loanTypeSchema, type LoanTypeFormData } from '@/schemas';
import { useFormStore, useWizardStore } from '@/store';
import { Input, Select, Card } from '@/components/common';
import { LoanType } from '@/types';
import { LOAN_LIMITS, LOAN_PURPOSES } from '@/constants';
import { formatINRCompact } from '@/utils';

const LOAN_TYPE_OPTIONS = [
  {
    value: LoanType.PERSONAL,
    label: 'Personal Loan',
    icon: '💳',
    desc: 'For personal needs, medical, travel, wedding',
    color: 'from-violet-500 to-purple-600',
  },
  {
    value: LoanType.HOME,
    label: 'Home Loan',
    icon: '🏠',
    desc: 'Purchase, construction, or renovation',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    value: LoanType.BUSINESS,
    label: 'Business Loan',
    icon: '🏢',
    desc: 'Working capital, expansion, equipment',
    color: 'from-amber-500 to-orange-500',
  },
];

interface StepProps {
  onValidChange: (isValid: boolean) => void;
}

export default function LoanTypeStep({ onValidChange }: StepProps) {
  const storeData = useFormStore((s) => s.loanTypeData);
  const setLoanTypeData = useFormStore((s) => s.setLoanTypeData);
  const setStepValid = useWizardStore((s) => s.setStepValid);

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<LoanTypeFormData>({
    resolver: zodResolver(loanTypeSchema),
    defaultValues: storeData,
    mode: 'onChange',
  });

  const selectedType = watch('loanType');
  const loanAmount = watch('loanAmount');
  const limits = LOAN_LIMITS[selectedType];
  const purposes = LOAN_PURPOSES[selectedType];

  // Sync validation state
  useEffect(() => {
    onValidChange(isValid);
    setStepValid(1, isValid);
  }, [isValid, onValidChange, setStepValid]);

  // Sync to store on change
  useEffect(() => {
    const subscription = watch((value) => {
      setLoanTypeData(value as LoanTypeFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setLoanTypeData]);

  // Reset amount and tenure when loan type changes
  useEffect(() => {
    const newLimits = LOAN_LIMITS[selectedType];
    if (loanAmount < newLimits.minAmount || loanAmount > newLimits.maxAmount) {
      setValue('loanAmount', newLimits.minAmount, { shouldValidate: true });
    }
    setValue('purpose', '', { shouldValidate: true });
  }, [selectedType, setValue, loanAmount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">
          Choose Your Loan
        </h2>
        <p className="text-white/40">
          Select the type of loan and specify your requirements
        </p>
      </div>

      <form onSubmit={handleSubmit(() => {})} className="space-y-8">
        {/* Loan Type Cards */}
        <fieldset>
          <legend className="block text-sm font-medium text-white/70 mb-3">
            Loan Type <span className="text-danger-400">*</span>
          </legend>
          <Controller
            name="loanType"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {LOAN_TYPE_OPTIONS.map((option) => {
                  const isSelected = field.value === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => field.onChange(option.value)}
                      className={`
                        relative p-5 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer
                        ${
                          isSelected
                            ? 'border-primary-500 bg-primary-500/10 shadow-md shadow-primary-500/10'
                            : 'border-white/10 bg-white hover:border-surface-300 hover:shadow-sm'
                        }
                      `}
                      aria-pressed={isSelected}
                      role="radio"
                      aria-checked={isSelected}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="loan-type-check"
                          className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center"
                        >
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                      <div className={`text-3xl mb-3`}>{option.icon}</div>
                      <h3 className="font-semibold text-white text-base">
                        {option.label}
                      </h3>
                      <p className="text-xs text-white/40 mt-1">
                        {option.desc}
                      </p>
                      <div className="mt-3 text-xs text-white/30">
                        {formatINRCompact(LOAN_LIMITS[option.value].minAmount)} –{' '}
                        {formatINRCompact(LOAN_LIMITS[option.value].maxAmount)}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          />
          {errors.loanType && (
            <p className="mt-2 text-sm text-danger-400" role="alert">
              {errors.loanType.message}
            </p>
          )}
        </fieldset>

        {/* Loan Amount */}
        <Card>
          <div className="space-y-4">
            <Controller
              name="loanAmount"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/70">
                      Loan Amount <span className="text-danger-400">*</span>
                    </label>
                    <span className="text-lg font-bold text-primary-400">
                      {formatINRCompact(field.value)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={limits.minAmount}
                    max={limits.maxAmount}
                    step={selectedType === LoanType.HOME ? 100000 : 10000}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-primary-600
                      [&::-webkit-slider-thumb]:shadow-md
                      [&::-webkit-slider-thumb]:cursor-pointer"
                    aria-label="Loan amount"
                  />
                  <div className="flex justify-between text-xs text-white/30">
                    <span>{formatINRCompact(limits.minAmount)}</span>
                    <span>{formatINRCompact(limits.maxAmount)}</span>
                  </div>
                  {errors.loanAmount && (
                    <p className="text-sm text-danger-400" role="alert">
                      {errors.loanAmount.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Tenure */}
            <Controller
              name="tenure"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/70">
                      Tenure <span className="text-danger-400">*</span>
                    </label>
                    <span className="text-sm font-semibold text-white/70">
                      {field.value} months
                      {field.value >= 12 && (
                        <span className="text-white/30 ml-1">
                          ({(field.value / 12).toFixed(1)} yrs)
                        </span>
                      )}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={limits.minTenure}
                    max={limits.maxTenure}
                    step={selectedType === LoanType.HOME ? 12 : 6}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-primary-600
                      [&::-webkit-slider-thumb]:shadow-md
                      [&::-webkit-slider-thumb]:cursor-pointer"
                    aria-label="Loan tenure in months"
                  />
                  <div className="flex justify-between text-xs text-white/30">
                    <span>{limits.minTenure} months</span>
                    <span>{limits.maxTenure} months</span>
                  </div>
                  {errors.tenure && (
                    <p className="text-sm text-danger-400" role="alert">
                      {errors.tenure.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Approval Probability Meter */}
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Approval Probability</span>
                <span className={`text-sm font-bold ${
                  loanAmount > limits.maxAmount * 0.8 ? 'text-warning-600' : 'text-success-600'
                }`}>
                  {loanAmount > limits.maxAmount * 0.8 ? 'Fair' : loanAmount > limits.maxAmount * 0.5 ? 'Good' : 'Excellent'}
                </span>
              </div>
              <div className="h-3 w-full bg-white/8 rounded-full overflow-hidden flex">
                <motion.div 
                  className="h-full bg-gradient-to-r from-success-400 to-success-600"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.max(30, 100 - (loanAmount / limits.maxAmount) * 60)}%`,
                    backgroundColor: loanAmount > limits.maxAmount * 0.8 ? '#f59e0b' : '#10b981'
                  }}
                  transition={{ type: 'spring', bounce: 0.2 }}
                />
              </div>
              <p className="text-xs text-white/30 mt-2">
                Based on requested amount and current market trends.
              </p>
            </div>
          </div>
        </Card>

        {/* Purpose & Referral */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Select
            label="Loan Purpose"
            required
            options={purposes}
            error={errors.purpose?.message}
            isValid={isValid && !errors.purpose}
            {...register('purpose')}
          />
          <Input
            label="Referral Code (Optional)"
            placeholder="e.g. REF2024"
            error={errors.referralCode?.message}
            isValid={!errors.referralCode && watch('referralCode')?.length! > 0}
            {...register('referralCode')}
          />
        </div>
      </form>
    </motion.div>
  );
}
