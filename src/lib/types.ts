export interface City {
  name: string;
  lat: number;
  lon: number;
  timezone: 'WIB' | 'WITA' | 'WIT';
  province: string;
}

export interface PrayerTimes {
  imsak: string;
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}
