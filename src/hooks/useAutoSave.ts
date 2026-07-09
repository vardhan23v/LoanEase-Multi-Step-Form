// ============================================================
// useAutoSave Hook — AES-256-GCM Encrypted Auto-Save
// ============================================================

import { useEffect, useRef, useCallback } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useWizardStore } from '@/store/useWizardStore';
import { encryptData } from '@/utils/encryption';
import { AUTO_SAVE_CONFIG } from '@/constants';
import type { AutoSavePayload } from '@/types';
import toast from 'react-hot-toast';

export function useAutoSave() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSaveRef = useRef<string>('');

  const formStore = useFormStore();
  const currentStep = useWizardStore((s) => s.currentStep);

  const saveNow = useCallback(async () => {
    try {
      const stateSnapshot = {
        loanTypeData: formStore.loanTypeData,
        personalInfo: formStore.personalInfo,
        identity: formStore.identity,
        address: formStore.address,
        employment: formStore.employment,
        coApplicant: formStore.coApplicant,
        reviewConsents: formStore.reviewConsents,
      };

      const serialized = JSON.stringify(stateSnapshot);

      // Skip save if nothing changed
      if (serialized === lastSaveRef.current) return;

      const { encryptedData, iv } = await encryptData(serialized);

      const payload: AutoSavePayload = {
        version: AUTO_SAVE_CONFIG.version,
        timestamp: new Date().toISOString(),
        loanType: formStore.loanTypeData.loanType,
        currentStep,
        encryptedData,
        iv,
      };

      localStorage.setItem(AUTO_SAVE_CONFIG.storageKey, JSON.stringify(payload));
      lastSaveRef.current = serialized;
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [formStore, currentStep]);

  // Start auto-save interval
  useEffect(() => {
    intervalRef.current = setInterval(saveNow, AUTO_SAVE_CONFIG.intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [saveNow]);

  // Manual save with toast
  const manualSave = useCallback(async () => {
    await saveNow();
    toast.success('Draft saved successfully', {
      duration: 2000,
      icon: '💾',
    });
  }, [saveNow]);

  // Clear saved draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem(AUTO_SAVE_CONFIG.storageKey);
    lastSaveRef.current = '';
  }, []);

  return { saveNow, manualSave, clearDraft };
}
