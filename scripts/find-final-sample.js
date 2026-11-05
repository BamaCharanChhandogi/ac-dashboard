import fs from 'fs';

const html = fs.readFileSync('scripts/aldona_final.html', 'utf-8');
const sample = '001_Final Draft_Aldona.xlsx';
const idx = html.indexOf(sample);
console.log('Index of Final Draft sample:', idx);
if (idx !== -1) {
  const match = html.substring(Math.max(0, idx - 150), idx + sample.length + 150);
  console.log(match);
  const idMatch = match.match(/ssk='5:auSv138:([a-zA-Z0-9_-]+)-0-16'/);
  console.log('File ID:', idMatch ? idMatch[1] : 'Not found');
}
