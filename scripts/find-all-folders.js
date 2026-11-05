import fs from 'fs';

const html = fs.readFileSync('scripts/drive_page.html', 'utf-8');
const regex = /\\x22([a-zA-Z0-9_\-\s]+)\\x22,\\x22application\\\/vnd\.google-apps\.folder\\x22/g;
let m;
const set = new Set();
while ((m = regex.exec(html)) !== null) {
  set.add(m[1]);
}
console.log('All folders in drive_page:', [...set]);
