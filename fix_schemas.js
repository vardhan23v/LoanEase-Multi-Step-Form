const fs = require('fs');
const path = require('path');

const schemasDir = path.join(__dirname, 'src', 'schemas');
const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.ts'));

for (const file of files) {
  const filePath = path.join(schemasDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix duplicate message keys
  content = content.replace(/\{\s*message:\s*([^,]+),\s*message:\s*([^\}]+)\s*\}/g, '{ message: $1 }');

  // Fix too_small / too_big issues in loanType.schema.ts
  if (file === 'loanType.schema.ts') {
    content = content.replace(/code: 'too_small',[^}]+message: ([^}]+)\}/g, 'code: z.ZodIssueCode.custom, message: $1}');
    content = content.replace(/code: 'too_big',[^}]+message: ([^}]+)\}/g, 'code: z.ZodIssueCode.custom, message: $1}');
  }

  fs.writeFileSync(filePath, content);
}
console.log('Schemas fixed');
