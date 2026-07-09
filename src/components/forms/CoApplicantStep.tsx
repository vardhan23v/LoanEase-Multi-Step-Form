// ============================================================
// Step 6: Co-Applicant (Conditional)
// ============================================================

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { coApplicantSchema, type CoApplicantFormData, getMonthlyIncome } from '@/schemas';
import { useFormStore, useWizardStore } from '@/store';
import { Input, Select, Checkbox, Card, CurrencyInput } from '@/components/common';
import { LoanType, RelationshipType } from '@/types';
import { CO_APPLICANT_CONFIG, INTEREST_RATES } from '@/constants';
import { calculateEMI, formatINR } from '@/utils';

const RELATIONSHIP_OPTIONS = [
  { value: RelationshipType.SPOUSE, label: 'Spouse' },
  { value: RelationshipType.PARENT, label: 'Parent' },
  { value: RelationshipType.SIBLING, label: 'Sibling' },
  { value: RelationshipType.CHILD, label: 'Child' },
  { value: RelationshipType.OTHER, label: 'Other' },
];

interface StepProps {
  onValidChange: (isValid: boolean) => void;
}

export default function CoApplicantStep({ onValidChange }: StepProps) {
  const storeData = useFormStore((s) => s.coApplicant);
  const setCoApplicant = useFormStore((s) => s.setCoApplicant);
  const loanTypeData = useFormStore((s) => s.loanTypeData);
  const employment = useFormStore((s) => s.employment);
  const setStepValid = useWizardStore((s) => s.setStepValid);

  // Determine if co-applicant is required
  const isRequired = useMemo(() => {
    const isHomeLoanAboveThreshold =
      loanTypeData.loanType === LoanType.HOME &&
      loanTypeData.loanAmount > CO_APPLICANT_CONFIG.homeLoanAmountThreshold;

    let monthlyIncome = 0;
    try {
      monthlyIncome = getMonthlyIncome(employment);
    } catch {
      monthlyIncome = 0;
    }

    const emi = calculateEMI(
      loanTypeData.loanAmount,
      INTEREST_RATES[loanTypeData.loanType],
      loanTypeData.tenure
    );

    const emiExceedsAffordability =
      monthlyIncome > 0 &&
      emi / monthlyIncome > CO_APPLICANT_CONFIG.emiAffordabilityRatio;

    return isHomeLoanAboveThreshold || emiExceedsAffordability;
  }, [loanTypeData, employment]);

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<CoApplicantFormData>({
    // @ts-expect-error Zod boolean typing mismatch with RHF
    resolver: zodResolver(coApplicantSchema),
    defaultValues: {
      ...storeData,
      required: isRequired,
    } as CoApplicantFormData,
    mode: 'onChange',
  });

  useEffect(() => {
    // If not required, step is always valid
    const valid = isRequired ? isValid : true;
    onValidChange(valid);
    setStepValid(6, valid);
  }, [isValid, isRequired, onValidChange, setStepValid]);

  useEffect(() => {
    const subscription = watch((value) => {
      setCoApplicant({ ...value, required: isRequired } as CoApplicantFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, isRequired, setCoApplicant]);

  if (!isRequired) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center py-12 space-y-4">
          <div className="text-5xl">✅</div>
          <h2 className="text-2xl font-bold text-white">
            Co-Applicant Not Required
          </h2>
          <p className="text-white/40 max-w-md mx-auto">
            Based on your loan amount and income, a co-applicant is not required.
            You can proceed to the next step.
          </p>
          <div className="mt-6 p-4 bg-accent-500/10 rounded-xl inline-block">
            <p className="text-sm text-accent-400 font-medium">
              EMI is within the 40% affordability threshold
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">
          Co-Applicant Information
        </h2>
        <p className="text-white/40">
          A co-applicant is required based on your loan configuration. Their income will be
          considered for eligibility.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-warning-200 bg-warning-50/50">
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <h4 className="font-semibold text-white text-sm">
                Why is a co-applicant needed?
              </h4>
              <p className="text-xs text-white/60 mt-1">
                {loanTypeData.loanType === LoanType.HOME &&
                loanTypeData.loanAmount > CO_APPLICANT_CONFIG.homeLoanAmountThreshold
                  ? `Home loans above ${formatINR(CO_APPLICANT_CONFIG.homeLoanAmountThreshold, false)} require a co-applicant.`
                  : 'Your EMI exceeds 40% of your monthly income. A co-applicant helps strengthen your application.'}
              </p>
            </div>
          </div>
        </Card>

        <Input
          label="Co-Applicant Full Name (as per PAN)"
          required
          placeholder="Enter co-applicant's full name"
          error={errors.fullName?.message}
          isValid={!errors.fullName && watch('fullName')?.length! > 0}
          autoFocus
          {...register('fullName')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Co-Applicant PAN"
            required
            placeholder="ABCDE1234F"
            maxLength={10}
            error={errors.panNumber?.message}
            isValid={!errors.panNumber && watch('panNumber')?.length === 10}
            {...register('panNumber', {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
            className="uppercase tracking-wider font-mono"
          />
          <Select
            label="Relationship"
            required
            options={RELATIONSHIP_OPTIONS}
            error={errors.relationship?.message}
            isValid={!errors.relationship && watch('relationship')?.length! > 0}
            {...register('relationship')}
          />
        </div>

        <CurrencyInput
          label="Co-Applicant Monthly Income (Net)"
          required
          min={10000}
          placeholder="e.g. 50000"
          error={errors.monthlyIncome?.message}
          isValid={!errors.monthlyIncome && typeof watch('monthlyIncome') === 'number' && (watch('monthlyIncome') ?? 0) >= 10000}
          leftIcon={<span className="text-xs font-medium group-focus-within:text-primary-400 transition-colors">₹</span>}
          {...register('monthlyIncome', { valueAsNumber: true })}
        />

        <Card className="bg-white/5">
          <Checkbox
            label={
              <span>
                I confirm that the co-applicant has consented to be part of this loan application
                and has agreed to share their financial information for eligibility assessment.
              </span>
            }
            error={errors.coApplicantConsent?.message}
            {...register('coApplicantConsent')}
          />
        </Card>
      </div>
    </motion.div>
  );
}
