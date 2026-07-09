// ============================================================
// Step 8: Review & Submit
// ============================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { reviewSchema, type ReviewFormData, getMonthlyIncome } from '@/schemas';
import { useFormStore, useWizardStore } from '@/store';
import { useEMICalculator } from '@/hooks';
import { Checkbox, Card, Button } from '@/components/common';
import { formatINR, formatDate, formatPhone, maskPAN, maskAadhaar, generateReferenceNumber } from '@/utils';
import { EmploymentType, LoanType, type EmploymentData } from '@/types';
import { INTEREST_RATES } from '@/constants';

interface StepProps {
  onValidChange: (isValid: boolean) => void;
}

function SectionHeader({
  title,
  icon,
  step,
  onEdit,
}: {
  title: string;
  icon: string;
  step: number;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10/60">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center text-xl shadow-sm">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      </div>
      <button
        type="button"
        onClick={() => onEdit(step)}
        className="text-sm font-semibold text-primary-400 hover:text-primary-400 bg-primary-500/10 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        aria-label={`Edit ${title}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </button>
    </div>
  );
}

function DataRow({ label, value, fullWidth = false }: { label: string; value: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className={`py-1 min-w-0 ${fullWidth ? 'col-span-full' : ''}`}>
      <span className="block text-xs font-bold text-white/30 uppercase tracking-wider mb-1.5 truncate">{label}</span>
      <span className="block text-base font-medium text-white break-words break-all">
        {value || '—'}
      </span>
    </div>
  );
}

function getEmploymentLabel(data: EmploymentData): string {
  switch (data.employmentType) {
    case EmploymentType.SALARIED:
      return 'Salaried';
    case EmploymentType.SELF_EMPLOYED:
      return 'Self Employed';
    case EmploymentType.BUSINESS_OWNER:
      return 'Business Owner';
    default:
      return '';
  }
}

