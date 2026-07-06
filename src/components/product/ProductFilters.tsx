'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export function ProductFilters({ categories, brands, initial }: { categories: Array<{ slug: string; name: string }>; brands: Array<{ slug: string; name: string }>; initial: Record<string, string | string[] | undefined> }) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const update = (key: string, value: string) => {
    const u = new URLSearchParams(params.toString());
    if (value) u.set(key, value); else u.delete(key);
    u.delete('page');
    startTransition(() => router.push(`/boutique?${u.toString()}`));
  };

  const reset = () => startTransition(() => router.push('/boutique'));

  const v = (k: string) => String(initial[k] ?? '');

  const content = (
    <div className="space-y-8">
      <div>
        <label htmlFor="f-q" className="text-xs uppercase tracking-widest text-gold-300">Recherche</label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input id="f-q" defaultValue={v('q')} onChange={(e) => update('q', e.target.value)}
                 placeholder="Rechercher…" className="input-luxe pl-10" />
        </div>
      </div>

      <FilterGroup title="Catégorie">
        <Radio name="categorie" value="" current={v('categorie')} update={update} label="Toutes" />
        {categories.map((c) => <Radio key={c.slug} name="categorie" value={c.slug} current={v('categorie')} update={update} label={c.name} />)}
      </FilterGroup>

      <FilterGroup title="Marque">
        <Radio name="marque" value="" current={v('marque')} update={update} label="Toutes" />
        {brands.map((b) => <Radio key={b.slug} name="marque" value={b.slug} current={v('marque')} update={update} label={b.name} />)}
      </FilterGroup>

      <FilterGroup title="Prix (FCFA)">
        <div className="flex items-center gap-2">
          <input type="number" min={0} defaultValue={v('prixMin') || '0'} onChange={(e) => update('prixMin', e.target.value)} placeholder="Min" className="input-luxe" />
          <span className="text-ink-400">—</span>
          <input type="number" min={0} defaultValue={v('prixMax') || '500000'} onChange={(e) => update('prixMax', e.target.value)} placeholder="Max" className="input-luxe" />
        </div>
      </FilterGroup>

      <FilterGroup title="Pointure">
        <div className="flex flex-wrap gap-2">
          {['39','40','41','42','43','44','45','46'].map((s) => (
            <button key={s} onClick={() => update('pointure', v('pointure') === s ? '' : s)}
                    aria-pressed={v('pointure') === s}
                    className={`h-10 w-10 rounded-full border text-sm transition-all ${v('pointure') === s ? 'border-gold-500 bg-gold-500 text-ink-950' : 'border-white/10 text-bone-100 hover:border-gold-500'}`}>
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <button onClick={reset} className="text-xs uppercase tracking-widest text-ink-300 hover:text-gold-300">Réinitialiser les filtres</button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block">{content}</aside>
      {/* Mobile trigger */}
      <button onClick={() => setOpen(true)} className="fixed bottom-24 left-6 z-30 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-3 text-sm font-medium text-ink-950 shadow-luxe lg:hidden">
        <SlidersHorizontal className="h-4 w-4" /> Filtres
      </button>
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-ink-950/80" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-ink-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl">Filtres</h3>
              <button onClick={() => setOpen(false)} aria-label="Fermer"><X className="h-5 w-5" /></button>
            </div>
            {content}
            <button onClick={() => setOpen(false)} className="btn-primary mt-6 w-full justify-center">Appliquer</button>
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gold-300">{title}</p>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function Radio({ name, value, current, update, label }: { name: string; value: string; current: string; update: (k: string, v: string) => void; label: string }) {
  const active = current === value;
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-bone-100 transition-colors hover:text-gold-300">
      <input type="radio" name={name} value={value} checked={active} onChange={() => update(name, value)} className="sr-only" />
      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${active ? 'border-gold-500' : 'border-white/20'}`}>
        {active && <span className="h-2 w-2 rounded-full bg-gold-500" />}
      </span>
      <span className="flex-1">{label}</span>
    </label>
  );
}