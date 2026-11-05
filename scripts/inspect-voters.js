import XLSX from 'xlsx';

const workbook = XLSX.readFile('scripts/booth1.xlsx');
console.log('--- BOOTH_HEADER ---');
console.log(XLSX.utils.sheet_to_json(workbook.Sheets['Booth_Header']));

console.log('--- QA_SUMMARY ---');
console.log(XLSX.utils.sheet_to_json(workbook.Sheets['QA_Summary']));

console.log('--- VOTERS (sample 3) ---');
const voters = XLSX.utils.sheet_to_json(workbook.Sheets['Voters']);
console.log('Total voters in Booth 1:', voters.length);
console.log(voters.slice(0, 3));