export default function ReviewStep({ onValidChange }: StepProps) {
  const loanTypeData = useFormStore((s) => s.loanTypeData);
  const personalInfo = useFormStore((s) => s.personalInfo);
  const identity = useFormStore((s) => s.identity);
  const address = useFormStore((s) => s.address);
  const employment = useFormStore((s) => s.employment);
  const coApplicant = useFormStore((s) => s.coApplicant);
  const documents = useFormStore((s) => s.documents);
  const setReviewConsents = useFormStore((s) => s.setReviewConsents);
  const setSubmitted = useFormStore((s) => s.setSubmitted);
  const setStepValid = useWizardStore((s) => s.setStepValid);
  const setCurrentStep = useWizardStore((s) => s.setCurrentStep);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  let monthlyIncome = 0;
  try {
    monthlyIncome = getMonthlyIncome(employment);
  } catch {
    monthlyIncome = 0;
  }

  const { breakdown } = useEMICalculator(
    loanTypeData.loanAmount,
    loanTypeData.loanType,
    loanTypeData.tenure,
    monthlyIncome
  );

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      termsAndConditions: false,
      creditBureauCheck: false,
      eSignAuthorization: false,
      dataSharingAgreement: false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    onValidChange(isValid);
    setStepValid(8, isValid);
  }, [isValid, onValidChange, setStepValid]);

  useEffect(() => {
    const subscription = watch((value) => {
      setReviewConsents(value as ReviewFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setReviewConsents]);

  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4f46e5', '#10b981', '#f59e0b']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4f46e5', '#10b981', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSubmit = () => {
    if (!isValid) return;
    const ref = generateReferenceNumber();
    setReferenceNumber(ref);
    setSubmitted(ref);
    setIsSubmitted(true);
    fireConfetti();
  };

  const navigate = useNavigate();

  // Success Screen (Receipt)
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="max-w-md mx-auto relative pt-4 pb-12"
      >
        <div className="bg-white/6 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          <div className="bg-success-500/100 p-8 text-center text-white relative">
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Loan Approved!</h2>
            <p className="text-success-100 font-medium mt-1">Application successfully processed</p>
            
            {/* Ticket zig-zag bottom */}
            <div className="absolute -bottom-2 left-0 right-0 h-4 bg-white" style={{ clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%, 100% 100%, 0% 100%)' }} />
          </div>
          
          <div className="p-8 space-y-6 bg-white relative z-10">
            <div className="flex justify-between items-end border-b border-white/10 border-dashed pb-4">
              <div>
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Approved Amount</p>
                <p className="text-3xl font-black text-white">{formatINR(loanTypeData.loanAmount, false)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Ref No.</p>
                <p className="text-sm font-bold text-white">{referenceNumber}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-white/40">Applicant</span>
                <span className="text-sm font-bold text-white">{personalInfo.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-white/40">Loan Type</span>
                <span className="text-sm font-bold text-white">{loanTypeData.loanType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-white/40">Tenure</span>
                <span className="text-sm font-bold text-white">{loanTypeData.tenure} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-white/40">Monthly EMI</span>
                <span className="text-sm font-bold text-primary-400">{formatINR(breakdown.monthlyEMI)}</span>
              </div>
            </div>
            
            <div className="pt-6">
              <Button onClick={() => navigate('/dashboard')} fullWidth className="py-4 text-base shadow-xl shadow-primary-500/20">
                Go to Dashboard
              </Button>
            </div>
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
          Review Your Application
        </h2>
        <p className="text-white/40">
          Please review all the information below. Click "Edit" to make changes.
        </p>
      </div>

      <div className="space-y-6">
        {/* Loan Details */}
        <Card className="shadow-sm border-white/10 hover:shadow-md transition-shadow">
          <SectionHeader title="Loan Details" icon="💰" step={1} onEdit={handleEdit} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
            <DataRow
              label="Loan Type"
              value={
                loanTypeData.loanType === LoanType.PERSONAL
                  ? 'Personal Loan'
                  : loanTypeData.loanType === LoanType.HOME
                  ? 'Home Loan'
                  : 'Business Loan'
              }
            />
            <DataRow label="Loan Amount" value={formatINR(loanTypeData.loanAmount, false)} />
            <DataRow
              label="Tenure"
              value={`${loanTypeData.tenure} months (${(loanTypeData.tenure / 12).toFixed(1)} yrs)`}
            />
            <DataRow label="Purpose" value={loanTypeData.purpose} fullWidth />
            {loanTypeData.referralCode && (
              <DataRow label="Referral Code" value={loanTypeData.referralCode} />
            )}
          </div>
        </Card>

        {/* Personal Info */}
        <Card className="shadow-sm border-white/10 hover:shadow-md transition-shadow">
          <SectionHeader title="Personal Information" icon="👤" step={2} onEdit={handleEdit} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
            <DataRow label="Full Name" value={personalInfo.fullName} fullWidth />
            <DataRow label="Date of Birth" value={formatDate(personalInfo.dateOfBirth)} />
            <DataRow label="Gender" value={personalInfo.gender} />
            <DataRow label="Marital Status" value={personalInfo.maritalStatus} />
            <DataRow label="Email" value={personalInfo.email} fullWidth />
            <DataRow label="Mobile" value={formatPhone(personalInfo.mobile)} />
          </div>
        </Card>

        {/* Identity */}
        <Card className="shadow-sm border-white/10 hover:shadow-md transition-shadow">
          <SectionHeader title="Identity" icon="🪪" step={3} onEdit={handleEdit} />
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-6">
            <DataRow 
              label="PAN Number" 
              value={
                <div className="flex items-center gap-2">
                  <span>{maskPAN(identity.panNumber)}</span>
                  {identity.panVerified && <span className="text-[10px] bg-success-100 text-success-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Verified</span>}
                </div>
              } 
            />
            <DataRow 
              label="Aadhaar Number" 
              value={
                <div className="flex items-center gap-2">
                  <span>{maskAadhaar(identity.aadhaarNumber)}</span>
                  {identity.aadhaarVerified && <span className="text-[10px] bg-success-100 text-success-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Verified</span>}
                </div>
              } 
            />
          </div>
        </Card>

        {/* Address */}
        <Card className="shadow-sm border-white/10 hover:shadow-md transition-shadow">
          <SectionHeader title="Address" icon="🏠" step={4} onEdit={handleEdit} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            <DataRow
              label="Current Address"
              fullWidth
              value={`${address.currentAddress.addressLine1}, ${address.currentAddress.city}, ${address.currentAddress.state} - ${address.currentAddress.pinCode}`}
            />
            <DataRow label="Residence Type" value={address.residenceType} />
            <DataRow
              label="Years at Current"
              value={`${address.yearsAtCurrentAddress} years`}
            />
          </div>
        </Card>

        {/* Employment */}
        <Card className="shadow-sm border-white/10 hover:shadow-md transition-shadow">
          <SectionHeader title="Employment" icon="💼" step={5} onEdit={handleEdit} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
            <DataRow label="Employment Type" value={getEmploymentLabel(employment)} />
            <DataRow label="Monthly Income" value={formatINR(monthlyIncome, false)} />
            {employment.employmentType === EmploymentType.SALARIED && (
              <DataRow label="Company" value={employment.companyName} fullWidth />
            )}
            {employment.employmentType === EmploymentType.BUSINESS_OWNER && (
              <DataRow label="Business" value={employment.businessName} fullWidth />
            )}
          </div>
        </Card>

        {/* Co-Applicant (if applicable) */}
        {coApplicant.required && coApplicant.fullName && (
          <Card className="shadow-sm border-white/10 hover:shadow-md transition-shadow bg-white/5">
            <SectionHeader title="Co-Applicant" icon="👥" step={6} onEdit={handleEdit} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
              <DataRow label="Name" value={coApplicant.fullName} fullWidth />
              <DataRow label="PAN" value={coApplicant.panNumber ? maskPAN(coApplicant.panNumber) : '—'} />
              <DataRow label="Relationship" value={coApplicant.relationship} />
              <DataRow
                label="Monthly Income"
                value={coApplicant.monthlyIncome ? formatINR(coApplicant.monthlyIncome, false) : '—'}
              />
            </div>
          </Card>
        )}

        {/* Documents */}
        <Card className="shadow-sm border-white/10 hover:shadow-md transition-shadow">
          <SectionHeader title="Documents" icon="📄" step={7} onEdit={handleEdit} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            <DataRow 
              label="Documents Uploaded" 
              value={
                <div className="flex items-center gap-2">
                  <span className="bg-primary-100 text-primary-400 px-2 py-0.5 rounded text-sm font-bold">{documents.documents.length}</span>
                  <span className="text-white/60">files</span>
                </div>
              } 
            />
            <div className="py-1">
              <span className="block text-xs font-bold text-white/30 uppercase tracking-wider mb-1.5">Signature</span>
              {documents.signatureBase64 ? (
                <img
                  src={documents.signatureBase64}
                  alt="Your signature"
                  className="h-12 mt-1 border border-white/10 rounded-lg bg-white p-1"
                />
              ) : (
                <p className="text-sm font-medium text-danger-400 mt-1">No signature provided</p>
              )}
            </div>
          </div>
        </Card>

        {/* EMI Breakdown */}
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-500/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📊</span>
            <h3 className="font-semibold text-white">EMI Breakdown</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/80 rounded-xl">
              <p className="text-xs text-white/40 mb-1">Monthly EMI</p>
              <p className="text-lg font-bold text-primary-400">
                {formatINR(breakdown.monthlyEMI)}
              </p>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-xl">
              <p className="text-xs text-white/40 mb-1">Total Interest</p>
              <p className="text-lg font-bold text-white/70">
                {formatINR(breakdown.totalInterest)}
              </p>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-xl">
              <p className="text-xs text-white/40 mb-1">Processing Fee</p>
              <p className="text-lg font-bold text-white/70">
                {formatINR(breakdown.processingFee)}
              </p>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-xl">
              <p className="text-xs text-white/40 mb-1">Total Cost</p>
              <p className="text-lg font-bold text-primary-400">
                {formatINR(breakdown.totalCost)}
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-center text-white/40">
            Interest Rate: {INTEREST_RATES[loanTypeData.loanType]}% p.a.
          </div>
        </Card>

        {/* Consent Checkboxes */}
        <Card title="Consents & Agreements">
          <div className="space-y-4">
            <Checkbox
              label="I agree to the Terms & Conditions and acknowledge that I have read and understood all the terms of the loan agreement."
              error={errors.termsAndConditions?.message}
              {...register('termsAndConditions')}
            />
            <Checkbox
              label="I authorize the lender to check my credit history and score with credit bureaus (CIBIL, Experian, Equifax, CRIF High Mark)."
              error={errors.creditBureauCheck?.message}
              {...register('creditBureauCheck')}
            />
            <Checkbox
              label="I authorize the use of my digital signature for all documents related to this loan application."
              error={errors.eSignAuthorization?.message}
              {...register('eSignAuthorization')}
            />
            <Checkbox
              label="I consent to the sharing of my data with third-party service providers for the purpose of processing this loan application."
              error={errors.dataSharingAgreement?.message}
              {...register('dataSharingAgreement')}
            />
          </div>
        </Card>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: isValid ? 1.01 : 1 }}
          whileTap={{ scale: isValid ? 0.99 : 1 }}
        >
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={`
              w-full py-4 rounded-2xl text-lg font-bold transition-all duration-300 cursor-pointer
              ${
                isValid
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }
            `}
            aria-label="Submit loan application"
          >
            Submit Application
          </button>
        </motion.div>

        {!isValid && (
          <p
            className="text-sm text-center text-white/40"
            aria-live="polite"
          >
            Please accept all consent checkboxes to submit your application
          </p>
        )}
      </div>
    </motion.div>
  );
}
