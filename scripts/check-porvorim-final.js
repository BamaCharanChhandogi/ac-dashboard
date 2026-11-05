import fs from 'fs';

const html = fs.readFileSync('scripts/porvorim_final.html', 'utf-8');
const files = html.match(/[a-zA-Z0-9_\-\.\s\(\)]+\.(pdf|xlsx|xls|csv)/gi);
console.log('Files count in Porvorim Final:', files ? [...new Set(files)].length : 0);
console.log('Sample files in Porvorim Final:', files ? [...new Set(files)].slice(0, 10) : 'None');
