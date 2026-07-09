// ============================================================
// Form State Store (Zustand) — Sectioned by step
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  LoanType,
  Gender,
  MaritalStatus,
  ResidenceType,
  EmploymentType,
  type LoanTypeData,
  type PersonalInfoData,
  type IdentityData,
  type AddressData,
  type EmploymentData,
  type CoApplicantData,
  type DocumentsData,
  type ReviewConsents,
  type UploadedDocument,
} from '@/types';

// --- State Interface ---

interface FormState {
  // Step 1
  loanTypeData: LoanTypeData;
  setLoanTypeData: (data: Partial<LoanTypeData>) => void;

  // Step 2
  personalInfo: PersonalInfoData;
  setPersonalInfo: (data: Partial<PersonalInfoData>) => void;

  // Step 3
  identity: IdentityData;
  setIdentity: (data: Partial<IdentityData>) => void;

  // Step 4
  address: AddressData;
  setAddress: (data: Partial<AddressData>) => void;

  // Step 5
  employment: EmploymentData;
  setEmployment: (data: EmploymentData) => void;

  // Step 6
  coApplicant: CoApplicantData;
  setCoApplicant: (data: Partial<CoApplicantData>) => void;

  // Step 7
  documents: DocumentsData;
  setDocuments: (data: Partial<DocumentsData>) => void;
  addDocument: (doc: UploadedDocument) => void;
  removeDocument: (id: string) => void;
  updateDocumentProgress: (id: string, progress: number) => void;

  // Step 8
  reviewConsents: ReviewConsents;
  setReviewConsents: (data: Partial<ReviewConsents>) => void;

  // Application State
  isSubmitted: boolean;
  referenceNumber: string;
  setSubmitted: (ref: string) => void;

  // Reset
  resetForm: () => void;
}

// --- Defaults ---

const defaultLoanType: LoanTypeData = {
  loanType: LoanType.PERSONAL,
  loanAmount: 500000,
  tenure: 24,
  purpose: '',
  referralCode: '',
};

const defaultPersonalInfo: PersonalInfoData = {
  fullName: '',
  dateOfBirth: '',
  gender: Gender.MALE,
  maritalStatus: MaritalStatus.SINGLE,
  fatherName: '',
  motherName: '',
  email: '',
  mobile: '',
  alternateMobile: '',
};

const defaultIdentity: IdentityData = {
  panNumber: '',
  aadhaarNumber: '',
  panVerified: false,
  aadhaarVerified: false,
  identityConsent: false,
};

const defaultAddress: AddressData = {
  currentAddress: {
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    pinCode: '',
    city: '',
    state: '',
  },
  permanentSameAsCurrent: false,
  residenceType: ResidenceType.RENT,
  yearsAtCurrentAddress: 0,
};

const defaultEmployment: EmploymentData = {
  employmentType: EmploymentType.SALARIED,
  companyName: '',
  designation: '',
  yearsOfExperience: 0,
  monthlySalary: 0,
  employerType: '',
};

const defaultCoApplicant: CoApplicantData = {
  required: false,
  fullName: '',
  panNumber: '',
  monthlyIncome: undefined,
  coApplicantConsent: false,
};

const defaultDocuments: DocumentsData = {
  documents: [],
  signatureBase64: undefined,
};

const defaultReviewConsents: ReviewConsents = {
  termsAndConditions: false,
  creditBureauCheck: false,
  eSignAuthorization: false,
  dataSharingAgreement: false,
};

// --- Store ---

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      // Step 1
      loanTypeData: defaultLoanType,
      setLoanTypeData: (data) =>
        set((state) => ({
          loanTypeData: { ...state.loanTypeData, ...data },
        })),

      // Step 2
      personalInfo: defaultPersonalInfo,
      setPersonalInfo: (data) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...data },
        })),

      // Step 3
      identity: defaultIdentity,
      setIdentity: (data) =>
        set((state) => ({
          identity: { ...state.identity, ...data },
        })),

      // Step 4
      address: defaultAddress,
      setAddress: (data) =>
        set((state) => ({
          address: { ...state.address, ...data },
        })),

      // Step 5
      employment: defaultEmployment,
      setEmployment: (data) => set({ employment: data }),

      // Step 6
      coApplicant: defaultCoApplicant,
      setCoApplicant: (data) =>
        set((state) => ({
          coApplicant: { ...state.coApplicant, ...data },
        })),

      // Step 7
      documents: defaultDocuments,
      setDocuments: (data) =>
        set((state) => ({
          documents: { ...state.documents, ...data },
        })),
      addDocument: (doc) =>
        set((state) => ({
          documents: {
            ...state.documents,
            documents: [...state.documents.documents, doc],
          },
        })),
      removeDocument: (id) =>
        set((state) => ({
          documents: {
            ...state.documents,
            documents: state.documents.documents.filter((d) => d.id !== id),
          },
        })),
      updateDocumentProgress: (id, progress) =>
        set((state) => ({
          documents: {
            ...state.documents,
            documents: state.documents.documents.map((d) =>
              d.id === id ? { ...d, uploadProgress: progress } : d
            ),
          },
        })),

      // Step 8
      reviewConsents: defaultReviewConsents,
      setReviewConsents: (data) =>
        set((state) => ({
          reviewConsents: { ...state.reviewConsents, ...data },
        })),

      // Application
      isSubmitted: false,
      referenceNumber: '',
      setSubmitted: (ref) =>
        set({ isSubmitted: true, referenceNumber: ref }),

      // Reset
      resetForm: () =>
        set({
          loanTypeData: defaultLoanType,
          personalInfo: defaultPersonalInfo,
          identity: defaultIdentity,
          address: defaultAddress,
          employment: defaultEmployment,
          coApplicant: defaultCoApplicant,
          documents: defaultDocuments,
          reviewConsents: defaultReviewConsents,
          isSubmitted: false,
          referenceNumber: '',
        }),
    }),
    {
      name: 'loan-app-form-store',
      partialize: (state) => ({
        loanTypeData: state.loanTypeData,
        personalInfo: state.personalInfo,
        identity: state.identity,
        address: state.address,
        employment: state.employment,
        coApplicant: state.coApplicant,
        reviewConsents: state.reviewConsents,
        isSubmitted: state.isSubmitted,
        referenceNumber: state.referenceNumber,
        // NOTE: documents and signatures are NOT persisted here (too large)
        // They are persisted via auto-save with encryption
      }),
    }
  )
);
