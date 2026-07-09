// ============================================================
// Step 4: Address Information
// ============================================================

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { addressSchema, type AddressFormData } from '@/schemas';
import { useFormStore, useWizardStore } from '@/store';
import { usePinLookup } from '@/hooks';
import { Input, Checkbox, Card, RadioGroup } from '@/components/common';
import { ResidenceType } from '@/types';

const RESIDENCE_OPTIONS = [
  { value: ResidenceType.OWN, label: 'Own' },
  { value: ResidenceType.RENT, label: 'Rented' },
  { value: ResidenceType.COMPANY, label: 'Company Provided' },
  { value: ResidenceType.PARENTS, label: "Parents'" },
];

interface StepProps {
  onValidChange: (isValid: boolean) => void;
}

export default function AddressStep({ onValidChange }: StepProps) {
  const storeData = useFormStore((s) => s.address);
  const setAddress = useFormStore((s) => s.setAddress);
  const setStepValid = useWizardStore((s) => s.setStepValid);

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<AddressFormData>({
    // @ts-expect-error Zod boolean default typing mismatch with RHF
    resolver: zodResolver(addressSchema),
    defaultValues: storeData as AddressFormData,
    mode: 'onChange',
  });

  const currentPinCode = watch('currentAddress.pinCode');
  const permanentSame = watch('permanentSameAsCurrent');
  const yearsAtCurrent = watch('yearsAtCurrentAddress');

  const { result: pinResult, isLoading: pinLoading } = usePinLookup(currentPinCode || '');

  // Auto-fill city/state from PIN
  useEffect(() => {
    if (pinResult?.found) {
      setValue('currentAddress.city', pinResult.city, { shouldValidate: true });
      setValue('currentAddress.state', pinResult.state, { shouldValidate: true });
    }
  }, [pinResult, setValue]);

  useEffect(() => {
    onValidChange(isValid);
    setStepValid(4, isValid);
  }, [isValid, onValidChange, setStepValid]);

  useEffect(() => {
    const subscription = watch((value) => {
      setAddress(value as any);
    });
    return () => subscription.unsubscribe();
  }, [watch, setAddress]);

  const showPreviousAddress = typeof yearsAtCurrent === 'number' && yearsAtCurrent < 2;

  // Clear hidden fields to prevent validation errors on unmounted object fields
  useEffect(() => {
    if (permanentSame) {
      setValue('permanentAddress', undefined, { shouldValidate: true });
    }
  }, [permanentSame, setValue]);

  useEffect(() => {
    if (!showPreviousAddress) {
      setValue('previousAddress', undefined, { shouldValidate: true });
    }
  }, [showPreviousAddress, setValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">
          Address Details
        </h2>
        <p className="text-white/40">
          Provide your current and permanent address information
        </p>
      </div>

      <div className="space-y-8">
        {/* Current Address */}
        <Card title="Current Address" description="Where you currently reside">
          <div className="space-y-4">
            <Input
              label="Address Line 1"
              required
              placeholder="House/Flat No., Building Name"
              error={errors.currentAddress?.addressLine1?.message}
              isValid={!errors.currentAddress?.addressLine1 && watch('currentAddress.addressLine1')?.length! > 0}
              autoFocus
              {...register('currentAddress.addressLine1')}
            />
            <Input
              label="Address Line 2 (Optional)"
              placeholder="Street, Area, Colony"
              error={errors.currentAddress?.addressLine2?.message}
              isValid={!errors.currentAddress?.addressLine2 && (watch('currentAddress.addressLine2')?.length ?? 0) > 0}
              {...register('currentAddress.addressLine2')}
            />
            <Input
              label="Landmark (Optional)"
              placeholder="Near..."
              error={errors.currentAddress?.landmark?.message}
              isValid={!errors.currentAddress?.landmark && (watch('currentAddress.landmark')?.length ?? 0) > 0}
              {...register('currentAddress.landmark')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Input
                label="PIN Code"
                required
                placeholder="110001"
                maxLength={6}
                error={errors.currentAddress?.pinCode?.message}
                isValid={!errors.currentAddress?.pinCode && watch('currentAddress.pinCode')?.length === 6}
                helperText={
                  pinLoading
                    ? 'Looking up...'
                    : pinResult?.found
                    ? `${pinResult.district}`
                    : pinResult && !pinResult.found
                    ? 'PIN code not found'
                    : undefined
                }
                rightIcon={
                  pinLoading ? (
                    <svg className="w-5 h-5 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : pinResult?.found ? (
                    <svg className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : undefined
                }
                {...register('currentAddress.pinCode')}
              />
              <Input
                label="City"
                required
                placeholder="City"
                error={errors.currentAddress?.city?.message}
                isValid={!errors.currentAddress?.city && watch('currentAddress.city')?.length! > 0}
                {...register('currentAddress.city')}
              />
              <Input
                label="State"
                required
                placeholder="State"
                error={errors.currentAddress?.state?.message}
                isValid={!errors.currentAddress?.state && watch('currentAddress.state')?.length! > 0}
                {...register('currentAddress.state')}
              />
            </div>
          </div>
        </Card>

        {/* Residence Type & Years */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Controller
            name="residenceType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name={field.name}
                label="Residence Type"
                required
                options={RESIDENCE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.residenceType?.message}
                direction="vertical"
              />
            )}
          />
          <Input
            label="Years at Current Address"
            required
            type="number"
            min={0}
            max={100}
            placeholder="e.g. 3"
            error={errors.yearsAtCurrentAddress?.message}
            helperText={showPreviousAddress ? 'Previous address required for less than 2 years' : undefined}
            {...register('yearsAtCurrentAddress', { valueAsNumber: true })}
          />
        </div>

        {/* Permanent Address */}
        <div className="space-y-4">
          <Checkbox
            label="Permanent address is the same as current address"
            {...register('permanentSameAsCurrent')}
          />

          <AnimatePresence>
            {!permanentSame && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card title="Permanent Address">
                  <div className="space-y-4">
                    <Input
                      label="Address Line 1"
                      required
                      placeholder="House/Flat No., Building Name"
                      error={errors.permanentAddress?.addressLine1?.message}
                      {...register('permanentAddress.addressLine1')}
                    />
                    <Input
                      label="Address Line 2"
                      placeholder="Street, Area, Colony"
                      {...register('permanentAddress.addressLine2')}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="PIN Code"
                        required
                        placeholder="110001"
                        maxLength={6}
                        error={errors.permanentAddress?.pinCode?.message}
                        {...register('permanentAddress.pinCode')}
                      />
                      <Input
                        label="City"
                        required
                        placeholder="City"
                        error={errors.permanentAddress?.city?.message}
                        {...register('permanentAddress.city')}
                      />
                      <Input
                        label="State"
                        required
                        placeholder="State"
                        error={errors.permanentAddress?.state?.message}
                        {...register('permanentAddress.state')}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Previous Address (conditional) */}
        <AnimatePresence>
          {showPreviousAddress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                title="Previous Address"
                description="Required when less than 2 years at current address"
              >
                <div className="space-y-4">
                  <Input
                    label="Address Line 1"
                    required
                    placeholder="Previous address"
                    error={errors.previousAddress?.addressLine1?.message}
                    {...register('previousAddress.addressLine1')}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="PIN Code"
                      required
                      placeholder="110001"
                      maxLength={6}
                      error={errors.previousAddress?.pinCode?.message}
                      {...register('previousAddress.pinCode')}
                    />
                    <Input
                      label="City"
                      required
                      placeholder="City"
                      error={errors.previousAddress?.city?.message}
                      {...register('previousAddress.city')}
                    />
                    <Input
                      label="State"
                      required
                      placeholder="State"
                      error={errors.previousAddress?.state?.message}
                      {...register('previousAddress.state')}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
