'use client';
import { MessageCircle, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/utils';

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const waNumber = SITE.whatsapp.replace(/\D/g, '');
  const msg = encodeURIComponent("Bonjour RAF'YAM, je souhaite des conseils pour choisir une paire.");

  return (
    <div className={cn('fixed bottom-6 right-6 z-40 transition-all duration-500', show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0')}>
      {open && (
        <div className="mb-3 w-72 rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-luxe animate-fade-up" role="dialog" aria-label="Contact WhatsApp">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg">Parlons ensemble</p>
              <p className="mt-1 text-xs text-ink-300">Réponse sous 1 heure en moyenne.</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fermer" className="rounded p-1 text-ink-300 hover:text-gold-300"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 space-y-2">
            <a href={`https://wa.me/${waNumber}?text=${msg}`} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]">
              <MessageCircle className="h-5 w-5" />
              Discuter sur WhatsApp
            </a>
            <a href={`tel:${SITE.phoneRaw}`} className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 text-sm font-medium text-bone-100 transition-colors hover:border-gold-500 hover:text-gold-300">
              <Phone className="h-5 w-5" />
              {SITE.phone}
            </a>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Ouvrir le chat WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" aria-hidden="true" />
        {open ? <X className="relative h-6 w-6" /> : <MessageCircle className="relative h-6 w-6" />}
      </button>
    </div>
  );
}