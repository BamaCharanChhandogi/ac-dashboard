import fs from 'fs';

async function listFiles(folderId, label) {
  const url = `https://drive.google.com/drive/folders/${folderId}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync(`scripts/${label}.html`, html, 'utf-8');

  // Match items in folder
  const matches = [...html.matchAll(/\\x5b\\x22([a-zA-Z0-9_-]{25,})\\x22,\\x5b\\x22[a-zA-Z0-9_-]+\\x22\\x5d,\\x22([^\\x22]+)\\x22/g)];
  console.log(`=== ${label.toUpperCase()} (${matches.length} items) ===`);
  matches.forEach(m => {
    console.log(`[${m[1]}] "${m[2]}"`);
  });
}

async function run() {
  await listFiles('1Qwp1WRLS_HhSt6mpt_zi7tRRCY-8c4q3', 'aldona_draft');
  await listFiles('1LrGPjEosh7SJcWlFfn2vtqhbvT7MQdAq', 'aldona_final');
  await listFiles('1-F7u25oXmDCMiFL8yh8udT71qHMaN5z-', 'porvorim_draft');
  await listFiles('1xyumr7smKGPandg5k_8Q14tErLY1qEGx', 'porvorim_final');
}

run();
