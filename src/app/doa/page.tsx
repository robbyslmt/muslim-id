'use client';

import { useState, useEffect } from 'react';
import doaData from '../../../public/data/doa-dzikir.json';
import { ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DoaPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(doaData[0]?.category || null);

  const toggleCategory = (cat: string) => {
    setOpenCategory(prev => prev === cat ? null : cat);
  };

  return (
    <div className="flex flex-col w-full h-full pt-4 animate-in fade-in duration-700 pb-8">
      <div className="px-4 mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Doa & Dzikir</h1>
        <p className="text-[var(--sk-text-secondary)] text-sm">Kumpulan doa sehari-hari sesuai sunnah.</p>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {doaData.map((categoryGroup, index) => {
          const isOpen = openCategory === categoryGroup.category;
          return (
            <div key={index} className="glass-card rounded-2xl overflow-hidden transition-all duration-300">
              {/* Category Header */}
              <button 
                onClick={() => toggleCategory(categoryGroup.category)}
                className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--sk-accent)]/10 rounded-xl">
                    <Sparkles size={16} className="text-[var(--sk-accent)]" />
                  </div>
                  <h2 className="text-white font-bold">{categoryGroup.category}</h2>
                </div>
                <ChevronDown size={20} className={cn(
                  "text-[var(--sk-text-secondary)] transition-transform duration-300",
                  isOpen ? "rotate-180" : "rotate-0"
                )} />
              </button>

              {/* Doa List Accordion Body */}
              <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}>
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-4 p-4 pt-0 border-t border-white/5">
                    {categoryGroup.doas.map((doa, dIndex) => (
                       <div key={dIndex} className="p-4 bg-black/20 rounded-xl border border-white/5 relative group">
                          {/* Inner soft glow on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--sk-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                          
                          <h3 className="text-[var(--sk-accent)] font-semibold mb-6 flex justify-between">
                            {doa.title}
                            <span className="text-[10px] text-[var(--sk-text-secondary)] font-mono uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                              {doa.source}
                            </span>
                          </h3>
                          
                          <div className="text-right mb-6">
                            <p className="font-arabic text-2xl text-white leading-[2.5]">{doa.arabic}</p>
                          </div>
                          
                          <div className="text-left space-y-2">
                             <p className="text-[var(--sk-text-secondary)] italic text-sm">{doa.latin}</p>
                             <p className="text-gray-300 text-sm leading-relaxed">"{doa.translation}"</p>
                          </div>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
