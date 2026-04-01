import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { minHeight?: boolean; children: ReactNode }) {
  return (
    <div className="app-container flex flex-col min-h-dvh pb-[88px]">
      <main className="flex-1 w-full pt-4 md:pt-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
