import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Import our normalizer and formatters
import { 
  safeDivide, 
  safePercentage, 
  normalizeGender, 
  computeSexRatio, 
  clubAuxiliaryBooths, 
  normalizeAgeDistribution, 
  tagHouseholdCluster, 
  sanitizeVoterRecord 
} from '../src/utils/normalizer.js';

import { 
  formatIndianNumber, 
  formatPercentage, 
  formatMargin, 
  getPartyTheme, 
  getMarginCategory 
} from '../src/utils/formatters.js';

describe('Data Normalizer & Math Resiliency (Zero NaN / Undefined / Null)', () => {

  test('safeDivide should safely handle divide-by-zero, null, and NaN', () => {
    assert.strictEqual(safeDivide(10, 0), 0);
    assert.strictEqual(safeDivide(10, 0, 5), 5);
    assert.strictEqual(safeDivide(null, 100), 0);
    assert.strictEqual(safeDivide(undefined, 100), 0);
    assert.strictEqual(safeDivide(NaN, 100), 0);
    assert.strictEqual(safeDivide(10, NaN), 0);
    assert.strictEqual(safeDivide(10, Infinity), 0);
    assert.strictEqual(safeDivide(50, 100), 0.5);
  });

  test('safePercentage should calculate exact percentages without NaN', () => {
    assert.strictEqual(safePercentage(10, 0), 0);
    assert.strictEqual(safePercentage(null, 100), 0);
    assert.strictEqual(safePercentage(50, 200), 25);
    assert.strictEqual(safePercentage(1, 3, 1), 33.3);
    assert.strictEqual(safePercentage(1, 3, 2), 33.33);
  });

  test('formatPercentage should guarantee string format with % and no NaN%', () => {
    assert.strictEqual(formatPercentage(null), '0.0%');
    assert.strictEqual(formatPercentage(undefined), '0.0%');
    assert.strictEqual(formatPercentage(NaN), '0.0%');
    assert.strictEqual(formatPercentage(''), '0.0%');
    assert.strictEqual(formatPercentage(48.27), '48.3%');
    assert.strictEqual(formatPercentage(48.27, 2), '48.27%');
    // Edge case: strings already containing '%'
    assert.strictEqual(formatPercentage('66.1%'), '66.1%');
    assert.strictEqual(formatPercentage('55.2%'), '55.2%');
    assert.strictEqual(formatPercentage('0.0%'), '0.0%');
  });

  test('formatMargin should format with leading sign (+ / -)', () => {
    assert.strictEqual(formatMargin(37.44), '+37.4%');
    assert.strictEqual(formatMargin(-8.07), '-8.1%');
    assert.strictEqual(formatMargin(0), '0.0%');
    assert.strictEqual(formatMargin(null), '0.0%');
    // Edge case: strings already containing signs or %
    assert.strictEqual(formatMargin('+37.4%'), '+37.4%');
    assert.strictEqual(formatMargin('-8.1%'), '-8.1%');
    assert.strictEqual(formatMargin('+2.6%'), '+2.6%');
  });

  test('formatIndianNumber should format thousands and lakhs with commas', () => {
    assert.strictEqual(formatIndianNumber(27265), '27,265');
    assert.strictEqual(formatIndianNumber(257326), '2,57,326');
    assert.strictEqual(formatIndianNumber(0), '0');
    assert.strictEqual(formatIndianNumber(null), '0');
    assert.strictEqual(formatIndianNumber(undefined), '0');
  });

  test('normalizeGender should classify gender variants and route scan anomalies to Unknown', () => {
    assert.strictEqual(normalizeGender('Male'), 'Male');
    assert.strictEqual(normalizeGender('M'), 'Male');
    assert.strictEqual(normalizeGender('purush'), 'Male');
    assert.strictEqual(normalizeGender('Female'), 'Female');
    assert.strictEqual(normalizeGender('F'), 'Female');
    assert.strictEqual(normalizeGender('mahila'), 'Female');
    assert.strictEqual(normalizeGender('Third Gender'), 'Third Gender');
    assert.strictEqual(normalizeGender('TG'), 'Third Gender');
    assert.strictEqual(normalizeGender('Other'), 'Third Gender');
    assert.strictEqual(normalizeGender(null), 'Unknown');
    assert.strictEqual(normalizeGender(''), 'Unknown');
    assert.strictEqual(normalizeGender('SCAN_ERROR_#404'), 'Unknown');
  });

  test('computeSexRatio should handle valid and edge-case male denominators', () => {
    // 13915 females, 13350 males -> 1042
    assert.strictEqual(computeSexRatio(13350, 13915), 1042);
    assert.strictEqual(computeSexRatio(0, 500), 0);
    assert.strictEqual(computeSexRatio(null, 500), 0);
  });

  test('clubAuxiliaryBooths should consolidate auxiliary booths (Booth 22 + 22A -> Booth 22)', () => {
    const rawBooths = [
      { part_no: '21', station_name: 'School 21', voters: 500, added: 10, deleted: 5, families: 100 },
      { part_no: '22', station_name: 'School 22 West', voters: 700, added: 20, deleted: 10, families: 150 },
      { part_no: '22A', station_name: 'School 22 East Auxiliary', voters: 640, added: 18, deleted: 14, families: 148 },
      { part_no: '23', station_name: 'School 23', voters: 450, added: 8, deleted: 3, families: 90 },
    ];

    const clubbed = clubAuxiliaryBooths(rawBooths);
    assert.strictEqual(clubbed.length, 3, 'Should consolidate 4 records into 3');

    const booth22 = clubbed.find(b => b.part_no === 22);
    assert.ok(booth22, 'Booth 22 should exist');
    assert.strictEqual(booth22.voters, 1340, 'Voters should sum 700 + 640');
    assert.strictEqual(booth22.added, 38, 'Added should sum 20 + 18');
    assert.strictEqual(booth22.deleted, 24, 'Deleted should sum 10 + 14');
    assert.strictEqual(booth22.families_count, 298, 'Families should sum 150 + 148');
    assert.strictEqual(booth22.is_clubbed, true, 'is_clubbed flag should be true');
    assert.deepStrictEqual(booth22.original_parts, ['22', '22A']);
  });

  test('clubAuxiliaryBooths should preserve is_clubbed flag if already set in source data', () => {
    const preClubbed = [
      { part_no: '22', station_name: 'School 22', voters: 1340, is_clubbed: true, original_parts: ['22', '22A'] },
      { part_no: '23', station_name: 'School 23', voters: 500, is_clubbed: false }
    ];
    const result = clubAuxiliaryBooths(preClubbed);
    assert.strictEqual(result.length, 2);
    const b22 = result.find(b => b.part_no === 22);
    assert.strictEqual(b22.is_clubbed, true, 'is_clubbed flag must not be overwritten to false');
  });

  test('tagHouseholdCluster should detect Wada Compound Clusters and sanitize members', () => {
    const wadaCompound = tagHouseholdCluster({ 
      house_no: '01', 
      members_count: 25,
      members: [
        { name: 'Ramesh Naik', phone: '9876543210', mobile: '9988776655' }
      ]
    });
    assert.strictEqual(wadaCompound.isWadaCompound, true);
    assert.strictEqual(wadaCompound.clusterTag, 'Wada Compound Cluster');
    assert.strictEqual(wadaCompound.members[0].phone, undefined, 'Private phone numbers must be sanitized');
    assert.strictEqual(wadaCompound.members[0].mobile, undefined, 'Private mobile numbers must be sanitized');

    const jointFamily = tagHouseholdCluster({ house_no: '15', members_count: 24 });
    assert.strictEqual(jointFamily.isWadaCompound, false);
    assert.strictEqual(jointFamily.clusterTag, 'Joint Family Unit');

    // Edge case: numeric house_no
    const numericHouse = tagHouseholdCluster({ house_no: 102, members_count: 4 });
    assert.strictEqual(numericHouse.isWadaCompound, false);
    assert.strictEqual(numericHouse.clusterTag, 'Nuclear Household');
  });

  test('sanitizeVoterRecord should remove personal mobile/phone numbers for privacy', () => {
    const dirty = {
      name: 'John Doe',
      epic: 'XYZ123',
      phone: '9876543210',
      mobile: '+919876543210',
      phone_number: '0832-224455',
      contact: '9999999999',
      aadhaar: '1234-5678-9012'
    };
    const clean = sanitizeVoterRecord(dirty);
    assert.strictEqual(clean.name, 'John Doe');
    assert.strictEqual(clean.epic, 'XYZ123');
    assert.strictEqual(clean.phone, undefined);
    assert.strictEqual(clean.mobile, undefined);
    assert.strictEqual(clean.phone_number, undefined);
    assert.strictEqual(clean.contact, undefined);
    assert.strictEqual(clean.aadhaar, undefined);
  });

});

