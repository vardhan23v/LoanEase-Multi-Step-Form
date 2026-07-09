// ============================================================
// Wizard Container — Orchestrates all steps
// ============================================================

import { Suspense, lazy, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizardStore, useFormStore } from '@/store';
import { useAutoSave } from '@/hooks/useAutoSave';
import { WizardStepper } from './WizardStepper';
import { WizardNavigation } from './WizardNavigation';
import { StepSkeleton, ProgressBar, ErrorBoundary } from '@/components/common';
import { LoanType } from '@/types';
import { CO_APPLICANT_CONFIG, INTEREST_RATES } from '@/constants';
import { calculateEMI } from '@/utils';
import { getMonthlyIncome } from '@/schemas';
import toast from 'react-hot-toast';

// Lazy load all step components
const LoanTypeStep = lazy(() => import('@/components/forms/LoanTypeStep'));
const PersonalInfoStep = lazy(() => import('@/components/forms/PersonalInfoStep'));
const IdentityStep = lazy(() => import('@/components/forms/IdentityStep'));
const AddressStep = lazy(() => import('@/components/forms/AddressStep'));
const EmploymentStep = lazy(() => import('@/components/forms/EmploymentStep'));
const CoApplicantStep = lazy(() => import('@/components/forms/CoApplicantStep'));
const DocumentUploadStep = lazy(() => import('@/components/forms/DocumentUploadStep'));
const ReviewStep = lazy(() => import('@/components/forms/ReviewStep'));

export function WizardContainer() {
  const currentStep = useWizardStore((s) => s.currentStep);
  const goToNextStep = useWizardStore((s) => s.goToNextStep);
  const goToPrevStep = useWizardStore((s) => s.goToPrevStep);
  const getCompletionPercentage = useWizardStore((s) => s.getCompletionPercentage);

  const loanTypeData = useFormStore((s) => s.loanTypeData);
  const employment = useFormStore((s) => s.employment);

  const { manualSave } = useAutoSave();
  const [isValidating, setIsValidating] = useState(false);
  const [stepValid, setStepValid] = useState(false);

  // Determine if co-applicant step should be shown
  const isCoApplicantRequired = useMemo(() => {
    const isHomeLoanAboveThreshold =
      loanTypeData.loanType === LoanType.HOME &&
      loanTypeData.loanAmount > CO_APPLICANT_CONFIG.homeLoanAmountThreshold;

    let monthlyIncome = 0;
    try {
      monthlyIncome = getMonthlyIncome(employment);
    } catch {
      monthlyIncome = 0;
    }

    if (monthlyIncome <= 0) return false;

    const emi = calculateEMI(
      loanTypeData.loanAmount,
      INTEREST_RATES[loanTypeData.loanType],
      loanTypeData.tenure
    );

    const emiExceedsAffordability =
      emi / monthlyIncome > CO_APPLICANT_CONFIG.emiAffordabilityRatio;

    return isHomeLoanAboveThreshold || emiExceedsAffordability;
  }, [loanTypeData, employment]);

  const skippedSteps = isCoApplicantRequired ? [] : [6];

  const handleValidChange = useCallback((isValid: boolean) => {
    setStepValid(isValid);
  }, []);

  const handleNext = useCallback(() => {
    // For step 6 (co-applicant), skip if not required
    if (currentStep === 5 && !isCoApplicantRequired) {
      // Skip to step 7
      const { setCurrentStep } = useWizardStore.getState();
      setCurrentStep(7);
      return;
    }

    if (!stepValid && currentStep !== 6) {
      toast.error('Please complete all required fields', { icon: '⚠️' });
      setIsValidating(true);
      setTimeout(() => setIsValidating(false), 500);
      return;
    }

    // For step 6 when not required, always allow
    if (currentStep === 6 && !isCoApplicantRequired) {
      goToNextStep();
      return;
    }

    goToNextStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, stepValid, isCoApplicantRequired, goToNextStep]);

  const handlePrev = useCallback(() => {
    // When going back from step 7, skip step 6 if not required
    if (currentStep === 7 && !isCoApplicantRequired) {
      const { setCurrentStep } = useWizardStore.getState();
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    goToPrevStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, isCoApplicantRequired, goToPrevStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <LoanTypeStep onValidChange={handleValidChange} />;
      case 2:
        return <PersonalInfoStep onValidChange={handleValidChange} />;
      case 3:
        return <IdentityStep onValidChange={handleValidChange} />;
      case 4:
        return <AddressStep onValidChange={handleValidChange} />;
      case 5:
        return <EmploymentStep onValidChange={handleValidChange} />;
      case 6:
        return <CoApplicantStep onValidChange={handleValidChange} />;
      case 7:
        return <DocumentUploadStep onValidChange={handleValidChange} />;
      case 8:
        return <ReviewStep onValidChange={handleValidChange} />;
      default:
        return <LoanTypeStep onValidChange={handleValidChange} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <ProgressBar
        value={getCompletionPercentage()}
        showPercentage
        label="Application Progress"
        variant="primary"
      />

      {/* Stepper */}
      <WizardStepper skippedSteps={skippedSteps} />

      {/* Step Content */}
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<StepSkeleton />}>
              {renderStep()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>

      {/* Navigation */}
      {currentStep <= 8 && (
        <WizardNavigation
          onNext={handleNext}
          onPrev={handlePrev}
          onSaveDraft={manualSave}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === 8}
          isValidating={isValidating}
          canProceed={stepValid || (currentStep === 6 && !isCoApplicantRequired)}
        />
      )}
    </div>
  );
}
