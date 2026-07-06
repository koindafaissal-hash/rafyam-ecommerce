'use client';
import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductGallery({ images, name }: { images: Array<{ url: string; alt: string }>; name: string }) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');

  if (!images.length) return null;
  const main = images[idx];

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div>
      <div
        className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-lg bg-ink-900"
        onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)} onMouseMove={onMove}
      >
        <img src={main.url} alt={main.alt} loading={idx === 0 ? 'eager' : 'lazy'}
             style={zoom ? { transform: 'scale(2)', transformOrigin: origin, transition: 'transform 0.1s' } : { transition: 'transform 0.4s' }}
             className="h-full w-full object-cover" />
        <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-ink-950/60 px-3 py-1.5 text-[10px] uppercase tracking-widest text-bone-50 backdrop-blur">
          <ZoomIn className="h-3 w-3" /> Survolez pour zoomer
        </div>
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar" role="tablist" aria-label="Galerie">
          {images.map((img, i) => (
            <button key={i} role="tab" aria-selected={i === idx} onClick={() => setIdx(i)}
                    className={cn('h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-all', i === idx ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100')}>
              <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}