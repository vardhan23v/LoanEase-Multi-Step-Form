// ============================================================
// Wizard Stepper — Liquid Glass
// ============================================================

import { memo } from 'react';
import { motion } from 'framer-motion';
import { WIZARD_STEPS } from '@/constants';
import { useWizardStore } from '@/store';

interface WizardStepperProps {
  /** Steps to skip (e.g., co-applicant when not required) */
  skippedSteps?: number[];
}

export const WizardStepper = memo(function WizardStepper({
  skippedSteps = [],
}: WizardStepperProps) {
  const currentStep = useWizardStore((s) => s.currentStep);
  const stepValidity = useWizardStore((s) => s.stepValidity);
  const setCurrentStep = useWizardStore((s) => s.setCurrentStep);

  const visibleSteps = WIZARD_STEPS.filter(
    (step) => !skippedSteps.includes(step.id)
  );

  const handleStepClick = (stepId: number) => {
    // Only allow clicking on completed steps or the next available step
    if (stepValidity[stepId] || stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  return (
    <nav aria-label="Application progress" className="mb-10 p-5 md:p-6 liquid-glass-strong rounded-3xl specular-border">
      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <ol className="flex items-center gap-0 w-full" role="list">
          {visibleSteps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = stepValidity[step.id] === true;
            const isClickable = isCompleted || step.id <= currentStep;

            return (
              <li
                key={step.id}
                className="flex items-center flex-1 min-w-0"
                role="listitem"
              >
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isClickable}
                  className={`
                    flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-300 min-w-0
                    ${isClickable ? 'cursor-pointer hover:bg-white/5' : 'cursor-not-allowed opacity-40'}
                    ${isActive ? 'bg-white/5' : ''}
                  `}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Step ${step.id}: ${step.title}${
                    isCompleted ? ' (completed)' : ''
                  }${isActive ? ' (current)' : ''}`}
                >
                  <motion.div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                      transition-all duration-300 border-2
                      ${
                        isCompleted
                          ? 'bg-accent-500/20 text-accent-400 border-accent-400/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : isActive
                          ? 'bg-primary-500/20 text-primary-300 border-primary-400/60 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                          : 'bg-white/5 text-white/30 border-white/10'
                      }
                    `}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </motion.div>
                  <div className="hidden xl:block text-left min-w-0">
                    <p
                      className={`text-xs font-bold tracking-wide uppercase truncate transition-colors duration-300 ${
                        isActive
                          ? 'text-primary-300'
                          : isCompleted
                          ? 'text-accent-400'
                          : 'text-white/30'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </button>

                {/* Connector line */}
                {index < visibleSteps.length - 1 && (
                  <div className="flex-1 h-[3px] mx-2 min-w-[20px] rounded-full bg-white/5 overflow-hidden relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-accent-400/60 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.3)]"
                      initial={{ width: isCompleted ? '100%' : '0%' }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-primary-400 uppercase tracking-wide">
            Step {currentStep} of {visibleSteps.length}
          </span>
          <span className="text-sm font-semibold text-white/70 truncate ml-4">
            {visibleSteps.find((s) => s.id === currentStep)?.title}
          </span>
        </div>
        <div className="flex gap-2">
          {visibleSteps.map((step) => (
            <motion.div
              key={step.id}
              className={`h-2 rounded-full flex-1 transition-colors duration-300 ${
                stepValidity[step.id]
                  ? 'bg-accent-400/60 shadow-[0_0_4px_rgba(16,185,129,0.3)]'
                  : step.id === currentStep
                  ? 'bg-primary-400/60 shadow-[0_0_4px_rgba(37,99,235,0.3)]'
                  : 'bg-white/5'
              }`}
              initial={false}
              animate={
                step.id === currentStep
                  ? { scaleY: [1, 1.2, 1] }
                  : {}
              }
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </nav>
  );
});
