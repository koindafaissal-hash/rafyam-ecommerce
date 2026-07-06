'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FAQAccordion({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="divide-y divide-white/5 rounded-lg border border-white/5">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={i}>
            <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-white/[0.02]">
              <span className="font-display text-lg">{it.q}</span>
              <ChevronDown className={cn('h-5 w-5 flex-shrink-0 text-gold-300 transition-transform', isOpen && 'rotate-180')} />
            </button>
            <div className={cn('grid transition-all duration-300', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-sm leading-relaxed text-ink-200">{it.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}