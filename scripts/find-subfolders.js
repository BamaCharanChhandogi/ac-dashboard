import fs from 'fs';

const html = fs.readFileSync('scripts/drive_page.html', 'utf-8');
const regex = /"application\/vnd\.google-apps\.folder"\]/g;
// Find all occurrences of folder mimetypes and their names
const matches = [...html.matchAll(/\["([a-zA-Z0-9_-]{25,})",\["1pisvJPU9QeygMsdLCee-junjFaYSenep"\],"([^"]+)"/g)];
console.log('Subfolders in 1pisvJPU9QeygMsdLCee-junjFaYSenep:');
matches.forEach(m => console.log(`- ${m[2]} (${m[1]})`));
