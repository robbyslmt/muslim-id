# SholatKu — Design Document

**Date:** 2026-04-01
**Status:** Approved

## Overview

SholatKu is a glassmorphic dark-themed Progressive Web App (PWA) for Indonesian Muslims. It provides accurate Kemenag prayer times, Qibla compass, Quran reader with Indonesian translation, curated Doa/Dzikir collection, Tasbih counter, Zakat calculator, and Hijri calendar. Fully installable, works offline for core features.

## Technical Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **PWA:** next-pwa / Workbox Service Worker
- **APIs:** Aladhan API (prayer times, method=20 Kemenag), EQuran.id (Quran data)
- **Hosting:** Vercel (zero backend)

## Architecture

API-First approach — all data fetched client-side, cached via Service Worker + localStorage. No custom backend.

```
Pages (App Router)
  → Custom Hooks (usePrayer, useQuran, useQibla)
    → Service Layer (prayerService, quranService, doaService, hijriService)
      → Cache Layer (Service Worker + localStorage)
        → External APIs (Aladhan, EQuran.id, Browser Geolocation, Device Orientation)

Static JSON (bundled):
  • doa-dzikir.json
  • indonesian-cities.json
  • islamic-dates.json
  • adzan-metadata.json
```

## Pages & Navigation

Bottom tab navigation with 5 tabs:

### 1. Sholat (Home) — `/`
- 6 prayer time cards (Imsak, Subuh, Dzuhur, Ashar, Maghrib, Isya)
- Current/next prayer highlighted with glow effect
- Circular countdown ring to next prayer
- Quick Adzan audio button (different audio for Subuh)
- Location badge with city name
- Hijri + Gregorian date header

### 2. Kiblat — `/kiblat`
- Full-screen compass with animated needle pointing to Qibla
- Degree readout display
- Calibration prompt for magnetometer
- Fallback to static degree + Google Maps link

### 3. Quran — `/quran`
- 114 surah list with Arabic + Latin name, ayat count, revelation type
- Surah detail: ayat-by-ayat Arabic text + Indonesian translation
- Search by surah name or keyword

### 4. Doa — `/doa`
- Category grid: Dzikir Pagi, Dzikir Sore, Doa Setelah Sholat, Ruqyah, Doa Harian
- Doa cards with Arabic, Latin transliteration, Indonesian translation, source

### 5. Lainnya — `/lainnya`
- Tasbih counter (0-9999, haptic feedback, presets for 33/99/100)
- Zakat calculator (Maal + Fitrah, no persistence)
- Hijri calendar with important dates highlighted
- Settings: city picker, manual coordinates, about

## Design System

### Colors
- Background: near-black `hsl(220, 20%, 8%)`
- Cards: frosted glass `hsla(180, 15%, 12%, 0.6)` with `backdrop-filter: blur(20px)`
- Accent: vibrant teal `hsl(160, 70%, 45%)` with glow variant
- Gold highlights: `hsl(45, 80%, 60%)` for Hijri dates
- Arabic text: warm white `hsl(45, 30%, 90%)`

### Typography
- UI/Headings: Plus Jakarta Sans
- Arabic: Amiri or Scheherazade New
- Numbers/Countdown: JetBrains Mono

### Animations
- Prayer countdown: SVG stroke-dashoffset with pulse at < 5 min
- Next prayer card: breathing glow (3s ease-in-out)
- Qibla compass: spring physics rotation
- Tasbih: scale bounce on tap
- Page transitions: fade + upward slide (200ms)

### Layout
- Mobile-first (360px base)
- Tablet (768px): 2-column grids
- Desktop (1024px+): centered 480px container

## Data Sources

| Data | Source | Cache Duration |
|------|--------|---------------|
| Prayer Times | Aladhan API (method=20) | 24h (monthly pre-fetch) |
| Quran | EQuran.id API | Forever (per surah) |
| Qibla | Aladhan API | Forever (per location) |
| Doa/Dzikir | Static JSON | Bundled |
| Cities | Static JSON | Bundled |
| Islamic Dates | Static JSON | Bundled |

## Caching (3-tier)

1. **Service Worker:** App shell, static JSON, Adzan audio, API responses
2. **localStorage:** User location, preferences, tasbih counter, last-read Quran position
3. **Runtime Memory:** Current calculations, active Quran content, compass heading

## Error Handling

- **No geolocation:** City picker modal fallback
- **API failure:** Serve cached data + subtle banner
- **No magnetometer:** Static Qibla degree + Maps link
- **iOS orientation permission:** Explicit "Aktifkan Kompas" button
- **Tasbih reset:** Confirmation dialog
- **Zakat validation:** Reject invalid input, Rupiah formatting with dot separators
- **Nisab default:** ~Rp 85.000.000 with note to verify with local ulama

## Testing Strategy

### Unit Tests (Vitest)
- Prayer time parsing, next-prayer detection, countdown calculation
- Zakat calculation (Maal 2.5% above nisab, Fitrah per person)
- Hijri date formatting, important date detection
- Qibla bearing calculation
- Cache hit/miss/expiry logic

### Integration Tests
- Prayer time accuracy for 6 Indonesian cities (±1 min vs Kemenag)
- Quran data integrity (114 surahs, correct ayat counts)
- Offline fallback behavior
- Geolocation flow (grant → detect, deny → picker)

### Verification Cities
Jakarta, Surabaya, Makassar, Jayapura, Banda Aceh, Denpasar — spanning WIB/WITA/WIT timezones.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Prayer method | Kemenag only | Safe default for ~90% Indonesian Muslims |
| Quran scope | Browse & Read | Lean v1, audio in v2 |
| Adzan | In-app audio only | Reliable without backend |
| Offline | Full PWA | Native-app feel on Android |
| Visual | Glassmorphic Dark | Premium, modern, practical for night prayers |
| Zakat | Simple calculator | No persistence needed for v1 |
| Backend | None (API-first) | Zero cost, fast to build |
