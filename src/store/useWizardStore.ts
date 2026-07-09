// ============================================================
// Wizard State Store (Zustand)
// ============================================================

import { create } from 'zustand';
import type { StepValidityMap } from '@/types';

interface WizardState {
  currentStep: number;
  totalSteps: number;
  visitedSteps: Set<number>;
  stepValidity: StepValidityMap;
  isNavigating: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  markStepVisited: (step: number) => void;
  setStepValid: (step: number, isValid: boolean) => void;
  setIsNavigating: (val: boolean) => void;
  canProceed: (step: number) => boolean;
  getCompletionPercentage: () => number;
  resetWizard: () => void;
}

export const useWizardStore = create<WizardState>()((set, get) => ({
  currentStep: 1,
  totalSteps: 8,
  visitedSteps: new Set([1]),
  stepValidity: {},
  isNavigating: false,

  setCurrentStep: (step) =>
    set((state) => ({
      currentStep: step,
      visitedSteps: new Set([...state.visitedSteps, step]),
    })),

  goToNextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps) {
      set((state) => ({
        currentStep: currentStep + 1,
        visitedSteps: new Set([...state.visitedSteps, currentStep + 1]),
      }));
    }
  },

  goToPrevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  markStepVisited: (step) =>
    set((state) => ({
      visitedSteps: new Set([...state.visitedSteps, step]),
    })),

  setStepValid: (step, isValid) =>
    set((state) => ({
      stepValidity: { ...state.stepValidity, [step]: isValid },
    })),

  setIsNavigating: (val) => set({ isNavigating: val }),

  canProceed: (step) => {
    const { stepValidity } = get();
    return stepValidity[step] === true;
  },

  getCompletionPercentage: () => {
    const { stepValidity, totalSteps } = get();
    const validSteps = Object.values(stepValidity).filter(Boolean).length;
    return Math.round((validSteps / totalSteps) * 100);
  },

  resetWizard: () =>
    set({
      currentStep: 1,
      visitedSteps: new Set([1]),
      stepValidity: {},
      isNavigating: false,
    }),
}));
