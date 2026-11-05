import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Download file with retry
async function downloadFile(id, destPath, retries = 3) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    return true;
  }
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 500) throw new Error('File too small or rate limited');
      fs.writeFileSync(destPath, Buffer.from(buf));
      return true;
    } catch (e) {
      if (i === retries - 1) {
        console.error(`Failed to download ${id} to ${destPath}: ${e.message}`);
        return false;
      }
      await sleep(1000 * (i + 1));
    }
  }
  return false;
}

// Download list of files with concurrency limit
async function downloadBatch(items, dir, concurrency = 6) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    console.log(`Downloading ${chunk.map(c => c.name).join(', ')}...`);
    const promises = chunk.map(item => {
      const filePath = path.join(dir, item.name);
      return downloadFile(item.id, filePath).then(ok => ({ item, ok, filePath }));
    });
    const batchRes = await Promise.all(promises);
    results.push(...batchRes);
    await sleep(200);
  }
  return results;
}

export { downloadBatch };
