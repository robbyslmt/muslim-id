'use client';

import { useState } from 'react';
import { calculateZakatMaal, formatRupiah } from '@/services/zakatService';
import islamicDates from '../../../public/data/islamic-dates.json';
import { Calculator, Calendar, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LainnyaPage() {
  const [tasbihCount, setTasbihCount] = useState(0);
  const [wealth, setWealth] = useState('');
  
  const wealthNumber = parseInt(wealth.replace(/\D/g, '')) || 0;
  const zakatAmount = calculateZakatMaal(wealthNumber);
  
  const handleTasbih = () => {
    // Vibrate device if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    setTasbihCount(prev => prev + 1);
  };
  
  const resetTasbih = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    setTasbihCount(0);
  };

  return (
    <div className="flex flex-col w-full h-full pt-4 animate-in fade-in duration-700 pb-8 px-4 gap-8">
      
      <div className="w-full">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Lainnya</h1>
        <p className="text-[var(--sk-text-secondary)] text-sm">Fitrah, Tasbih, dan Kalender Islam.</p>
      </div>

      {/* Tasbih Digital */}
      <section className="glass-card p-6 rounded-3xl flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CircleDot size={80} />
        </div>
        <h2 className="text-white font-bold mb-6 flex items-center gap-2 w-full">
          <CircleDot size={18} className="text-[var(--sk-accent)]" />
          Tasbih Digital
        </h2>
        
        <div className="flex flex-col items-center">
          <div className="text-7xl font-mono font-bold text-[var(--sk-accent)] mb-8 tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {tasbihCount.toString().padStart(2, '0')}
          </div>
          
          <div className="flex gap-4 items-center">
            <button 
              onClick={resetTasbih}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[var(--sk-text-secondary)] hover:bg-white/5 hover:text-white transition-all active:scale-95"
            >
              Ulang
            </button>
            <button 
              onClick={handleTasbih}
              className="w-24 h-24 rounded-full bg-[var(--sk-accent)] prayer-glow flex items-center justify-center text-white font-bold text-xl active:scale-95 transition-transform"
            >
              HITUNG
            </button>
          </div>
        </div>
      </section>

      {/* Zakat Calculator */}
      <section className="glass-card p-6 rounded-3xl">
        <h2 className="text-white font-bold mb-6 flex items-center gap-2">
          <Calculator size={18} className="text-[var(--sk-accent)]" />
          Kalkulator Zakat Maal
        </h2>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-[var(--sk-text-secondary)] uppercase tracking-wider mb-2 block">
              Total Harta (Rupiah)
            </label>
            <input 
              type="text"
              value={wealth ? formatRupiah(wealthNumber) : ''}
              onChange={(e) => setWealth(e.target.value)}
              placeholder="Rp 0"
              className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[var(--sk-accent)] transition-colors"
            />
          </div>
          
          <div className="bg-[var(--sk-accent)]/10 border border-[var(--sk-accent)]/20 rounded-xl p-4 flex flex-col items-center mt-2">
            <span className="text-xs text-[var(--sk-text-secondary)] mb-1">Zakat yang wajib dikeluarkan (2.5%)</span>
            <span className="text-2xl font-mono font-bold text-[var(--sk-accent)]">
              {formatRupiah(zakatAmount)}
            </span>
            {zakatAmount === 0 && wealthNumber > 0 && (
              <span className="text-xs text-yellow-500/80 mt-2 text-center">
                Belum mencapai nishab (Rp 85.000.000)
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Kalender Islam */}
      <section className="glass-card p-6 rounded-3xl">
        <h2 className="text-white font-bold mb-6 flex items-center gap-2">
          <Calendar size={18} className="text-[var(--sk-accent)]" />
          Hari Penting Islam
        </h2>
        
        <div className="flex flex-col gap-4">
          {islamicDates.map((date, index) => (
            <div key={index} className="flex flex-col pb-4 border-b border-white/5 last:border-0 last:pb-0">
              <h3 className="text-white font-semibold flex justify-between items-start">
                {date.name}
              </h3>
              <p className="text-xs text-[var(--sk-text-secondary)] mt-1">{date.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
