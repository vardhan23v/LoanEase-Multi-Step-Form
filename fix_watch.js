const fs = require('fs');
const path = require('path');

const formsDir = path.join(__dirname, 'src', 'components', 'forms');
const files = fs.readdirSync(formsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(formsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace watchAll pattern with subscription pattern
  // E.g.
  // const watchAll = watch();
  // useEffect(() => {
  //   setAddress(watchAll);
  // }, [watchAll, setAddress]);
  
  // Find the pattern
  const match = content.match(/const watchAll = watch\(\);\s*useEffect\(\(\) => \{\s*([a-zA-Z]+)\([^;]+\);\s*\}, \[watchAll, ([a-zA-Z]+)\]\);/s);
  
  if (match) {
    const setterName = match[1];
    
    // We can just use `value as any` since the type is strictly validated by zod anyway.
    // Let's replace the whole block.
    // Wait, IdentityStep has multiple lines inside useEffect:
    // setIdentity({ panNumber: watchAll.panNumber, ... })
    // CoApplicantStep has:
    // setCoApplicant({ ...watchAll, required: isRequired })
  }
}
