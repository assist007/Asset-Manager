import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes, Madhab } from "adhan";

export interface CityCoords {
  id: string;
  lat: number;
  lon: number;
}

export const cityCoords: Record<string, CityCoords> = {
  dhaka:       { id: "dhaka",       lat: 23.8103, lon: 90.4125 },
  chittagong:  { id: "chittagong",  lat: 22.3569, lon: 91.7832 },
  sylhet:      { id: "sylhet",      lat: 24.8949, lon: 91.8687 },
  rajshahi:    { id: "rajshahi",    lat: 24.3745, lon: 88.6042 },
  khulna:      { id: "khulna",      lat: 22.8456, lon: 89.5403 },
  barisal:     { id: "barisal",     lat: 22.7010, lon: 90.3535 },
  rangpur:     { id: "rangpur",     lat: 25.7439, lon: 89.2752 },
  mymensingh:  { id: "mymensingh",  lat: 24.7471, lon: 90.4203 },
  comilla:     { id: "comilla",     lat: 23.4607, lon: 91.1809 },
  narayanganj: { id: "narayanganj", lat: 23.6238, lon: 90.5000 },
};

export interface CalculatedTimes {
  fajr:    Date;
  sunrise: Date;
  dhuhr:   Date;
  asr:     Date;
  maghrib: Date;
  isha:    Date;
  sehri:   Date;
  iftar:   Date;
}

export function calculatePrayerTimes(
  cityId: string,
  date: Date,
  overrideLat?: number | null,
  overrideLon?: number | null,
): CalculatedTimes {
  let lat: number, lon: number;
  if (overrideLat != null && overrideLon != null) {
    lat = overrideLat;
    lon = overrideLon;
  } else {
    const c = cityCoords[cityId] ?? cityCoords.dhaka;
    lat = c.lat;
    lon = c.lon;
  }
  const coordinates = new Coordinates(lat, lon);

  // Bangladesh Islamic Foundation uses Fajr 19.5°, Isha 17.5°
  const params = CalculationMethod.Karachi();
  params.fajrAngle = 19.5;
  params.ishaAngle = 17.5;
  params.madhab = Madhab.Hanafi;

  const pt = new PrayerTimes(coordinates, date, params);

  // In Bangladesh, sehri officially ends AT Fajr time (no offset)
  return {
    fajr:    pt.fajr,
    sunrise: pt.sunrise,
    dhuhr:   pt.dhuhr,
    asr:     pt.asr,
    maghrib: pt.maghrib,
    isha:    pt.isha,
    sehri:   pt.fajr,
    iftar:   pt.maghrib,
  };
}

export function formatTime(date: Date, lang: "bn" | "en" = "bn"): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = String(m).padStart(2, "0");
  const ampm = h < 12 ? (lang === "bn" ? "ভোর " : "") : h < 17 ? (lang === "bn" ? "দুপুর " : "") : h < 20 ? (lang === "bn" ? "সন্ধ্যা " : "") : (lang === "bn" ? "রাত " : "");

  const timeStr = `${h12}:${mm}`;
  if (lang === "bn") {
    const bn = timeStr.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
    return `${ampm}${bn}`;
  }
  return `${h12}:${mm} ${h < 12 ? "AM" : "PM"}`;
}

export function formatTimeShort(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = String(m).padStart(2, "0");
  return `${h12}:${mm}`;
}

export function formatCountdown(totalSeconds: number, lang: "bn" | "en"): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const raw = `${pad(h)}:${pad(m)}:${pad(s)}`;
  if (lang === "bn") return raw.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  return raw;
}
