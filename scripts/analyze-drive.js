import fs from 'fs';

const html = fs.readFileSync('scripts/drive_page.html', 'utf-8');

// Search for mentions of words
const words = ['Aldona', 'Porvorim', 'Sanquelim', 'AC', 'Bicholim', 'Bardez', 'xlsx', 'xls', 'Sheet', 'Drive', 'Supplement', 'Draft', 'Voter'];
for (const w of words) {
  const matches = [...html.matchAll(new RegExp(w, 'gi'))];
  console.log(`${w}: ${matches.length}`);
}

// Find any strings that look like document titles or filenames
const titleRegex = /"title":"([^"]+)"/g;
const titles = [...html.matchAll(titleRegex)].map(m => m[1]);
console.log('Titles found:', titles);

// Look for data-id or drive item identifiers
const idRegex = /"id":"([a-zA-Z0-9_-]{20,})"/g;
const ids = [...new Set([...html.matchAll(idRegex)].map(m => m[1]))];
console.log('IDs found:', ids.slice(0, 10));

// Also search for JSON-like arrays containing filenames or spreadsheets
const jsonMatches = html.match(/\["(?:[a-zA-Z0-9_-]+)",\["(?:[^"]+)"/g);
console.log('JSON matches:', jsonMatches?.slice(0, 5));
