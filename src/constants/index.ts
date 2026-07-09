// ============================================================
// Loan Application Platform — Constants
// ============================================================

import {
  LoanType,
  EmploymentType,
  DocumentType,
  type WizardStep,
} from '@/types';

// --- Interest Rates (Annual %) ---

export const INTEREST_RATES: Record<LoanType, number> = {
  [LoanType.PERSONAL]: 10.5,
  [LoanType.HOME]: 8.5,
  [LoanType.BUSINESS]: 14.0,
};

// --- Processing Fee Rates (%) ---

export const PROCESSING_FEE_RATES: Record<LoanType, number> = {
  [LoanType.PERSONAL]: 2.0,
  [LoanType.HOME]: 0.5,
  [LoanType.BUSINESS]: 1.5,
};

// --- Loan Limits ---

export const LOAN_LIMITS: Record<
  LoanType,
  { minAmount: number; maxAmount: number; minTenure: number; maxTenure: number }
> = {
  [LoanType.PERSONAL]: {
    minAmount: 50000,
    maxAmount: 4000000,
    minTenure: 6,
    maxTenure: 60,
  },
  [LoanType.HOME]: {
    minAmount: 500000,
    maxAmount: 100000000,
    minTenure: 12,
    maxTenure: 360,
  },
  [LoanType.BUSINESS]: {
    minAmount: 100000,
    maxAmount: 20000000,
    minTenure: 6,
    maxTenure: 84,
  },
};

// --- Loan Purposes ---

export const LOAN_PURPOSES: Record<LoanType, string[]> = {
  [LoanType.PERSONAL]: [
    'Debt Consolidation',
    'Medical Emergency',
    'Wedding',
    'Education',
    'Travel',
    'Home Renovation',
    'Other',
  ],
  [LoanType.HOME]: [
    'Purchase New Property',
    'Purchase Resale Property',
    'Construction',
    'Renovation',
    'Plot Purchase',
    'Balance Transfer',
    'Top-up',
  ],
  [LoanType.BUSINESS]: [
    'Working Capital',
    'Equipment Purchase',
    'Business Expansion',
    'Inventory',
    'Office Setup',
    'Franchise',
    'Other',
  ],
};

// --- Employer Types ---

export const EMPLOYER_TYPES = [
  'Government',
  'PSU',
  'MNC',
  'Private Limited',
  'LLP',
  'Startup',
  'Other',
] as const;

// --- Professions (Self-employed) ---

export const PROFESSIONS = [
  'Doctor',
  'Lawyer',
  'Chartered Accountant',
  'Architect',
  'Consultant',
  'Freelancer',
  'Other',
] as const;

// --- Business Types ---

export const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'Private Limited',
  'LLP',
  'Public Limited',
  'Other',
] as const;

// --- Document Requirements ---

export const COMMON_DOCUMENTS: DocumentType[] = [
  DocumentType.PAN_CARD,
  DocumentType.AADHAAR_CARD,
  DocumentType.PHOTO,
  DocumentType.BANK_STATEMENT,
];

export const DOCUMENT_REQUIREMENTS: Record<LoanType, Record<EmploymentType, DocumentType[]>> = {
  [LoanType.PERSONAL]: {
    [EmploymentType.SALARIED]: [
      ...COMMON_DOCUMENTS,
      DocumentType.SALARY_SLIP,
    ],
    [EmploymentType.SELF_EMPLOYED]: [
      ...COMMON_DOCUMENTS,
      DocumentType.ITR,
    ],
    [EmploymentType.BUSINESS_OWNER]: [
      ...COMMON_DOCUMENTS,
      DocumentType.ITR,
      DocumentType.GST_CERTIFICATE,
    ],
  },
  [LoanType.HOME]: {
    [EmploymentType.SALARIED]: [
      ...COMMON_DOCUMENTS,
      DocumentType.SALARY_SLIP,
      DocumentType.PROPERTY_DOCUMENT,
    ],
    [EmploymentType.SELF_EMPLOYED]: [
      ...COMMON_DOCUMENTS,
      DocumentType.ITR,
      DocumentType.PROPERTY_DOCUMENT,
    ],
    [EmploymentType.BUSINESS_OWNER]: [
      ...COMMON_DOCUMENTS,
      DocumentType.ITR,
      DocumentType.GST_CERTIFICATE,
      DocumentType.PROPERTY_DOCUMENT,
    ],
  },
  [LoanType.BUSINESS]: {
    [EmploymentType.SALARIED]: [
      ...COMMON_DOCUMENTS,
      DocumentType.SALARY_SLIP,
      DocumentType.BUSINESS_PROOF,
    ],
    [EmploymentType.SELF_EMPLOYED]: [
      ...COMMON_DOCUMENTS,
      DocumentType.ITR,
      DocumentType.BUSINESS_PROOF,
    ],
    [EmploymentType.BUSINESS_OWNER]: [
      ...COMMON_DOCUMENTS,
      DocumentType.ITR,
      DocumentType.GST_CERTIFICATE,
      DocumentType.BUSINESS_PROOF,
    ],
  },
};

// --- Document Labels ---

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  [DocumentType.PAN_CARD]: 'PAN Card',
  [DocumentType.AADHAAR_CARD]: 'Aadhaar Card',
  [DocumentType.SALARY_SLIP]: 'Latest 3 Months Salary Slips',
  [DocumentType.BANK_STATEMENT]: '6 Months Bank Statement',
  [DocumentType.ITR]: 'Income Tax Returns (2 Years)',
  [DocumentType.ADDRESS_PROOF]: 'Address Proof',
  [DocumentType.PROPERTY_DOCUMENT]: 'Property Documents',
  [DocumentType.GST_CERTIFICATE]: 'GST Registration Certificate',
  [DocumentType.BUSINESS_PROOF]: 'Business Registration Proof',
  [DocumentType.PHOTO]: 'Passport Size Photograph',
};

