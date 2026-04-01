export interface SurahSummary {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail extends SurahSummary {
  ayat: Ayat[];
}

/**
 * Fetches the list of all 114 Surahs from EQuran.id API
 */
export async function fetchSurahList(): Promise<SurahSummary[]> {
  const res = await fetch('https://equran.id/api/v2/surat');
  if (!res.ok) throw new Error('Failed to fetch surah list');
  const result = await res.json();
  return result.data;
}

/**
 * Fetches details of a specific Surah by its number (1-114)
 */
export async function fetchSurahDetail(number: number): Promise<SurahDetail> {
  const res = await fetch(`https://equran.id/api/v2/surat/${number}`);
  if (!res.ok) throw new Error('Failed to fetch surah detail');
  const result = await res.json();
  return result.data;
}

/**
 * Searches surahs matching query by name or translation.
 */
export function searchSurah(query: string, surahs: SurahSummary[]): SurahSummary[] {
  if (!query) return surahs;
  const lowerQuery = query.toLowerCase();
  return surahs.filter(s => 
    s.namaLatin.toLowerCase().includes(lowerQuery) || 
    s.arti.toLowerCase().includes(lowerQuery)
  );
}
