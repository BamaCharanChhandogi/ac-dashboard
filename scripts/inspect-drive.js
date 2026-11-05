import fs from 'fs';

async function checkDrive() {
  try {
    const url = 'https://drive.google.com/drive/folders/1pisvJPU9QeygMsdLCee-junjFaYSenep';
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    fs.writeFileSync('scripts/drive_page.html', html, 'utf-8');
    console.log('Saved drive_page.html, length:', html.length);

    // Look for filenames and links
    const regex = /"([^"]+\.(?:xlsx|pdf|csv|json|docx))"/gi;
    const matches = [...html.matchAll(regex)].map(m => m[1]);
    console.log('Direct file matches:', [...new Set(matches)]);

    // Check for drive item data arrays
    // In Google Drive, items often look like: [null, "File Name", ...] or item metadata
    const titles = [...html.matchAll(/\["([a-zA-Z0-9_-]{25,})",\["([^"]+)"/g)].map(m => ({ id: m[1], name: m[2] }));
    console.log('Drive items found:', titles);
  } catch (e) {
    console.error('Error fetching drive:', e);
  }
}

checkDrive();
