/**
 * Electoral Dashboard Formatting Utilities
 * Standardized for Indian numbering system (en-IN) and political visualization standards.
 */

/**
 * Format numbers into Indian numbering system (e.g. 27,265 or 2,57,326)
 * @param {number|string|null} val 
 * @returns {string}
 */
export function formatIndianNumber(val) {
  if (val === null || val === undefined || val === '') return '0';
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-IN');
}

/**
 * Safe percentage formatter that guarantees no "NaN%", "undefined%", or "null%"
 * Handles numbers, numeric strings, and strings already containing '%' (e.g. "66.1%")
 * @param {number|string|null} val 
 * @param {number} decimals 
 * @returns {string} e.g. "48.3%" or "0.0%"
 */
export function formatPercentage(val, decimals = 1) {
  if (val === null || val === undefined || val === '') return '0.0%';
  const cleaned = typeof val === 'string' ? val.replace('%', '').trim() : val;
  const num = typeof cleaned === 'number' ? cleaned : Number(cleaned);
  if (isNaN(num) || !isFinite(num)) return '0.0%';
  return `${num.toFixed(decimals)}%`;
}

/**
 * Format margin with leading sign (+ / -)
 * Handles numbers, numeric strings, and strings already containing '+' or '%' (e.g. "+37.4%")
 * @param {number|string|null} val 
 * @param {number} decimals 
 * @returns {string} e.g. "+37.4%" or "-2.6%"
 */
export function formatMargin(val, decimals = 1) {
  if (val === null || val === undefined || val === '') return '0.0%';
  const cleaned = typeof val === 'string' ? val.replace('%', '').replace('+', '').trim() : val;
  const num = typeof cleaned === 'number' ? cleaned : Number(cleaned);
  if (isNaN(num) || !isFinite(num)) return '0.0%';
  const prefix = num > 0 ? '+' : '';
  return `${prefix}${num.toFixed(decimals)}%`;
}

/**
 * Standard Party Color Tokens and Branding
 */
export const PARTY_THEMES = {
  BJP: {
    name: 'Bharatiya Janata Party',
    color: '#FF9933',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    barColor: '#FF9933',
    symbol: 'Lotus',
  },
  INC: {
    name: 'Indian National Congress',
    color: '#1982C4',
    textColor: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
    barColor: '#1982C4',
    symbol: 'Hand',
  },
  AAP: {
    name: 'Aam Aadmi Party',
    color: '#0072B0',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    barColor: '#0072B0',
    symbol: 'Broom',
  },
  MGP: {
    name: 'Maharashtrawadi Gomantak Party',
    color: '#16A34A',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    barColor: '#16A34A',
    symbol: 'Lion',
  },
  RGP: {
    name: 'Revolutionary Goans Party',
    color: '#7C3AED',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    barColor: '#7C3AED',
    symbol: 'Football',
  },
  GFP: {
    name: 'Goa Forward Party',
    color: '#059669',
    textColor: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-300',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
    barColor: '#059669',
    symbol: 'Coconut',
  },
  AITC: {
    name: 'All India Trinamool Congress',
    color: '#22C55E',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    badgeClass: 'bg-green-100 text-green-800 border-green-300',
    barColor: '#22C55E',
    symbol: 'Flowers',
  },
  IND: {
    name: 'Independent',
    color: '#64748B',
    textColor: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    barColor: '#64748B',
    symbol: 'Independent',
  },
  Others: {
    name: 'Other Parties / Candidates',
    color: '#94A3B8',
    textColor: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    barColor: '#94A3B8',
    symbol: 'Others',
  }
};

/**
 * Get party visual theme with robust fallback
 * @param {string} partyCode 
 */
export function getPartyTheme(partyCode) {
  if (!partyCode) return PARTY_THEMES.Others;
  const upper = partyCode.trim().toUpperCase();
  return PARTY_THEMES[upper] || PARTY_THEMES.Others;
}

/**
 * Get electoral status badge for margin
 * @param {number} marginVal 
 */
export function getMarginCategory(marginVal) {
  const num = Number(marginVal) || 0;
  if (num >= 10.0) {
    return {
      label: 'Safe',
      color: '#16A34A',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Lead margin ≥ +10%'
    };
  }
  if (num <= -10.0) {
    return {
      label: 'Weak',
      color: '#DC2626',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      description: 'Trailing margin ≤ -10%'
    };
  }
  return {
    label: 'Battleground',
    color: '#EAB308',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Competitive (-10% to +10%)'
  };
}
