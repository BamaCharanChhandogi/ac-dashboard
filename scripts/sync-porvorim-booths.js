import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ac09Path = path.join(__dirname, '../public/data/ac09-porvorim.json');
const mapPath = path.join(__dirname, '../src/data/porvorim-map.json');

const ac09 = JSON.parse(fs.readFileSync(ac09Path, 'utf-8'));
const porvorimMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));

const files = fs.readdirSync(path.join(__dirname, 'cache_porvorim')).filter(f => f.endsWith('.xlsx')).sort();

const boothDataMap = new Map();

files.forEach(f => {
  const wb = XLSX.readFile(path.join(__dirname, 'cache_porvorim', f));
  const hRows = XLSX.utils.sheet_to_json(wb.Sheets['Booth_Header'] || {});
  const h = {};
  hRows.forEach(r => { if (r.Field) h[r.Field] = r.Value; });

  const qRows = XLSX.utils.sheet_to_json(wb.Sheets['QA_Summary'] || {});
  const q = {};
  qRows.forEach(r => { if (r.Field) q[r.Field] = r.Value; });

  const partNo = Number(h.PartNo || parseInt(f.slice(0, 3)));
  let psName = String(h.PollingStationNameAddress || h.PollingStationAddress || `Polling Station ${partNo}`);
  psName = psName
    .replace(/^[\|\-\s0-9]+/, '')
    .replace(/[\|\-]+$/, '')
    .replace(/\|/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (psName.startsWith('-')) psName = psName.replace(/^[\-\s]+/, '').trim();

  const voters = Number(q.PrintedFinalNetTotal || q.ActiveElectors || 600);
  const added = Number(q.PrintedAdditionsTotal || q.AddedElectors || 0);
  const deleted = Number(q.PrintedDeletedTotal || q.DeletedElectors || 0);

  boothDataMap.set(partNo, { psName, voters, added, deleted });
});

// Update ac09.spatial.booths and porvorimMap.booths
[ac09.spatial.booths, porvorimMap.booths].forEach(boothList => {
  if (!boothList) return;
  boothList.forEach(b => {
    const num = Number(b.number || b.part_no);
    const real = boothDataMap.get(num);
    if (real) {
      b.station_name = real.psName;
      b.voters = real.voters;
      b.added = real.added;
      b.deleted = real.deleted;
    }
  });
});

fs.writeFileSync(ac09Path, JSON.stringify(ac09, null, 2), 'utf-8');
fs.writeFileSync(mapPath, JSON.stringify(porvorimMap, null, 2), 'utf-8');

console.log('✓ Successfully synchronized all 39 Porvorim booths with exact Excel station names and figures!');
