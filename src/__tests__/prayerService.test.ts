import { describe, it, expect } from 'vitest'
import {
  parsePrayerTimes,
  getNextPrayer,
  getCountdown,
  isRamadan,
  formatTime
} from '../services/prayerService'

describe('prayerService', () => {
  it('parsePrayerTimes extracts 6 prayer times from Aladhan response timings object', () => {
    const mockTimings = {
      Fajr: "04:30",
      Sunrise: "05:45",
      Dhuhr: "12:00",
      Asr: "15:15",
      Sunset: "18:00",
      Maghrib: "18:00",
      Isha: "19:10",
      Imsak: "04:20",
      Midnight: "00:00"
    };
    const expected = {
      imsak: "04:20",
      subuh: "04:30",
      dzuhur: "12:00",
      ashar: "15:15",
      maghrib: "18:00",
      isya: "19:10"
    };
    expect(parsePrayerTimes(mockTimings)).toEqual(expected);
  })

  it('getNextPrayer returns correct next prayer based on current time', () => {
    const times = {
      imsak: "04:20",
      subuh: "04:30",
      dzuhur: "12:00",
      ashar: "15:15",
      maghrib: "18:00",
      isya: "19:10"
    };
    
    // Test before any prayer (e.g. 02:00) => Imsak
    const date1 = new Date("2024-01-01T02:00:00");
    const next1 = getNextPrayer(times, date1);
    expect(next1.name).toBe("Imsak");
    
    // Test after Imsak, before Subuh (e.g. 04:25) => Subuh
    const date2 = new Date("2024-01-01T04:25:00");
    const next2 = getNextPrayer(times, date2);
    expect(next2.name).toBe("Subuh");

    // Test after Subuh, before Dzuhur (e.g. 08:00) => Dzuhur
    const date3 = new Date("2024-01-01T08:00:00");
    const next3 = getNextPrayer(times, date3);
    expect(next3.name).toBe("Dzuhur");

    // Test after Isya (e.g. 21:00) => next day Imsak (handles wraparound)
    const date4 = new Date("2024-01-01T21:00:00");
    const next4 = getNextPrayer(times, date4);
    expect(next4.name).toBe("Imsak"); // For now just checking it loops to first prayer
  })

  it('getCountdown returns structured countdown data', () => {
    const target = new Date("2024-01-01T15:00:00").getTime();
    const current = new Date("2024-01-01T14:30:15").getTime();
    
    const countdown = getCountdown(target, current);
    expect(countdown).toEqual({
      hours: 0,
      minutes: 29,
      seconds: 45
    });
    
    // Test negative/past time returns zeros
    const pastCurrent = new Date("2024-01-01T15:05:00").getTime();
    expect(getCountdown(target, pastCurrent)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  })

  it('isRamadan returns true during Ramadan month based on Aladhan Hijri object', () => {
    const ramadanHijri = { month: { number: 9 } };
    const syawalHijri = { month: { number: 10 } };
    
    expect(isRamadan(ramadanHijri)).toBe(true);
    expect(isRamadan(syawalHijri)).toBe(false);
  })

  it('formatTime converts 24h string to HH:mm format if needed', () => {
    // Basic test if there's any formatting need
    expect(formatTime("04:30 (WIB)")).toBe("04:30");
    expect(formatTime("04:30")).toBe("04:30");
  })
})
