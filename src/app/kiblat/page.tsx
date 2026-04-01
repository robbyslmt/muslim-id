'use client';

import { useState, useEffect } from 'react';
import { calculateQiblaBearing } from '@/services/qiblaService';
import { Compass, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import citiesData from '../../../public/data/cities.json';

export default function KiblatPage() {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string>('Mendeteksi lokasi...');

  // Effect to set initial city targeting for demo purposes
  useEffect(() => {
    // Default to Jakarta Qibla
    const jkt = citiesData.find(c => c.name === 'Jakarta')!;
    setQiblaBearing(calculateQiblaBearing(jkt.lat, jkt.lon));
    setLocationName(jkt.name);
  }, []);

  const requestPermission = async () => {
    // TypeScript workaround for iOS DeviceOrientationEvent
    const reqPerm = (DeviceOrientationEvent as any).requestPermission;
    if (typeof reqPerm === 'function') {
      try {
        const permissionState = await reqPerm();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          startCompass();
        } else {
          alert('Izin kompas ditolak.');
          setPermissionGranted(false);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Non-iOS 13+ devices
      setPermissionGranted(true);
      startCompass();
    }
  };

  const startCompass = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Webkit compass heading is positive clockwise from North
      let h = (event as any).webkitCompassHeading;
      if (!h && event.alpha !== null) {
        // Fallback calculation for standard alpha (which is 0 heading to West, 90 to North on some devices, etc).
        // Actual robust math for Android requires absolute orientation or compassheading.
        // For simplicity, converting standard alpha (counter-clockwise from east usually)
        h = 360 - event.alpha;
      }
      if (h !== null && h !== undefined) {
        setHeading(h);
      }
    };
    
    // Some devices support deviceorientationabsolute
    window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
  };

  // Calculate rotation difference safely avoiding spinner wraps
  const rotation = qiblaBearing !== null ? qiblaBearing - heading : 0;
  
  // Highlight if facing Mecca (e.g. within 5 degrees)
  const isFacingMecca = qiblaBearing !== null && Math.abs(rotation) < 5;

  return (
    <div className="flex flex-col items-center w-full h-full pt-4 animate-in fade-in duration-700 pb-8 px-4">
      <div className="w-full text-center mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Kiblat</h1>
        <p className="text-[var(--sk-text-secondary)] text-sm">{locationName}</p>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center relative">
        {/* Background Decorative Rings */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
           <div className="w-64 h-64 border border-[var(--sk-accent)] rounded-full border-dashed"></div>
           <div className="absolute w-48 h-48 border border-[var(--sk-accent)] rounded-full"></div>
        </div>

        {permissionGranted === null ? (
          <div className="glass-card p-8 rounded-3xl flex flex-col items-center max-w-xs text-center">
            <Compass size={48} className="text-[var(--sk-accent)] mb-4" />
            <h2 className="text-white font-semibold mb-2">Akses Kompas</h2>
            <p className="text-sm text-[var(--sk-text-secondary)] mb-6">Kami memerlukan akses sensor perangkat untuk menunjukkan arah Kiblat yang akurat.</p>
            <button 
              onClick={requestPermission}
              className="bg-[var(--sk-accent)] text-[var(--sk-bg)] font-semibold py-3 px-6 rounded-full w-full hover:bg-[var(--sk-accent-glow)] transition-colors"
            >
              Aktifkan Kompas
            </button>
          </div>
        ) : (
          <div className={cn(
            "relative w-72 h-72 rounded-full flex items-center justify-center transition-all duration-300",
            isFacingMecca ? "prayer-glow bg-[var(--sk-accent)]/5 border-2 border-[var(--sk-accent)]" : "border-2 border-white/10"
          )}>
            {/* North Indicator Fixed to Board */}
            <div 
              className="absolute w-full h-full rounded-full transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${-heading}deg)` }}
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-red-500 font-bold font-mono">U</div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[var(--sk-text-secondary)] font-mono text-sm">S</div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sk-text-secondary)] font-mono text-sm">T</div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sk-text-secondary)] font-mono text-sm">B</div>
            </div>

            {/* Qibla Pointer */}
            <div 
              className="absolute w-full h-full transition-transform duration-300 ease-out z-10"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <Navigation size={40} fill="var(--sk-accent)" className="text-[var(--sk-accent)]" />
                <span className="mt-2 text-[var(--sk-accent)] font-semibold text-xs tracking-wider">KABAH</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {permissionGranted && (
        <div className="mt-8 glass-card rounded-2xl p-4 w-full flex justify-between items-center max-w-sm">
          <div className="flex flex-col">
             <span className="text-[var(--sk-text-secondary)] text-xs uppercase tracking-wider mb-1">Arah Kiblat</span>
             <span className="text-white font-mono font-bold text-xl">{qiblaBearing ? Math.round(qiblaBearing) : '--'}°</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[var(--sk-text-secondary)] text-xs uppercase tracking-wider mb-1">Perangkat</span>
             <span className="text-white font-mono font-bold text-xl">{Math.round(heading)}°</span>
          </div>
        </div>
      )}
    </div>
  );
}
