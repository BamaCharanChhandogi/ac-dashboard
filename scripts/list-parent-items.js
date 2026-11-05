import fs from 'fs';

const html = fs.readFileSync('scripts/drive_page.html', 'utf-8');

// Match all items in the folder: [\"<ID>\",[\"<PARENT_ID>\"],\"<NAME>\",\"<TYPE>\"
const regex = /\\x5b\\x22([a-zA-Z0-9_-]{25,})\\x22,\\x5b\\x221pisvJPU9QeygMsdLCee-junjFaYSenep\\x22\\x5d,\\x22([^\\]+?)\\x22,\\x22([^\\x22]+)\\x22/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(`ID: ${m[1]} | Name: ${m[2]} | Type: ${m[3]}`);
}
