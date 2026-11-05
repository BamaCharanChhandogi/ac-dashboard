import fs from 'fs';

const html = fs.readFileSync('scripts/drive_page.html', 'utf-8');

function findContext(str) {
  let idx = 0;
  while ((idx = html.indexOf(str, idx)) !== -1) {
    const start = Math.max(0, idx - 100);
    const end = Math.min(html.length, idx + str.length + 150);
    console.log(`--- MATCH "${str}" at ${idx} ---`);
    console.log(html.substring(start, end));
    idx += str.length;
  }
}

console.log('=== ALDONA CONTEXT ===');
findContext('Aldona');

console.log('=== PORVORIM CONTEXT ===');
findContext('Porvorim');
