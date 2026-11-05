import fs from 'fs';
import path from 'path';

// Extract all file IDs from scripts/aldona_final.html
const html = fs.readFileSync('scripts/aldona_final.html', 'utf-8');
const regex = /aria-label="([0-9]{3}_Final Draft_Aldona\.xlsx)[^"]*"\s+data-handled-by-drag-and-drop="true"\s+ssk='5:auSv138:([a-zA-Z0-9_-]+)-0-16'/g;

const files = [];
let m;
while ((m = regex.exec(html)) !== null) {
  files.push({ name: m[1], id: m[2] });
}

console.log(`Found ${files.length} Aldona Final files!`);
files.slice(0, 5).forEach(f => console.log(f.name, f.id));
