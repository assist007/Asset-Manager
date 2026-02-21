# Islamic App — Bangladesh (Ramadan Focus)

## Overview
A comprehensive frontend-only Islamic app for Bangladesh with Ramadan focus. Bengali-first interface with complete offline support via localStorage.

## Architecture
- **Frontend**: React + TypeScript + Vite + TailwindCSS + ShadCN
- **Backend**: Express (minimal — no DB; all data in localStorage)
- **Prayer Times**: `adhan` npm library (Karachi method, Hanafi madhab) — fully real-time
- **Routing**: Wouter
- **State**: React Context (AppContext)

## Key Features
- Live prayer countdown clock (updates every second via requestAnimationFrame)
- Real prayer time calculation from GPS coordinates (adhan library)
- 10 Bangladesh cities with exact coordinates
- Bengali/English dual-language (Noto Sans Bengali, Noto Naskh Arabic)
- Dark mode, Senior Mode, font size controls
- Offline-first: localStorage for all preferences, bookmarks, amal checklist
- Ramadan-focused dashboard: sehri/iftar times auto-calculated from Fajr/Maghrib

## Pages
| Route | Page |
|---|---|
| `/` | Dashboard (Ramadan card, prayer clock, amal checklist) |
| `/prayer` | Prayer Times (full daily schedule, next prayer highlight) |
| `/quran` | Quran Reader |
| `/dua` | Dua Library |
| `/zakat` | Zakat Calculator |
| `/settings` | Settings (city, language, theme, senior mode) |

## Key Files
- `client/src/lib/prayerUtils.ts` — adhan-based prayer time calculation, formatters
- `client/src/hooks/usePrayerTimes.ts` — real-time hook (updates every second)
- `client/src/components/PrayerClock.tsx` — SVG arc countdown clock
- `client/src/contexts/AppContext.tsx` — global state + localStorage persistence
- `client/src/lib/mockData.ts` — Quran surahs, duas, amal items, cities list
- `client/src/pages/Dashboard.tsx` — main homepage

## Design Decisions
- Green gradient header: `hsl(158 65% 18%)` → `hsl(195 45% 20%)`
- Karachi calculation method (standard for Bangladesh)
- Sehri = Fajr − 10 minutes; Iftar = Maghrib
- Mobile-first max-w-md container with bottom tab navigation
- Senior Mode increases all font sizes and touch targets

## Running
`npm run dev` — starts Express + Vite on port 5000
