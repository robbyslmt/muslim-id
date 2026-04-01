import { PrayerTimes } from '../lib/types';

export function parsePrayerTimes(timings: Record<string, string>): PrayerTimes {
  return {
    imsak: formatTime(timings.Imsak),
    subuh: formatTime(timings.Fajr),
    dzuhur: formatTime(timings.Dhuhr),
    ashar: formatTime(timings.Asr),
    maghrib: formatTime(timings.Maghrib),
    isya: formatTime(timings.Isha)
  };
}

export function formatTime(timeStr: string): string {
  // Aladhan sometimes returns "04:30 (WIB)", we just want "04:30"
  if (!timeStr) return '';
  return timeStr.split(' ')[0];
}

export function getNextPrayer(times: PrayerTimes, currentTime: Date): { name: string, time: string, timestamp: number } {
  const now = currentTime.getTime();
  const dateStr = currentTime.toISOString().split('T')[0];
  
  const prayerMap = [
    { name: 'Imsak', time: times.imsak },
    { name: 'Subuh', time: times.subuh },
    { name: 'Dzuhur', time: times.dzuhur },
    { name: 'Ashar', time: times.ashar },
    { name: 'Maghrib', time: times.maghrib },
    { name: 'Isya', time: times.isya }
  ];

  for (const prayer of prayerMap) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerTime = new Date(currentTime);
    prayerTime.setHours(hours, minutes, 0, 0);
    
    if (prayerTime.getTime() > now) {
      return {
        name: prayer.name,
        time: prayer.time,
        timestamp: prayerTime.getTime()
      };
    }
  }

  // If all prayers today have passed, the next prayer is Imsak tomorrow
  const tomorrow = new Date(currentTime);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [imsakHours, imsakMinutes] = times.imsak.split(':').map(Number);
  tomorrow.setHours(imsakHours, imsakMinutes, 0, 0);

  return {
    name: 'Imsak', // Assuming next day starts with Imsak
    time: times.imsak,
    timestamp: tomorrow.getTime()
  };
}

export function getCountdown(targetTime: number, currentTime: number) {
  const diff = targetTime - currentTime;
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
}

export function isRamadan(hijriDate: { month: { number: number } }): boolean {
  return hijriDate?.month?.number === 9;
}

export async function fetchPrayerTimes(lat: number, lon: number, dateStr: string) {
  // `dateStr` is standard format DD-MM-YYYY
  const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=20`);
  if (!res.ok) throw new Error('Failed to fetch prayer times');
  return res.json();
}

export async function fetchMonthlyPrayerTimes(lat: number, lon: number, year: number, month: number) {
  const res = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lon}&method=20`);
  if (!res.ok) throw new Error('Failed to fetch monthly prayer times');
  return res.json();
}
