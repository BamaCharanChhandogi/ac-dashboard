import fs from 'fs';

const html = fs.readFileSync('scripts/aldona_draft.html', 'utf-8');
console.log('Length:', html.length);
const files = html.match(/[a-zA-Z0-9_\-\.\s\(\)]+\.(pdf|xlsx|xls|csv)/gi);
console.log('Files:', files ? [...new Set(files)] : 'None');

// Let's search for any data chunks or folder IDs in the HTML
const chunks = [...html.matchAll(/data-id="([^"]+)"/g)].map(m => m[1]);
console.log('Data IDs:', chunks.slice(0, 10));

// Check if there are JS variable initializations
const ivd = html.match(/_DRIVE_ivd\s*=\s*'([^']+)'/);
if (ivd) {
  console.log('Found _DRIVE_ivd, length:', ivd[1].length);
  fs.writeFileSync('scripts/ivd_aldona_draft.txt', ivd[1]);
}
