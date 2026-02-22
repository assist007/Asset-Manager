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

// ── Reference-based Hijri calculation ──────────────────────────────────────
// Anchored to: 1 Ramadan 1447 AH = 19 February 2026 (Bangladesh)
// Uses standard tabular Islamic calendar month lengths from this known point.

const HIJRI_REF_GREGORIAN = new Date(2026, 1, 19); // Feb 19 2026, local midnight

function hijriIsLeap(year: number): boolean {
  return [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(year % 30);
}

function hijriMonthDays(year: number, month: number): number {
  if (month % 2 === 1) return 30;
  if (month === 12) return hijriIsLeap(year) ? 30 : 29;
  return 29;
}

export function gregorianToHijri(date: Date): HijriDate {
  const ref = new Date(HIJRI_REF_GREGORIAN);
  ref.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - ref.getTime()) / 86_400_000);

  let year = 1447, month = 9, day = 1;

  if (diff >= 0) {
    let rem = diff;
    while (rem > 0) {
      const left = hijriMonthDays(year, month) - day + 1;
      if (rem < left) { day += rem; rem = 0; }
      else { rem -= left; day = 1; month++; if (month > 12) { month = 1; year++; } }
    }
  } else {
    let rem = -diff;
    while (rem > 0) {
      rem--; day--;
      if (day < 1) {
        month--; if (month < 1) { month = 12; year--; }
        day = hijriMonthDays(year, month);
      }
    }
  }

  return {
    year, month, day,
    monthName:   HIJRI_MONTHS_EN[month - 1] ?? "",
    monthNameBn: HIJRI_MONTHS_BN[month - 1] ?? "",
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
