# SholatKu Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build SholatKu — a glassmorphic dark PWA for Indonesian Muslims with prayer times, Qibla compass, Quran reader, Doa/Dzikir, Tasbih, Zakat calculator, and Hijri calendar.

**Architecture:** API-First client-side app. Aladhan API (method=20) for prayer times, EQuran.id for Quran. Static JSON for Doa/Dzikir, cities, Islamic dates. Service Worker for offline. No backend.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Vitest, next-pwa

---

## Phase 1: Project Scaffold & Design System

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`

**Step 1: Create Next.js app with TypeScript + Tailwind + App Router**
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**Step 2: Install dependencies**
```bash
npm install next-pwa
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

**Step 3: Install shadcn/ui**
```bash
npx -y shadcn@latest init -d
```

**Step 4: Add shadcn components needed**
```bash
npx -y shadcn@latest add button card input tabs dialog select
```

**Step 5: Commit**
```bash
git init && git add -A && git commit -m "chore: initialize Next.js 15 + Tailwind + shadcn/ui"
```

### Task 2: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `src/__tests__/setup.ts`

**Step 1: Create vitest config**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

**Step 2: Create test setup**
```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom'
```

**Step 3: Add test script to package.json**
Add `"test": "vitest"` and `"test:run": "vitest run"` to scripts.

**Step 4: Run tests (should pass with no tests)**
```bash
npm run test:run
```

**Step 5: Commit**
```bash
git add -A && git commit -m "chore: configure Vitest with jsdom"
```

### Task 3: Design System — Global Styles & Fonts

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/lib/fonts.ts`

**Step 1: Set up Google Fonts (Plus Jakarta Sans, Amiri, JetBrains Mono)**
```typescript
// src/lib/fonts.ts
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'

export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})
```

**Step 2: Create globals.css with full design token system**
Define CSS variables for colors (near-black bg, teal accent, gold highlights, glass card), glassmorphism utility classes, and animation keyframes (breathing glow, pulse, bounce).

**Step 3: Update layout.tsx with fonts, metadata, dark theme**
Set `<html lang="id">`, apply font variables to body, set meta description for SEO, add manifest link.

**Step 4: Verify — run dev server and check dark background renders**
```bash
npm run dev
```

**Step 5: Commit**
```bash
git add -A && git commit -m "feat: design system with glassmorphic dark theme"
```

### Task 4: Bottom Tab Navigation

**Files:**
- Create: `src/components/layout/BottomNav.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Build BottomNav component**
5 tabs (Sholat, Kiblat, Quran, Doa, Lainnya) with icons, active state glow, glass background. Use `usePathname()` for active detection.

**Step 2: Build AppShell wrapper**
Wraps children with proper padding, max-width container (480px desktop), bottom padding for nav.

**Step 3: Wire into layout.tsx**

**Step 4: Create placeholder pages for all 5 routes**
- `src/app/page.tsx` (Sholat home)
- `src/app/kiblat/page.tsx`
- `src/app/quran/page.tsx`
- `src/app/doa/page.tsx`
- `src/app/lainnya/page.tsx`

**Step 5: Verify navigation works across all tabs**

**Step 6: Commit**
```bash
git add -A && git commit -m "feat: bottom tab navigation with app shell"
```

---

## Phase 2: Core Services (TDD)

### Task 5: Static Data — Cities JSON

**Files:**
- Create: `public/data/cities.json`
- Create: `src/lib/types.ts`
- Create: `src/__tests__/cities.test.ts`

**Step 1: Write failing test**
```typescript
// src/__tests__/cities.test.ts
import { describe, it, expect } from 'vitest'
import cities from '../../public/data/cities.json'

describe('cities.json', () => {
  it('contains at least 50 Indonesian cities', () => {
    expect(cities.length).toBeGreaterThanOrEqual(50)
  })
  it('each city has name, lat, lon, timezone', () => {
    cities.forEach((city: any) => {
      expect(city).toHaveProperty('name')
      expect(city).toHaveProperty('lat')
      expect(city).toHaveProperty('lon')
      expect(city).toHaveProperty('timezone')
      expect(['WIB', 'WITA', 'WIT']).toContain(city.timezone)
    })
  })
  it('includes Jakarta', () => {
    expect(cities.some((c: any) => c.name === 'Jakarta')).toBe(true)
  })
})
```