// --- File Upload Constraints ---

export const FILE_CONSTRAINTS = {
  maxSizeMB: 5,
  maxSizeBytes: 5 * 1024 * 1024,
  compressionMaxSizeMB: 1,
  acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  acceptedDocTypes: ['application/pdf'],
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
} as const;

// --- Wizard Steps ---

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Loan Details',
    description: 'Choose your loan type and amount',
    icon: '💰',
    isOptional: false,
    isConditional: false,
  },
  {
    id: 2,
    title: 'Personal Info',
    description: 'Your personal details',
    icon: '👤',
    isOptional: false,
    isConditional: false,
  },
  {
    id: 3,
    title: 'Identity',
    description: 'PAN & Aadhaar verification',
    icon: '🪪',
    isOptional: false,
    isConditional: false,
  },
  {
    id: 4,
    title: 'Address',
    description: 'Current & permanent address',
    icon: '🏠',
    isOptional: false,
    isConditional: false,
  },
  {
    id: 5,
    title: 'Employment',
    description: 'Income & employment details',
    icon: '💼',
    isOptional: false,
    isConditional: false,
  },
  {
    id: 6,
    title: 'Co-Applicant',
    description: 'Co-applicant information',
    icon: '👥',
    isOptional: true,
    isConditional: true,
  },
  {
    id: 7,
    title: 'Documents',
    description: 'Upload required documents',
    icon: '📄',
    isOptional: false,
    isConditional: false,
  },
  {
    id: 8,
    title: 'Review',
    description: 'Review and submit',
    icon: '✅',
    isOptional: false,
    isConditional: false,
  },
];

// --- Co-Applicant Thresholds ---

export const CO_APPLICANT_CONFIG = {
  homeLoanAmountThreshold: 5000000, // ₹50 Lakhs
  emiAffordabilityRatio: 0.4, // EMI should be ≤ 40% of income
} as const;

// --- Auto Save ---

export const AUTO_SAVE_CONFIG = {
  intervalMs: 30000, // 30 seconds
  storageKey: 'loan_app_draft',
  expiryHours: 72,
  version: '1.0.0',
} as const;

// --- PIN Code Database (Simulated) ---

export const PIN_CODE_DATABASE: Record<string, { city: string; state: string; district: string }> = {
  '110001': { city: 'New Delhi', state: 'Delhi', district: 'Central Delhi' },
  '110002': { city: 'New Delhi', state: 'Delhi', district: 'North Delhi' },
  '110003': { city: 'New Delhi', state: 'Delhi', district: 'Central Delhi' },
  '110010': { city: 'New Delhi', state: 'Delhi', district: 'South Delhi' },
  '110020': { city: 'New Delhi', state: 'Delhi', district: 'South Delhi' },
  '110025': { city: 'New Delhi', state: 'Delhi', district: 'South Delhi' },
  '110030': { city: 'New Delhi', state: 'Delhi', district: 'South West Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai City' },
  '400050': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai Suburban' },
  '400053': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai Suburban' },
  '400069': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai Suburban' },
  '400076': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai Suburban' },
  '400097': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai Suburban' },
  '500001': { city: 'Hyderabad', state: 'Telangana', district: 'Hyderabad' },
  '500003': { city: 'Hyderabad', state: 'Telangana', district: 'Hyderabad' },
  '500032': { city: 'Hyderabad', state: 'Telangana', district: 'Hyderabad' },
  '500081': { city: 'Hyderabad', state: 'Telangana', district: 'Rangareddy' },
  '560001': { city: 'Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban' },
  '560034': { city: 'Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban' },
  '560066': { city: 'Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban' },
  '560100': { city: 'Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai' },
  '600017': { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai' },
  '600040': { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai' },
  '700001': { city: 'Kolkata', state: 'West Bengal', district: 'Kolkata' },
  '700020': { city: 'Kolkata', state: 'West Bengal', district: 'Kolkata' },
  '411001': { city: 'Pune', state: 'Maharashtra', district: 'Pune' },
  '411014': { city: 'Pune', state: 'Maharashtra', district: 'Pune' },
  '411045': { city: 'Pune', state: 'Maharashtra', district: 'Pune' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', district: 'Ahmedabad' },
  '380015': { city: 'Ahmedabad', state: 'Gujarat', district: 'Ahmedabad' },
  '302001': { city: 'Jaipur', state: 'Rajasthan', district: 'Jaipur' },
  '302020': { city: 'Jaipur', state: 'Rajasthan', district: 'Jaipur' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', district: 'Lucknow' },
  '226010': { city: 'Lucknow', state: 'Uttar Pradesh', district: 'Lucknow' },
  '462001': { city: 'Bhopal', state: 'Madhya Pradesh', district: 'Bhopal' },
  '452001': { city: 'Indore', state: 'Madhya Pradesh', district: 'Indore' },
  '800001': { city: 'Patna', state: 'Bihar', district: 'Patna' },
  '160001': { city: 'Chandigarh', state: 'Chandigarh', district: 'Chandigarh' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', district: 'Gautam Buddh Nagar' },
  '122001': { city: 'Gurugram', state: 'Haryana', district: 'Gurugram' },
  '122018': { city: 'Gurugram', state: 'Haryana', district: 'Gurugram' },
};

// --- Indian States ---

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Chandigarh', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
  'Puducherry', 'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep',
] as const;
