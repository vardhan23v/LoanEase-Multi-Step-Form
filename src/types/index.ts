// ============================================================
// Loan Application Platform — Type Definitions
// ============================================================

// --- Enums ---

export enum LoanType {
  PERSONAL = 'PERSONAL',
  HOME = 'HOME',
  BUSINESS = 'BUSINESS',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}

export enum ResidenceType {
  OWN = 'OWN',
  RENT = 'RENT',
  COMPANY = 'COMPANY',
  PARENTS = 'PARENTS',
}

export enum EmploymentType {
  SALARIED = 'SALARIED',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  BUSINESS_OWNER = 'BUSINESS_OWNER',
}

export enum DocumentType {
  PAN_CARD = 'PAN_CARD',
  AADHAAR_CARD = 'AADHAAR_CARD',
  SALARY_SLIP = 'SALARY_SLIP',
  BANK_STATEMENT = 'BANK_STATEMENT',
  ITR = 'ITR',
  ADDRESS_PROOF = 'ADDRESS_PROOF',
  PROPERTY_DOCUMENT = 'PROPERTY_DOCUMENT',
  GST_CERTIFICATE = 'GST_CERTIFICATE',
  BUSINESS_PROOF = 'BUSINESS_PROOF',
  PHOTO = 'PHOTO',
}

export enum RelationshipType {
  SPOUSE = 'SPOUSE',
  PARENT = 'PARENT',
  SIBLING = 'SIBLING',
  CHILD = 'CHILD',
  OTHER = 'OTHER',
}

// --- Step Types ---

export interface LoanTypeData {
  loanType: LoanType;
  loanAmount: number;
  tenure: number;
  purpose: string;
  referralCode?: string;
}

export interface PersonalInfoData {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  fatherName: string;
  motherName: string;
  email: string;
  mobile: string;
  alternateMobile?: string;
}

export interface IdentityData {
  panNumber: string;
  aadhaarNumber: string;
  panVerified: boolean;
  aadhaarVerified: boolean;
  identityConsent: boolean;
}

export interface AddressData {
  currentAddress: Address;
  permanentSameAsCurrent: boolean;
  permanentAddress?: Address;
  residenceType: ResidenceType;
  yearsAtCurrentAddress: number;
  previousAddress?: Address;
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  pinCode: string;
  city: string;
  state: string;
}

// --- Employment Discriminated Union ---

export interface SalariedEmployment {
  employmentType: EmploymentType.SALARIED;
  companyName: string;
  designation: string;
  yearsOfExperience: number;
  monthlySalary: number;
  employerType: string;
}

export interface SelfEmployedEmployment {
  employmentType: EmploymentType.SELF_EMPLOYED;
  profession: string;
  yearsOfPractice: number;
  monthlyIncome: number;
  professionalRegistration?: string;
}

export interface BusinessOwnerEmployment {
  employmentType: EmploymentType.BUSINESS_OWNER;
  businessName: string;
  businessType: string;
  gstNumber: string;
  yearsInBusiness: number;
  annualTurnover: number;
  monthlyIncome: number;
}

export type EmploymentData =
  | SalariedEmployment
  | SelfEmployedEmployment
  | BusinessOwnerEmployment;

// --- Co-Applicant ---

export interface CoApplicantData {
  required: boolean;
  fullName?: string;
  panNumber?: string;
  relationship?: RelationshipType;
  monthlyIncome?: number;
  coApplicantConsent?: boolean;
}

// --- Documents ---

export interface UploadedDocument {
  id: string;
  type: DocumentType;
  file: File | null;
  fileName: string;
  fileSize: number;
  mimeType: string;
  preview?: string;
  base64?: string;
  uploadProgress: number;
  uploadedAt: string;
}

export interface DocumentsData {
  documents: UploadedDocument[];
  signatureBase64?: string;
}

// --- Review ---

export interface ReviewConsents {
  termsAndConditions: boolean;
  creditBureauCheck: boolean;
  eSignAuthorization: boolean;
  dataSharingAgreement: boolean;
}

// --- Complete Form ---

export interface LoanApplicationData {
  loanTypeData: LoanTypeData;
  personalInfo: PersonalInfoData;
  identity: IdentityData;
  address: AddressData;
  employment: EmploymentData;
  coApplicant: CoApplicantData;
  documents: DocumentsData;
  reviewConsents: ReviewConsents;
}

// --- Wizard ---

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  isOptional: boolean;
  isConditional: boolean;
}

export type StepValidityMap = Record<number, boolean>;

// --- Auto Save ---

export interface AutoSavePayload {
  version: string;
  timestamp: string;
  loanType: LoanType | null;
  currentStep: number;
  encryptedData: string;
  iv: string;
}

// --- EMI ---

export interface EMIBreakdown {
  monthlyEMI: number;
  totalInterest: number;
  processingFee: number;
  totalCost: number;
  principal: number;
  interestRate: number;
  tenure: number;
}

// --- PIN Lookup ---

export interface PinLookupResult {
  city: string;
  state: string;
  district: string;
  found: boolean;
}
