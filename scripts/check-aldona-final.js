import fs from 'fs';

const html = fs.readFileSync('scripts/aldona_final.html', 'utf-8');
console.log('Length of aldona_final:', html.length);
const files = html.match(/[a-zA-Z0-9_\-\.\s\(\)]+\.(pdf|xlsx|xls|csv)/gi);
console.log('Files count in Aldona Final:', files ? [...new Set(files)].length : 0);
console.log('Sample files in Aldona Final:', files ? [...new Set(files)].slice(0, 10) : 'None');
