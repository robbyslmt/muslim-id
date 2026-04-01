'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, Compass, BookOpen, Heart, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Sholat', href: '/', icon: Clock },
    { label: 'Kiblat', href: '/kiblat', icon: Compass },
    { label: 'Quran', href: '/quran', icon: BookOpen },
    { label: 'Doa', href: '/doa', icon: Heart },
    { label: 'Lainnya', href: '/lainnya', icon: Menu },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav">
      <div className="app-container flex justify-between items-center h-[72px] px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs transition-all duration-200",
                isActive ? "text-[var(--sk-accent)]" : "text-[var(--sk-text-secondary)] hover:text-[var(--sk-text-primary)]"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-2xl transition-all duration-300",
                isActive ? "prayer-glow bg-[var(--sk-accent)]/10" : ""
              )}>
                <Icon size={24} className={cn("transition-transform", isActive ? "scale-110" : "")} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
