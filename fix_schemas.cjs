const fs = require('fs');
const path = require('path');

const schemasDir = path.join(__dirname, 'src', 'schemas');
const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.ts'));

for (const file of files) {
  const filePath = path.join(schemasDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix duplicate message keys: { message: "a", message: "b" } -> { message: "a" }
  content = content.replace(/\{\s*message:\s*([^,]+),\s*message:\s*([^\}]+)\s*\}/g, '{ message: $1 }');
  
  // Also { message: '...', message: '...' } where both are string literals
  content = content.replace(/message:\s*('[^']+')\s*,\s*message:\s*('[^']+')/g, "message: $1");
  content = content.replace(/message:\s*("[^"]+")\s*,\s*message:\s*("[^"]+")/g, "message: $1");
  
  // Fix too_small / too_big issues in loanType.schema.ts
  if (file === 'loanType.schema.ts') {
    content = content.replace(/code: 'too_small',[^}]+message: ([^}]+)\s*\}/g, 'code: z.ZodIssueCode.custom, message: $1}');
    content = content.replace(/code: 'too_big',[^}]+message: ([^}]+)\s*\}/g, 'code: z.ZodIssueCode.custom, message: $1}');
  }

  // documents.schema.ts - fix the Zod error: Argument of type 'string' is not assignable to parameter of type '"image/jpeg" | "image/png" | "image/webp" | "application/pdf"'.
  if (file === 'documents.schema.ts') {
     content = content.replace(/const mimeType = doc.mimeType \|\| 'application\/pdf';/g, "const mimeType = (doc.mimeType || 'application/pdf') as any;");
  }

  // address.schema.ts - fix Type 'boolean | undefined' is not assignable to type 'boolean'.
  // identity.schema.ts - Type 'boolean | undefined' is not assignable to type 'boolean'.
  // We can just fix the types being too strict in useForm for these by adding default values in the step components, but the error is TS complaining about Resolver types.
  // Wait, Zod `boolean().optional()` infers `boolean | undefined`. If we want `boolean`, we shouldn't use `.optional()` or we should use `.default(false)`.
  content = content.replace(/\.boolean\(\)\.optional\(\)/g, ".boolean().default(false)");
  
  fs.writeFileSync(filePath, content);
}
console.log('Schemas fixed');
