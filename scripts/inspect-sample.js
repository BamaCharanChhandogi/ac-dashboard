import fs from 'fs';

const html = fs.readFileSync('scripts/aldona_draft.html', 'utf-8');
const sample = '001_2026-EROLLGEN-S05-10-SIR-DraftRoll-Revision1-ENG-1-WI.xlsx';
const idx = html.indexOf(sample);
console.log('Index of sample:', idx);
if (idx !== -1) {
  console.log('Surrounding 400 chars:');
  console.log(html.substring(Math.max(0, idx - 200), idx + sample.length + 200));
}
