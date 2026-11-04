/**
 * Resilient Data Normalization and Anomaly Filtering
 * Prevents NaN%, null%, undefined%, handles auxiliary booths, 
 * standardizes gender/age cohorts, and clusters household units.
 */

/**
 * Safe division that guarantees a finite number output
 * @param {number} numerator 
 * @param {number} denominator 
 * @param {number} fallback 
 * @returns {number}
 */
export function safeDivide(numerator, denominator, fallback = 0) {
  const num = Number(numerator);
  const den = Number(denominator);
  if (!isFinite(num) || !isFinite(den) || den === 0) return fallback;
  return num / den;
}

/**
 * Safe percentage calculation returning number (e.g. 52.4)
 * @param {number} numerator 
 * @param {number} denominator 
 * @param {number} decimals 
 * @returns {number}
 */
export function safePercentage(numerator, denominator, decimals = 1) {
  const ratio = safeDivide(numerator, denominator, 0);
  const factor = Math.pow(10, decimals);
  return Math.round(ratio * 100 * factor) / factor;
}

/**
 * Standardize Gender to Male, Female, Third Gender, or Unknown
 * @param {string|null} raw 
 * @returns {'Male'|'Female'|'Third Gender'|'Unknown'}
 */
export function normalizeGender(raw) {
  if (!raw) return 'Unknown';
  const str = String(raw).trim().toLowerCase();
  if (str === 'male' || str === 'm' || str === 'purush') return 'Male';
  if (str === 'female' || str === 'f' || str === 'mahila' || str === 'stri') return 'Female';
  if (str.includes('third') || str === 'tg' || str === 'other' || str === 't') return 'Third Gender';
  return 'Unknown';
}

/**
 * Compute Sex Ratio (Females per 1,000 Males)
 * @param {number} maleCount 
 * @param {number} femaleCount 
 * @returns {number}
 */
export function computeSexRatio(maleCount, femaleCount) {
  const males = Number(maleCount) || 0;
  const females = Number(femaleCount) || 0;
  if (males <= 0) return 0;
  return Math.round((females / males) * 1000);
}

/**
 * Auxiliary Polling Station Aggregator (Booth 22 + 22A => Booth 22)
 * Consolidates auxiliary stations into their parent booth for 1:1 map polygon matching.
 * @param {Array} booths 
 * @returns {Array} consolidated booths list
 */
export function clubAuxiliaryBooths(booths = []) {
  if (!Array.isArray(booths)) return [];

  const boothMap = new Map();

  booths.forEach(booth => {
    // Extract base booth number (e.g., "22A" -> 22, "22" -> 22, "14/1" -> 14)
    const rawNo = String(booth.part_no || '').trim();
    const match = rawNo.match(/^(\d+)/);
    const parentNo = match ? parseInt(match[1], 10) : rawNo;
    const isAuxiliary = rawNo !== String(parentNo);

    if (!boothMap.has(parentNo)) {
      boothMap.set(parentNo, {
        ...booth,
        part_no: parentNo,
        original_parts: Array.isArray(booth.original_parts) ? [...booth.original_parts] : [rawNo],
        station_name: booth.station_name,
        voters: Number(booth.voters || booth.voter_count || 0),
        added: Number(booth.added || booth.added_count || 0),
        deleted: Number(booth.deleted || booth.deleted_count || 0),
        families_count: Number(booth.families_count || booth.families || 0),
        is_clubbed: Boolean(booth.is_clubbed) || isAuxiliary,
      });
    } else {
      const existing = boothMap.get(parentNo);
      if (!existing.original_parts.includes(rawNo)) {
        existing.original_parts.push(rawNo);
      }
      existing.voters += Number(booth.voters || booth.voter_count || 0);
      existing.added += Number(booth.added || booth.added_count || 0);
      existing.deleted += Number(booth.deleted || booth.deleted_count || 0);
      existing.families_count += Number(booth.families_count || booth.families || 0);
      existing.is_clubbed = true;
      if (!existing.station_name.includes(booth.station_name)) {
        existing.station_name = `${existing.station_name} + ${booth.station_name}`;
      }
    }
  });

  return Array.from(boothMap.values()).sort((a, b) => {
    const numA = typeof a.part_no === 'number' ? a.part_no : parseInt(a.part_no, 10) || 0;
    const numB = typeof b.part_no === 'number' ? b.part_no : parseInt(b.part_no, 10) || 0;
    return numA - numB;
  });
}

/**
 * Standard Age Cohort Normalization (18-24 to 75+)
 * Ensures valid cohorts sum to 100% of analyzed records.
 */
export const STANDARD_AGE_COHORTS = ['18-24', '25-34', '35-44', '45-54', '55-64', '65-74', '75+'];

export function normalizeAgeDistribution(cohorts = {}, totalElectors = 0) {
  let validSum = 0;
  const result = [];

  STANDARD_AGE_COHORTS.forEach(key => {
    const count = Number(cohorts[key]?.count ?? cohorts[key] ?? 0);
    validSum += count;
  });

  const denominator = validSum > 0 ? validSum : totalElectors;

  STANDARD_AGE_COHORTS.forEach(key => {
    const count = Number(cohorts[key]?.count ?? cohorts[key] ?? 0);
    const male = Number(cohorts[key]?.male ?? 0);
    const female = Number(cohorts[key]?.female ?? 0);
    const pct = safePercentage(count, denominator);
    result.push({
      cohort: key,
      count,
      male,
      female,
      pct,
    });
  });

  return { cohorts: result, totalAnalyzed: validSum };
}

/**
 * Privacy Sanitizer: Strips personal private identifiers (phone numbers, national IDs)
 * @param {Object} voter 
 */
export function sanitizeVoterRecord(voter) {
  if (!voter || typeof voter !== 'object') return voter;
  const sanitized = { ...voter };
  delete sanitized.phone;
  delete sanitized.phone_number;
  delete sanitized.mobile;
  delete sanitized.mobile_no;
  delete sanitized.contact;
  delete sanitized.tel;
  delete sanitized.aadhaar;
  delete sanitized.ssn;
  return sanitized;
}

/**
 * Household Cluster Tagging
 * If a family has generic village house number ("0" or "01") and 15+ members,
 * tag it as "Wada Compound Cluster". Also strips private member contact data.
 */
export function tagHouseholdCluster(cluster) {
  if (!cluster || typeof cluster !== 'object') return cluster;
  const houseNo = String(cluster.house_no ?? '').trim();
  const membersCount = Number(cluster.members_count || cluster.members?.length || 0);
  const isGenericHouse = /^0+$/.test(houseNo) || houseNo === '01' || houseNo === '0/0' || houseNo === '0-0';
  const isWadaCompound = isGenericHouse && membersCount >= 15;
  const sanitizedMembers = Array.isArray(cluster.members)
    ? cluster.members.map(sanitizeVoterRecord)
    : cluster.members;

  return {
    ...cluster,
    members: sanitizedMembers,
    members_count: membersCount,
    isWadaCompound,
    clusterTag: isWadaCompound 
      ? 'Wada Compound Cluster' 
      : (membersCount >= 10 ? 'Joint Family Unit' : 'Nuclear Household'),
  };
}
