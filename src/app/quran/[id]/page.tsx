import { fetchSurahDetail } from '@/services/quranService';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

export default async function SurahDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Using Next.js 15 App Router async component for data fetching (Server Component)
  const resolvedParams = await params;
  const data = await fetchSurahDetail(Number(resolvedParams.id));

  return (
    <div className="flex flex-col w-full h-full pb-8">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 glass-nav border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <Link href="/quran" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold text-white">{data.namaLatin}</h1>
          <span className="text-[10px] uppercase tracking-widest text-[var(--sk-accent)]">
            {data.tempatTurun} • {data.jumlahAyat} Ayat
          </span>
        </div>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      <div className="px-4 py-6">
        {/* Basmalah Header if not Al-Fatiha or At-Tawbah (1 and 9) */}
        {data.nomor !== 1 && data.nomor !== 9 && (
          <div className="text-center py-8 mb-8 border-b border-[var(--sk-border)]">
            <h2 className="font-arabic text-3xl text-white leading-loose">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h2>
          </div>
        )}

        {/* Ayat List */}
        <div className="flex flex-col gap-8">
          {data.ayat.map((a) => (
            <div key={a.nomorAyat} className="flex flex-col relative pb-8 border-b border-white/5 last:border-0 group">
              {/* Verse Actions */}
              <div className="flex justify-between items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-[var(--sk-accent)]/10 flex items-center justify-center text-[var(--sk-accent)] font-mono font-bold text-xs">
                  {a.nomorAyat}
                </div>
                {/* We won't implement global audio player for MVP but we show a styled play button */}
                <button className="text-[var(--sk-text-secondary)] hover:text-[var(--sk-accent)] transition-colors p-2 rounded-full hover:bg-white/5">
                  <Play size={16} fill="currentColor" />
                </button>
              </div>

              {/* Arabic Text */}
              <div className="text-right mb-6">
                <p className="font-arabic text-3xl text-white leading-[2.5]">{a.teksArab}</p>
              </div>

              {/* Translation */}
              <div className="text-left">
                <p className="text-[var(--sk-text-secondary)] italic mb-2 leading-relaxed">
                  {a.teksLatin}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "{a.teksIndonesia}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
