// ============================================================
// Step 3: Identity Verification (PAN & Aadhaar)
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { identitySchema, type IdentityFormData } from '@/schemas';
import { useFormStore, useWizardStore } from '@/store';
import { Input, Checkbox, Card, ProgressBar } from '@/components/common';
import { maskAadhaar } from '@/utils';

interface StepProps {
  onValidChange: (isValid: boolean) => void;
}

export default function IdentityStep({ onValidChange }: StepProps) {
  const storeData = useFormStore((s) => s.identity);
  const setIdentity = useFormStore((s) => s.setIdentity);
  const setStepValid = useWizardStore((s) => s.setStepValid);

  const [panVerifying, setPanVerifying] = useState(false);
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);

  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<IdentityFormData>({
    // @ts-expect-error Zod boolean typing mismatch with RHF
    resolver: zodResolver(identitySchema),
    defaultValues: {
      panNumber: storeData.panNumber,
      aadhaarNumber: storeData.aadhaarNumber,
      panVerified: storeData.panVerified,
      aadhaarVerified: storeData.aadhaarVerified,
      identityConsent: storeData.identityConsent,
    } as IdentityFormData,
    mode: 'onChange',
  });

  useEffect(() => {
    onValidChange(isValid);
    setStepValid(3, isValid);
  }, [isValid, onValidChange, setStepValid]);

  useEffect(() => {
    const subscription = watch((value) => {
      setIdentity(value as IdentityFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setIdentity]);

  const panValue = watch('panNumber');
  const aadhaarValue = watch('aadhaarNumber');
  const panVerified = watch('panVerified');
  const aadhaarVerified = watch('aadhaarVerified');

  // Simulated PAN verification
  const verifyPAN = useCallback(() => {
    if (panVerified || panVerifying) return;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    if (!panRegex.test(panValue?.toUpperCase() || '')) return;

    setPanVerifying(true);
    setVerifyProgress(0);
    const interval = setInterval(() => {
      setVerifyProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setPanVerifying(false);
          setValue('panVerified', true, { shouldValidate: true });
          return 100;
        }
        return p + 20;
      });
    }, 400);
  }, [panValue, panVerified, panVerifying, setValue]);

  // Simulated Aadhaar verification
  const verifyAadhaar = useCallback(() => {
    if (aadhaarVerified || aadhaarVerifying) return;
    const cleaned = (aadhaarValue || '').replace(/\s/g, '');
    if (cleaned.length !== 12) return;

    setAadhaarVerifying(true);
    setVerifyProgress(0);
    const interval = setInterval(() => {
      setVerifyProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setAadhaarVerifying(false);
          setValue('aadhaarVerified', true, { shouldValidate: true });
          return 100;
        }
        return p + 20;
      });
    }, 400);
  }, [aadhaarValue, aadhaarVerified, aadhaarVerifying, setValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">
          Identity Verification
        </h2>
        <p className="text-white/40">
          Enter your PAN and Aadhaar for identity verification. Your data is encrypted and secure.
        </p>
      </div>

      <div className="space-y-6">
        {/* PAN Card */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🪪</span>
              <h3 className="font-semibold text-white">PAN Card</h3>
              {panVerified && (
                <span className="ml-auto flex items-center gap-1 text-xs font-medium text-accent-400 bg-accent-500/10 px-2 py-1 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            <Input
              label="PAN Number"
              required
              placeholder="ABCDE1234F"
              maxLength={10}
              error={errors.panNumber?.message}
              isValid={panVerified}
              helperText="Format: 5 letters, 4 digits, 1 letter"
              {...register('panNumber', {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
              className="uppercase tracking-wider font-mono"
            />

            {!panVerified && (
              <button
                type="button"
                onClick={verifyPAN}
                disabled={panVerifying || !!errors.panNumber || !panValue}
                className="text-sm font-semibold bg-primary-500/10 text-primary-400 hover:bg-primary-100 hover:text-primary-400 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-lg mt-2 inline-flex items-center gap-2"
              >
                {panVerifying ? 'Verifying...' : 'Verify PAN'}
                {!panVerifying && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                )}
              </button>
            )}

            {panVerifying && (
              <ProgressBar
                value={verifyProgress}
                label="Verifying PAN securely..."
                showPercentage
                variant="primary"
                size="md"
              />
            )}
          </div>
        </Card>

        {/* Aadhaar */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🆔</span>
              <h3 className="font-semibold text-white">Aadhaar Card</h3>
              {aadhaarVerified && (
                <span className="ml-auto flex items-center gap-1 text-xs font-bold text-success-700 bg-success-500/10 border border-accent-500/20 px-3 py-1.5 rounded-full shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            <Input
              label="Aadhaar Number"
              required
              placeholder="XXXX XXXX XXXX"
              maxLength={14}
              error={errors.aadhaarNumber?.message}
              isValid={aadhaarVerified}
              helperText={
                aadhaarVerified && aadhaarValue
                  ? `Masked: ${maskAadhaar(aadhaarValue)}`
                  : '12-digit Aadhaar number with Verhoeff checksum'
              }
              {...register('aadhaarNumber')}
              isMasked={aadhaarVerified}
            />

            {!aadhaarVerified && (
              <button
                type="button"
                onClick={verifyAadhaar}
                disabled={aadhaarVerifying || !!errors.aadhaarNumber || !aadhaarValue}
                className="text-sm font-semibold bg-primary-500/10 text-primary-400 hover:bg-primary-100 hover:text-primary-400 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-lg mt-2 inline-flex items-center gap-2"
              >
                {aadhaarVerifying ? 'Verifying...' : 'Verify Aadhaar'}
                {!aadhaarVerifying && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                )}
              </button>
            )}

            {aadhaarVerifying && (
              <ProgressBar
                value={verifyProgress}
                label="Verifying Aadhaar"
                showPercentage
                variant="primary"
                size="sm"
              />
            )}
          </div>
        </Card>

        {/* Consent */}
        <Card className="bg-white/5">
          <Checkbox
            label={
              <span>
                I consent to the verification of my PAN and Aadhaar details for the purpose of this loan application.
                I confirm that the information provided is accurate and belongs to me.
              </span>
            }
            error={errors.identityConsent?.message}
            {...register('identityConsent')}
          />
        </Card>
      </div>
    </motion.div>
  );
}
