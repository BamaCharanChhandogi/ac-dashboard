import fs from 'fs';

const html = fs.readFileSync('scripts/aldona_draft.html', 'utf-8');

// Match filename and adjacent or associated data-id
const matches = [...html.matchAll(/\["([a-zA-Z0-9_-]{25,})",\["1Qwp1WRLS_HhSt6mpt_zi7tRRCY-8c4q3"\],"([^"]+)"/g)];
console.log('Found file ID mappings in aldona_draft:', matches.length);
matches.slice(0, 10).forEach(m => console.log(`${m[2]} -> ${m[1]}`));
