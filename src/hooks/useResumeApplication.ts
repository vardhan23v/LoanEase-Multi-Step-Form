// ============================================================
// useResumeApplication Hook
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useWizardStore } from '@/store/useWizardStore';
import { decryptData } from '@/utils/encryption';
import { AUTO_SAVE_CONFIG } from '@/constants';
import type { AutoSavePayload } from '@/types';

interface ResumeState {
  hasDraft: boolean;
  draftTimestamp: string | null;
  draftLoanType: string | null;
  draftStep: number | null;
  isLoading: boolean;
}

export function useResumeApplication() {
  const [state, setState] = useState<ResumeState>({
    hasDraft: false,
    draftTimestamp: null,
    draftLoanType: null,
    draftStep: null,
    isLoading: true,
  });

  const resetForm = useFormStore((s) => s.resetForm);
  const setLoanTypeData = useFormStore((s) => s.setLoanTypeData);
  const setPersonalInfo = useFormStore((s) => s.setPersonalInfo);
  const setIdentity = useFormStore((s) => s.setIdentity);
  const setAddress = useFormStore((s) => s.setAddress);
  const setEmployment = useFormStore((s) => s.setEmployment);
  const setCoApplicant = useFormStore((s) => s.setCoApplicant);
  const setReviewConsents = useFormStore((s) => s.setReviewConsents);
  const setCurrentStep = useWizardStore((s) => s.setCurrentStep);
  const resetWizard = useWizardStore((s) => s.resetWizard);

  // Check for existing draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTO_SAVE_CONFIG.storageKey);
      if (!raw) {
        setState((prev) => ({ ...prev, hasDraft: false, isLoading: false }));
        return;
      }

      const payload: AutoSavePayload = JSON.parse(raw);

      // Check 72-hour expiry
      const savedTime = new Date(payload.timestamp).getTime();
      const now = Date.now();
      const hoursElapsed = (now - savedTime) / (1000 * 60 * 60);

      if (hoursElapsed > AUTO_SAVE_CONFIG.expiryHours) {
        localStorage.removeItem(AUTO_SAVE_CONFIG.storageKey);
        setState((prev) => ({ ...prev, hasDraft: false, isLoading: false }));
        return;
      }

      setState({
        hasDraft: true,
        draftTimestamp: payload.timestamp,
        draftLoanType: payload.loanType,
        draftStep: payload.currentStep,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem(AUTO_SAVE_CONFIG.storageKey);
      setState((prev) => ({ ...prev, hasDraft: false, isLoading: false }));
    }
  }, []);

  // Resume from saved draft
  const resumeDraft = useCallback(async () => {
    try {
      const raw = localStorage.getItem(AUTO_SAVE_CONFIG.storageKey);
      if (!raw) return;

      const payload: AutoSavePayload = JSON.parse(raw);
      const decrypted = await decryptData(payload.encryptedData, payload.iv);
      const data = JSON.parse(decrypted);

      if (data.loanTypeData) setLoanTypeData(data.loanTypeData);
      if (data.personalInfo) setPersonalInfo(data.personalInfo);
      if (data.identity) setIdentity(data.identity);
      if (data.address) setAddress(data.address);
      if (data.employment) setEmployment(data.employment);
      if (data.coApplicant) setCoApplicant(data.coApplicant);
      if (data.reviewConsents) setReviewConsents(data.reviewConsents);

      setCurrentStep(payload.currentStep);
      setState((prev) => ({ ...prev, hasDraft: false }));
    } catch (error) {
      console.error('Failed to resume draft:', error);
      startFresh();
    }
  }, [
    setLoanTypeData,
    setPersonalInfo,
    setIdentity,
    setAddress,
    setEmployment,
    setCoApplicant,
    setReviewConsents,
    setCurrentStep,
  ]);

  // Start fresh
  const startFresh = useCallback(() => {
    localStorage.removeItem(AUTO_SAVE_CONFIG.storageKey);
    resetForm();
    resetWizard();
    setState((prev) => ({ ...prev, hasDraft: false }));
  }, [resetForm, resetWizard]);

  return {
    ...state,
    resumeDraft,
    startFresh,
  };
}
