// ============================================================
// Validation Utilities
// ============================================================

/**
 * Validate PAN format: ABCDE1234F
 * 5 uppercase letters, 4 digits, 1 uppercase letter
 */
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function isValidPAN(pan: string): boolean {
  return PAN_REGEX.test(pan.toUpperCase());
}

/**
 * Validate Aadhaar number using Verhoeff checksum algorithm.
 * Aadhaar is 12 digits. The last digit is a Verhoeff checksum.
 */

// Verhoeff tables
const verhoeffD: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const verhoeffP: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const verhoeffInv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

function verhoeffValidate(num: string): boolean {
  let c = 0;
  const digits = num.split('').map(Number).reverse();
  for (let i = 0; i < digits.length; i++) {
    c = verhoeffD[c][verhoeffP[i % 8][digits[i]]];
  }
  return c === 0;
}

export function isValidAadhaar(aadhaar: string): boolean {
  const cleaned = aadhaar.replace(/\s/g, '');
  if (!/^\d{12}$/.test(cleaned)) return false;
  // First digit cannot be 0 or 1
  if (cleaned[0] === '0' || cleaned[0] === '1') return false;
  return verhoeffValidate(cleaned);
}

/**
 * Validate GST Number format.
 * Format: 2-digit state code + PAN + 1 alphanumeric + Z + checksum
 * Example: 27AADCB2230M1ZR
 */
export const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/;

export function isValidGST(gst: string): boolean {
  return GST_REGEX.test(gst.toUpperCase());
}

/**
 * Validate Indian PIN code (6 digits, first digit 1-9).
 */
export function isValidPIN(pin: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pin);
}

/**
 * Validate Indian mobile number (10 digits, starts with 6-9).
 */
export function isValidMobile(mobile: string): boolean {
  const cleaned = mobile.replace(/[\s-]/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Validate email address.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Calculate age from date of birth string (YYYY-MM-DD).
 */
export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Validate age is within acceptable range for loan applications.
 */
export function isValidAge(dob: string, minAge = 18, maxAge = 65): boolean {
  const age = calculateAge(dob);
  return age >= minAge && age <= maxAge;
}

/** Verhoeff checksum generate — used for testing / generating valid Aadhaar */
export function verhoeffGenerate(num: string): string {
  let c = 0;
  const digits = num.split('').map(Number).reverse();
  for (let i = 0; i < digits.length; i++) {
    c = verhoeffD[c][verhoeffP[(i + 1) % 8][digits[i]]];
  }
  return num + verhoeffInv[c].toString();
}
