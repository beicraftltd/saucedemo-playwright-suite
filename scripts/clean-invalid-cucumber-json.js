const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '../reports');
const files = fs.readdirSync(reportsDir);

let removed = 0;

files.forEach(file => {
  if (/^cucumber-report-\d+\.json$/.test(file)) {
    const filePath = path.join(reportsDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.trim()) throw new Error('Empty file');
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) throw new Error('Not an array');
      console.log(`Valid JSON: ${file}`);
    } catch (err) {
      console.warn(`Deleting invalid JSON file: ${file} (${err.message})`);
      fs.unlinkSync(filePath);
      removed++;
    }
  }
});

console.log(`Cleanup complete. Removed ${removed} invalid JSON file(s).`); 