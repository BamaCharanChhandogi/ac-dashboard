import fs from 'fs';

const html = fs.readFileSync('scripts/porvorim_draft.html', 'utf-8');
console.log('Length:', html.length);
const files = html.match(/[a-zA-Z0-9_\-\.\s\(\)]+\.(pdf|xlsx|xls|csv)/gi);
console.log('Porvorim Draft Files count:', files ? [...new Set(files)].length : 0);
console.log('Sample Porvorim files:', files ? [...new Set(files)].slice(0, 10) : 'None');
