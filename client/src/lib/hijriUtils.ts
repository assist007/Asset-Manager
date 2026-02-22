export interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  monthNameBn: string;
}

const HIJRI_MONTHS_EN = [
  "Muharram","Safar","Rabi Al-Awwal","Rabi Al-Thani",
  "Jumada Al-Awwal","Jumada Al-Thani","Rajab","Sha'ban",
  "Ramadan","Shawwal","Dhul Qi'dah","Dhul Hijjah",
];

const HIJRI_MONTHS_BN = [
  "মুহাররম","সফর","রবিউল আউয়াল","রবিউস সানি",
  "জুমাদাল আউয়াল","জুমাদাস সানি","রজব","শাবান",
  "রমজান","শাওয়াল","জিলকদ","জিলহজ",
];

// Gregorian → Julian Day Number
function gregorianToJD(y: number, m: number, d: number): number {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

// Julian Day Number → Hijri
function jdToHijri(jd: number): { year: number; month: number; day: number } {
  const z = Math.floor(jd + 0.5);
  const a = z;
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const dd = Math.floor(365.25 * c);
  const e = Math.floor((b - dd) / 30.6001);

  // Simplified Gregorian → Hijri via epoch offset
  // Hijri epoch: JD 1948438.5 (1 Muharram 1 AH = July 16, 622 CE Julian)
  const HIJRI_EPOCH = 1948438.5;
  const n = Math.floor(jd) - Math.floor(HIJRI_EPOCH) + 1;

  // 30-year Tabular Islamic calendar cycle (Kūfī rules)
  const cycle = Math.floor((n - 1) / 10631);
  const remaining = n - cycle * 10631;

  let year = cycle * 30;
  // Within the 30-year cycle
  const yearInCycle = [0, 354, 709, 1063, 1418, 1772, 2127, 2481, 2836, 3191,
    3545, 3900, 4254, 4609, 4963, 5318, 5672, 6027, 6381, 6736,
    7090, 7445, 7799, 8154, 8509, 8863, 9218, 9572, 9927, 10281, 10636];

  let y = 0;
  for (let i = 30; i >= 1; i--) {
    if (remaining > yearInCycle[i - 1]) { y = i; break; }
  }
  year += y;

  const dayOfYear = remaining - yearInCycle[y - 1];
  const MONTH_LENGTHS = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  // Add extra day for leap year (years 2,5,7,10,13,16,18,21,24,26,29 in cycle)
  const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
  if (leapYears.includes(y)) MONTH_LENGTHS[11] = 30;

  let month = 0;
  let cumulative = 0;
  for (let i = 0; i < 12; i++) {
    if (dayOfYear <= cumulative + MONTH_LENGTHS[i]) {
      month = i + 1;
      break;
    }
    cumulative += MONTH_LENGTHS[i];
  }
  const day = dayOfYear - cumulative;

  return { year, month, day };
}

export function gregorianToHijri(date: Date): HijriDate {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const jd = gregorianToJD(y, m, d);
  const h = jdToHijri(jd);
  return {
    ...h,
    monthName: HIJRI_MONTHS_EN[h.month - 1] ?? "",
    monthNameBn: HIJRI_MONTHS_BN[h.month - 1] ?? "",
  };
}

export function toBnDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
}

export const HIJRI_MONTHS_EN_ALL = HIJRI_MONTHS_EN;
export const HIJRI_MONTHS_BN_ALL = HIJRI_MONTHS_BN;

// ── Bangla (Bangabda) Calendar ──────────────────────────────────────────────
// Bangladesh Bangla Academy revised calendar (1987)
// Month 1–5 have 31 days, Month 6–12 have 30 days (Falgun=31 in leap Bangla year)
// 1 Baishakh = 14 April every year

const BANGLA_MONTHS = [
  "বৈশাখ","জ্যৈষ্ঠ","আষাঢ়","শ্রাবণ","ভাদ্র",
  "আশ্বিন","কার্তিক","অগ্রহায়ণ","পৌষ","মাঘ","ফাল্গুন","চৈত্র",
];

// Month start [gregorianMonth (1-12), gregorianDay] relative to:
//   months 1-9  → Gregorian year G  (where G = banglaYear + 593)
//   months 10-12 → Gregorian year G+1
const BANGLA_MONTH_STARTS: [number, number, number][] = [
  // [month(1-12), day, yearOffset(0=G, 1=G+1)]
  [4, 14, 0],   // বৈশাখ
  [5, 15, 0],   // জ্যৈষ্ঠ
  [6, 15, 0],   // আষাঢ়
  [7, 16, 0],   // শ্রাবণ
  [8, 16, 0],   // ভাদ্র
  [9, 16, 0],   // আশ্বিন
  [10, 16, 0],  // কার্তিক
  [11, 15, 0],  // অগ্রহায়ণ
  [12, 15, 0],  // পৌষ
  [1, 14, 1],   // মাঘ
  [2, 14, 1],   // ফাল্গুন
  [3, 15, 1],   // চৈত্র
];

function bnOrdinalSuffix(day: number): string {
  if (day === 1) return "লা";
  if (day === 2 || day === 3) return "রা";
  if (day === 4) return "ঠা";
  if (day >= 5 && day <= 18) return "ই";
  return "শে";
}

export interface BanglaDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  formatted: string; // e.g. "৯ই ফাল্গুন, ১৪৩২"
}

export function gregorianToBangla(date: Date): BanglaDate {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  // Determine Bangla year: starts April 14
  const banglaYear = (gm > 4 || (gm === 4 && gd >= 14)) ? gy - 593 : gy - 594;
  const G = banglaYear + 593; // Gregorian year in which Baishakh begins

  // Build Date objects for each month start
  const starts = BANGLA_MONTH_STARTS.map(([m, d, yOff]) =>
    new Date(G + yOff, m - 1, d)
  );

  // Add sentinel: start of next Baishakh
  starts.push(new Date(G + 1, 3, 14));

  const target = new Date(gy, gm - 1, gd);

  let banglaMonth = 0;
  let banglaDay = 1;

  for (let i = 0; i < 12; i++) {
    const s = starts[i];
    const next = starts[i + 1];
    if (target >= s && target < next) {
      banglaMonth = i + 1;
      banglaDay = Math.round((target.getTime() - s.getTime()) / 86400000) + 1;
      break;
    }
  }

  const suffix = bnOrdinalSuffix(banglaDay);
  const formatted = `${toBnDigits(banglaDay)}${suffix} ${BANGLA_MONTHS[banglaMonth - 1]}, ${toBnDigits(banglaYear)}`;

  return { year: banglaYear, month: banglaMonth, day: banglaDay, monthName: BANGLA_MONTHS[banglaMonth - 1], formatted };
}
