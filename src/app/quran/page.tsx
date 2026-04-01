'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchSurahList, SurahSummary, searchSurah } from '@/services/quranService';
import { Search, Loader2 } from 'lucide-react';

export default function QuranPage() {
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [filtered, setFiltered] = useState<SurahSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchSurahList().then((data) => {
      setSurahs(data);
      setFiltered(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setFiltered(searchSurah(val, surahs));
  };

  return (
    <div className="flex flex-col w-full h-full pt-4 animate-in fade-in duration-700 pb-8">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-4">Al-Quran</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sk-text-secondary)]" />
          <input 
            type="text"
            placeholder="Cari surat (mis. Al Kahf)..."
            value={query}
            onChange={handleSearch}
            className="w-full glass-card border-[var(--sk-border)] rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--sk-accent)] transition-colors placeholder:text-[var(--sk-text-secondary)]/50"
          />
        </div>
      </div>

      <div className="flex-1 px-4 overflow-y-auto pb-6 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 text-[var(--sk-accent)]">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="text-sm">Memuat Al-Quran...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((surah) => (
              <Link 
                key={surah.nomor} 
                href={`/quran/${surah.nomor}`}
                className="glass-card hover:bg-white/5 rounded-2xl p-4 flex justify-between items-center transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--sk-accent)]/10 flex items-center justify-center text-[var(--sk-accent)] font-mono font-bold text-sm">
                    {surah.nomor}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{surah.namaLatin}</span>
                    <span className="text-[var(--sk-text-secondary)] text-xs uppercase tracking-wider">
                      {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-arabic text-xl text-[var(--sk-accent)] block mb-1">{surah.nama}</span>
                  <span className="text-xs text-[var(--sk-text-secondary)]">{surah.arti}</span>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-10 text-[var(--sk-text-secondary)]">
                Tidak ada surat yang cocok dengan pencarian "{query}".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
