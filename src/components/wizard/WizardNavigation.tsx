// ============================================================
// Wizard Navigation — Liquid Glass
// ============================================================

import { memo } from 'react';
import { Button } from '@/components/common';
import { useWizardStore } from '@/store';

interface WizardNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  onSaveDraft: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isValidating: boolean;
  isSubmitting?: boolean;
  canProceed: boolean;
}

export const WizardNavigation = memo(function WizardNavigation({
  onNext,
  onPrev,
  onSaveDraft,
  isFirstStep,
  isLastStep,
  isValidating,
  isSubmitting = false,
  canProceed,
}: WizardNavigationProps) {
  const currentStep = useWizardStore((s) => s.currentStep);

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-white/5"
      role="navigation"
      aria-label="Form navigation"
    >
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {!isFirstStep && (
          <Button
            variant="secondary"
            onClick={onPrev}
            type="button"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
          >
            Back
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={onSaveDraft}
          type="button"
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          }
        >
          <span className="hidden sm:inline">Save Draft</span>
          <span className="sm:hidden">Save</span>
        </Button>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <span className="text-xs text-white/30 hidden sm:inline" aria-live="polite">
          Step {currentStep} of 8
        </span>
        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          type="button"
          isLoading={isValidating || isSubmitting}
          disabled={!canProceed && isLastStep}
          rightIcon={
            !isLastStep ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            ) : undefined
          }
          fullWidth={isLastStep}
          className={isLastStep ? 'sm:w-auto' : ''}
        >
          {isLastStep
            ? isSubmitting
              ? 'Submitting...'
              : 'Submit Application'
            : 'Continue'}
        </Button>
      </div>
    </div>
  );
});
