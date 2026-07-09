// ============================================================
// Formatting Utilities
// ============================================================

/**
 * Mask Aadhaar number: 1234 5678 9012 → XXXX XXXX 9012
 */
export function maskAadhaar(aadhaar: string): string {
  const cleaned = aadhaar.replace(/\s/g, '');
  if (cleaned.length !== 12) return aadhaar;
  return `XXXX XXXX ${cleaned.slice(-4)}`;
}

/**
 * Format Aadhaar with spaces: 123456789012 → 1234 5678 9012
 */
export function formatAadhaar(aadhaar: string): string {
  const cleaned = aadhaar.replace(/\s/g, '');
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Mask PAN: ABCDE1234F → XXXXX1234X (show only digits)
 */
export function maskPAN(pan: string): string {
  if (pan.length !== 10) return pan;
  return `XXXXX${pan.slice(5, 9)}X`;
}

/**
 * Format phone with country code: 9876543210 → +91 98765 43210
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.length !== 10) return phone;
  return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
}

/**
 * Format date for display: 1995-06-15 → 15 Jun 1995
 */
export function formatDate(date: string): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format file size: 1536000 → 1.5 MB
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Generate a unique reference number for loan applications.
 * Format: LA-YYYYMMDD-XXXXXXXX
 */
export function generateReferenceNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `LA-${dateStr}-${random}`;
}

/**
 * Generate a unique ID for documents and internal use.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Capitalize first letter of each word.
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
}