**Step 2: Run test — should fail (file doesn't exist)**
```bash
npm run test:run -- src/__tests__/cities.test.ts
```

**Step 3: Create cities.json with 50+ Indonesian cities**
Include all provincial capitals with accurate lat/lon/timezone.

**Step 4: Create TypeScript types**
```typescript
// src/lib/types.ts
export interface City {
  name: string; lat: number; lon: number; timezone: 'WIB' | 'WITA' | 'WIT';
  province: string;
}
export interface PrayerTimes {
  imsak: string; subuh: string; dzuhur: string;
  ashar: string; maghrib: string; isya: string;
}
// ... more types
```

**Step 5: Run test — should pass**

**Step 6: Commit**
```bash
git add -A && git commit -m "feat: Indonesian cities data with types"
```

### Task 6: Prayer Time Service (TDD)

**Files:**
- Create: `src/services/prayerService.ts`
- Create: `src/__tests__/prayerService.test.ts`

**Step 1: Write failing tests**
```typescript
describe('prayerService', () => {
  it('parsePrayerTimes extracts 6 prayer times from Aladhan response', () => { ... })
  it('getNextPrayer returns correct next prayer based on current time', () => { ... })
  it('getCountdown returns minutes and seconds until next prayer', () => { ... })
  it('isRamadan returns true during Ramadan month', () => { ... })
  it('formatTime converts 24h string to HH:mm', () => { ... })
})
```

**Step 2: Run tests — all fail**

**Step 3: Implement prayerService with functions:**
- `parsePrayerTimes(apiResponse)` → `PrayerTimes`
- `getNextPrayer(times, currentTime)` → `{ name, time, index }`
- `getCountdown(targetTime, currentTime)` → `{ hours, minutes, seconds }`
- `fetchPrayerTimes(lat, lon, date)` → calls Aladhan API
- `fetchMonthlyPrayerTimes(lat, lon, year, month)` → pre-fetch

**Step 4: Run tests — all pass**

**Step 5: Commit**
```bash
git add -A && git commit -m "feat: prayer time service with Aladhan API"
```

### Task 7: Zakat Calculator Service (TDD)

**Files:**
- Create: `src/services/zakatService.ts`
- Create: `src/__tests__/zakatService.test.ts`

**Step 1: Write failing tests**
```typescript
describe('zakatService', () => {
  it('calculates maal zakat at 2.5% when above nisab', () => {
    expect(calculateZakatMaal(100_000_000, 85_000_000)).toBe(2_500_000)
  })
  it('returns 0 when below nisab', () => {
    expect(calculateZakatMaal(50_000_000, 85_000_000)).toBe(0)
  })
  it('calculates fitrah correctly per person', () => {
    expect(calculateZakatFitrah(4, 45_000)).toBe(180_000)
  })
  it('formats Rupiah with dot separators', () => {
    expect(formatRupiah(2_500_000)).toBe('Rp 2.500.000')
  })
  it('rejects negative input', () => {
    expect(calculateZakatMaal(-100, 85_000_000)).toBe(0)
  })
})
```

**Step 2: Run tests — all fail**

**Step 3: Implement zakatService**

**Step 4: Run tests — all pass**

**Step 5: Commit**
```bash
git add -A && git commit -m "feat: zakat calculator service with TDD"
```

### Task 8: Qibla Service (TDD)

**Files:**
- Create: `src/services/qiblaService.ts`
- Create: `src/__tests__/qiblaService.test.ts`

**Step 1: Write tests for bearing calculation**
Test known bearings: Jakarta→Mecca ≈ 295°, Jayapura→Mecca ≈ 292°.

**Step 2: Implement `calculateQiblaBearing(lat, lon)` using Haversine formula**

**Step 3: Run tests — pass**

**Step 4: Commit**

### Task 9: Quran Service

**Files:**
- Create: `src/services/quranService.ts`

**Step 1: Implement functions:**
- `fetchSurahList()` → calls EQuran.id `/api/v2/surat`
- `fetchSurahDetail(number)` → calls EQuran.id `/api/v2/surat/{number}`
- `searchSurah(query, surahList)` → client-side filter

**Step 2: Commit**

### Task 10: Static Data — Doa/Dzikir JSON

**Files:**
- Create: `public/data/doa-dzikir.json`

Curate doa collection with categories: Dzikir Pagi (minimum 10 dzikir), Dzikir Sore, Doa Setelah Sholat (minimum 8), Ruqyah (key ayat), Doa Harian (10+ common duas). Each entry: Arabic, Latin, Indonesian translation, source hadith.

**Commit after creation.**

### Task 11: Static Data — Islamic Dates JSON

**Files:**
- Create: `public/data/islamic-dates.json`

Important Hijri dates: 1 Muharram, Maulid Nabi (12 Rabiul Awal), Isra Mi'raj (27 Rajab), 1 Ramadan, Nuzulul Quran (17 Ramadan), 1 Syawal (Idul Fitri), 10 Dzulhijjah (Idul Adha), etc.

**Commit after creation.**

---

## Phase 3: UI Pages

### Task 12: Home Page — Prayer Times

Build the hero page with prayer time cards, countdown ring (SVG circle animation), Adzan audio button, location badge, Hijri/Gregorian header. Use `usePrayerTimes` custom hook.

### Task 13: Kiblat Page — Qibla Compass

Build full-screen compass using Device Orientation API. Animated needle, degree readout, iOS permission button, fallback for no-sensor devices.

### Task 14: Quran Page — Surah List & Detail

Surah list with search. Detail page at `/quran/[number]` with Arabic + Indonesian per ayat.

### Task 15: Doa Page — Categories & Cards

Category grid, expandable doa cards with Arabic/Latin/translation.

### Task 16: Lainnya Page — Tasbih, Zakat, Calendar, Settings

Tasbih counter with haptic + localStorage persistence. Zakat calculator (Maal/Fitrah tabs). Hijri calendar month view. City picker settings.

---

## Phase 4: PWA & Polish

### Task 17: PWA Configuration

- Create `public/manifest.json` (name, icons, theme_color, display: standalone)
- Configure next-pwa in `next.config.ts`
- Generate app icons (192x192, 512x512)
- Register Service Worker with caching strategies

### Task 18: Adzan Audio

- Add 2 MP3 audio files to `public/audio/` (regular adzan, subuh adzan)
- Implement audio playback in home page
- Cache audio files in Service Worker

### Task 19: Responsive Polish & Animations

- Verify all pages at 360px, 768px, 1024px
- Add all micro-animations from design system
- Glassmorphism rendering check across browsers
- Islamic geometric SVG background pattern

### Task 20: Integration Testing & Verification

- Test prayer times for Jakarta, Surabaya, Makassar, Jayapura, Banda Aceh, Denpasar against jadwalsholat.org (±1 min tolerance)
- Verify all 114 surahs load
- Test offline mode (disable network, verify cached features work)
- PWA install test on Android Chrome

**Final commit:**
```bash
git add -A && git commit -m "feat: SholatKu v1.0 complete"
```
