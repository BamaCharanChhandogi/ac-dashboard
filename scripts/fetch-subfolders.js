import fs from 'fs';

async function fetchFolder(id, name) {
  const url = `https://drive.google.com/drive/folders/${id}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync(`scripts/${name}_page.html`, html, 'utf-8');
  console.log(`Saved ${name}_page.html (length: ${html.length})`);

  // Find all file items in this folder
  // Google drive folder items are stored in escaped hex strings \x5b\x22<ID>\x22,\x5b\x22<PARENT_ID>\x22\x5d,\x22<NAME>\x22
  const matches = [...html.matchAll(/\\x5b\\x22([a-zA-Z0-9_-]{25,})\\x22,\\x5b\\x22[a-zA-Z0-9_-]+\\x22\\x5d,\\x22([^\\x22]+)\\x22/g)];
  console.log(`=== ${name.toUpperCase()} FILES ===`);
  matches.forEach(m => {
    console.log(`File: "${m[2]}" | ID: ${m[1]}`);
  });
}

async function run() {
  await fetchFolder('1O87kywHkLkjzc16r-vpdVCtj1277sTiC', 'aldona');
  await fetchFolder('11uQhX7TMsOK2eIQdnt5pNXgVBa8cLxcO', 'porvorim');
}

run();
