'use client';

import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { MapPin, Bell, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { locationName, hijriDate, gregorianDate, times, nextPrayer, countdown, loading, error } = usePrayerTimes();

  const formatCountdown = () => {
    if (!countdown) return '00:00:00';
    return `${countdown.hours.toString().padStart(2, '0')}:${countdown.minutes.toString().padStart(2, '0')}:${countdown.seconds.toString().padStart(2, '0')}`;
  };

  const prayers = [
    { id: 'imsak', name: 'Imsak', time: times?.imsak },
    { id: 'subuh', name: 'Subuh', time: times?.subuh },
    { id: 'dzuhur', name: 'Dzuhur', time: times?.dzuhur },
    { id: 'ashar', name: 'Ashar', time: times?.ashar },
    { id: 'maghrib', name: 'Maghrib', time: times?.maghrib },
    { id: 'isya', name: 'Isya', time: times?.isya }
  ];

  return (
    <div className="flex flex-col w-full h-full pt-4 animate-in fade-in duration-700 pb-8">
      
      {/* Header Info */}
      <div className="flex justify-between items-start mb-8 px-4">
        <div className="flex flex-col">
          <div className="flex items-center text-[var(--sk-accent)] mb-1">
            <MapPin size={16} className="mr-1.5" />
            <span className="font-semibold text-sm">{locationName}</span>
          </div>
          <div className="flex items-center text-[var(--sk-text-secondary)] text-xs">
            <Calendar size={12} className="mr-1.5" />
            <span>{gregorianDate}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="font-arabic text-lg text-[var(--sk-accent)] opacity-90">{hijriDate}</span>
        </div>
      </div>

      {error && (
        <div className="mx-4 mb-4 p-4 rounded-xl border border-red-900/50 bg-red-900/10 text-red-100 text-sm">
          {error}
        </div>
      )}

      {/* Hero Countdown */}
      <div className="mx-4 mb-10 flex flex-col items-center justify-center p-8 glass-card border-[var(--sk-accent-glow)]/30 rounded-3xl relative overflow-hidden">
        {/* Decorative inner glow */}
        <div className="absolute inset-0 bg-[var(--sk-accent)]/5 rounded-3xl -z-10 prayer-glow"></div>
        
        <p className="text-[var(--sk-text-secondary)] mb-2 uppercase tracking-widest text-xs font-semibold">
          Menuju {nextPrayer?.name || '...'}
        </p>
        
        {loading ? (
          <div className="h-16 w-48 animate-pulse bg-white/5 rounded-xl my-2"></div>
        ) : (
          <h1 className="text-6xl font-mono font-bold text-white mb-2 tracking-tight">
            {formatCountdown()}
          </h1>
        )}
        
        <p className="text-[var(--sk-accent)] font-medium">
          {nextPrayer?.time ? `${nextPrayer.time} WIB` : '--:--'}
        </p>
      </div>

      {/* Prayer Times Grid */}
      <div className="px-4 grid grid-cols-2 gap-3 sm:gap-4 flex-1">
        {prayers.map((prayer) => {
          const isActive = nextPrayer?.name === prayer.name;
          return (
            <div 
              key={prayer.name}
              className={cn(
                "glass-card rounded-2xl p-4 flex flex-col justify-between transition-all duration-500",
                isActive ? "border-[var(--sk-accent)] bg-[var(--sk-accent)]/10 shadow-[0_0_20px_rgba(20,184,166,0.15)] scale-105 z-10" : ""
              )}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={cn(
                  "font-semibold text-sm",
                  isActive ? "text-[var(--sk-accent)]" : "text-[var(--sk-text-secondary)]"
                )}>
                  {prayer.name}
                </span>
                <Bell size={14} className={cn(
                  "opacity-50",
                  isActive ? "text-[var(--sk-accent)] opacity-100" : "text-white"
                )} />
              </div>
              
              {loading ? (
                <div className="h-8 w-20 animate-pulse bg-white/5 rounded-lg"></div>
              ) : (
                <span className={cn(
                  "text-2xl font-mono font-bold",
                  isActive ? "text-white" : "text-gray-300"
                )}>
                  {prayer.time || '--:--'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
