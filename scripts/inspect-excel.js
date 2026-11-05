import XLSX from 'xlsx';

const workbook = XLSX.readFile('scripts/booth1.xlsx');
console.log('Sheet names:', workbook.SheetNames);

const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
console.log('Total rows in Sheet 1:', data.length);
console.log('First 5 rows:');
data.slice(0, 5).forEach((r, i) => console.log(`Row ${i}:`, r));