describe('Party Theming & Margins', () => {
  test('getPartyTheme should return brand colors for BJP and INC', () => {
    const bjp = getPartyTheme('BJP');
    assert.strictEqual(bjp.color, '#FF9933');
    assert.strictEqual(bjp.symbol, 'Lotus');

    const inc = getPartyTheme('INC');
    assert.strictEqual(inc.color, '#1982C4');
    assert.strictEqual(inc.symbol, 'Hand');

    const unknown = getPartyTheme('XYZ_UNKNOWN');
    assert.strictEqual(unknown.symbol, 'Others');
  });

  test('getMarginCategory should classify Safe, Battleground, Weak', () => {
    assert.strictEqual(getMarginCategory(15.5).label, 'Safe');
    assert.strictEqual(getMarginCategory(10.0).label, 'Safe');
    assert.strictEqual(getMarginCategory(5.2).label, 'Battleground');
    assert.strictEqual(getMarginCategory(-5.0).label, 'Battleground');
    assert.strictEqual(getMarginCategory(-12.4).label, 'Weak');
  });
});

describe('Constituency Static Datasets Verification', () => {
  const publicDir = path.resolve('public/data');

  test('directory.json should contain valid constituencies including AC09, AC10, AC17', () => {
    const dirRaw = fs.readFileSync(path.join(publicDir, 'directory.json'), 'utf-8');
    const dir = JSON.parse(dirRaw);
    assert.ok(dir.parliamentary_constituencies.length > 0);
    const acs = dir.parliamentary_constituencies[0].assembly_constituencies;
    assert.strictEqual(acs.length, 3);

    const slugs = acs.map(a => a.slug);
    assert.ok(slugs.includes('ac09-porvorim'));
    assert.ok(slugs.includes('ac10-aldona'));
    assert.ok(slugs.includes('ac17-sanquelim'));
  });

  test('AC17 Sanquelim dataset conforms to authoritative figures', () => {
    const raw = fs.readFileSync(path.join(publicDir, 'ac17-sanquelim.json'), 'utf-8');
    const data = JSON.parse(raw);

    assert.strictEqual(data.meta.ac_no, 17);
    assert.strictEqual(data.meta.ac_name, 'Sanquelim');
    assert.strictEqual(data.meta.total_voters, 27265);
    assert.strictEqual(data.meta.total_booths, 50);
    assert.strictEqual(data.meta.total_families, 6041);
    assert.strictEqual(data.demographics.gender.sex_ratio, 1042);
    assert.strictEqual(data.leaders.mla.name, 'Dr. Pramod Sawant');
    assert.strictEqual(data.leaders.mla.party, 'BJP');
    assert.strictEqual(data.leaders.mla.vote_pct, 48.27);
    assert.strictEqual(data.leaders.mp.name, 'Shripad Yesso Naik');
    assert.strictEqual(data.spatial.viewBox, '0 0 1186 920');
    assert.strictEqual(data.spatial.villages.length, 9);
    assert.strictEqual(data.survey.has_data, true);
    assert.strictEqual(data.survey.total_calls, 5450);
  });

  test('AC09 Porvorim dataset conforms to specifications', () => {
    const raw = fs.readFileSync(path.join(publicDir, 'ac09-porvorim.json'), 'utf-8');
    const data = JSON.parse(raw);

    assert.strictEqual(data.meta.ac_no, 9);
    assert.strictEqual(data.meta.ac_name, 'Porvorim');
    assert.strictEqual(data.meta.total_voters, 23947);
    assert.strictEqual(data.meta.total_booths, 39);
    assert.strictEqual(data.leaders.mla.name, 'Rohan Khaunte');
    assert.strictEqual(data.spatial.viewBox, '0 0 1186 1220');
    assert.strictEqual(data.survey.has_data, true);
  });

  test('AC10 Aldona dataset conforms to specifications and gracefully handles missing survey', () => {
    const raw = fs.readFileSync(path.join(publicDir, 'ac10-aldona.json'), 'utf-8');
    const data = JSON.parse(raw);

    assert.strictEqual(data.meta.ac_no, 10);
    assert.strictEqual(data.meta.ac_name, 'Aldona');
    assert.ok(data.meta.total_voters === 25281 || data.meta.total_voters === 25541);
    assert.strictEqual(data.meta.total_booths, 41);
    assert.strictEqual(data.leaders.mla.party, 'INC');
    assert.strictEqual(data.spatial.viewBox, '0 0 1186 760');
    // Critical: Survey pending state verified!
    assert.strictEqual(data.survey.has_data, false);
    assert.strictEqual(data.survey.status, 'pending');
  });

  test('All constituencies contain verified ASDDO statutory audit structures', () => {
    ['ac09-porvorim.json', 'ac10-aldona.json', 'ac17-sanquelim.json'].forEach((filename) => {
      const raw = fs.readFileSync(path.join(publicDir, filename), 'utf-8');
      const data = JSON.parse(raw);
      assert.ok(data.asddo, `${filename} should have asddo audit block`);
      const { absent, shifted, dead, duplicate, others, total } = data.asddo;
      assert.strictEqual(typeof absent, 'number');
      assert.strictEqual(typeof shifted, 'number');
      assert.strictEqual(typeof dead, 'number');
      assert.strictEqual(typeof duplicate, 'number');
      assert.strictEqual(typeof others, 'number');
      assert.strictEqual(typeof total, 'number');
      assert.strictEqual(absent + shifted + dead + duplicate + others, total, `${filename} ASDDO sum must equal total`);
      assert.strictEqual(total, data.meta.sir_deleted, `${filename} ASDDO total must equal meta.sir_deleted`);
    });
  });

});
