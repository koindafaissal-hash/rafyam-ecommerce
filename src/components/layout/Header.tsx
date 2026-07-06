'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCart } from '@/lib/cart';
import { useFavorites } from '@/lib/favorites';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/categories', label: 'Catégories' },
  { href: '/a-propos', label: 'La Maison' },
  { href: '/blog', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const favCount = useFavorites((s) => s.ids.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'glass py-3' : 'bg-transparent py-5',
        )}
      >
        <div className="container-luxe flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2" aria-label="Accueil — RAF'YAM">
            <Logo />
            <div className="hidden sm:block">
              <div className="font-display text-xl font-medium tracking-wider">RAF&apos;YAM</div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-gold-300">Maison · Burkina Faso</div>
            </div>
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={pathname === n.href ? 'page' : undefined}
                className={cn(
                  'relative px-4 py-2 text-[13px] font-medium tracking-wider uppercase transition-colors hover:text-gold-300',
                  pathname === n.href ? 'text-gold-300' : 'text-bone-100',
                )}
              >
                {n.label}
                {pathname === n.href && <span className="absolute inset-x-4 -bottom-px h-px bg-gold-gradient" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} aria-label="Rechercher" className="rounded-full p-2.5 text-bone-100 transition-colors hover:bg-white/5 hover:text-gold-300">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/compte/favoris" aria-label="Favoris" className="relative hidden sm:inline-flex rounded-full p-2.5 text-bone-100 transition-colors hover:bg-white/5 hover:text-gold-300">
              <Heart className="h-5 w-5" />
              {favCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-ink-950">{favCount}</span>}
            </Link>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Changer le thème" className="rounded-full p-2.5 text-bone-100 transition-colors hover:bg-white/5 hover:text-gold-300">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link href="/compte" aria-label="Mon compte" className="hidden sm:inline-flex rounded-full p-2.5 text-bone-100 transition-colors hover:bg-white/5 hover:text-gold-300">
              <User className="h-5 w-5" />
            </Link>
            <CartButton count={cartCount} />
            <button onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} className="lg:hidden rounded-full p-2.5 text-bone-100 hover:bg-white/5">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={cn('fixed inset-0 z-40 lg:hidden transition-opacity duration-300', open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}>
        <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
        <nav className={cn('absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-ink-900 p-8 pt-24 transition-transform duration-500', open ? 'translate-x-0' : 'translate-x-full')} aria-label="Menu mobile">
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={cn('block py-3 font-display text-2xl tracking-wider transition-colors', pathname === n.href ? 'text-gold-300' : 'text-bone-100 hover:text-gold-300')}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="pt-6"><Link href="/compte" className="block py-3 text-sm uppercase tracking-widest text-ink-300 hover:text-gold-300">Mon compte</Link></li>
            <li><Link href="/compte/favoris" className="block py-3 text-sm uppercase tracking-widest text-ink-300 hover:text-gold-300">Favoris ({favCount})</Link></li>
          </ul>
        </nav>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function CartButton({ count }: { count: number }) {
  // Le drawer s'ouvre via le store global : on stocke un événement
  return (
    <button
      type="button"
      aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}
      onClick={() => window.dispatchEvent(new CustomEvent('rafyam:open-cart'))}
      className="relative rounded-full p-2.5 text-bone-100 transition-colors hover:bg-white/5 hover:text-gold-300"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-ink-950">{count}</span>
      )}
    </button>
  );
}

function Logo() {
  return (
    <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient font-display text-base font-bold text-ink-950 shadow-gold">
      RY
    </span>
  );
}

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Array<{ slug: string; name: string; priceCents: number; image: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const j = await r.json();
        setResults(j.products ?? []);
      } finally { setLoading(false); }
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={cn('fixed inset-0 z-[60] transition-opacity duration-300', open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')} role="dialog" aria-modal="true" aria-label="Recherche">
      <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
      <div className={cn('relative mx-auto mt-32 w-full max-w-2xl px-4 transition-transform duration-300', open ? 'translate-y-0' : '-translate-y-4')}>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Search className="h-5 w-5 text-gold-300" />
            <input
              autoFocus={open}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher une paire, une marque…"
              className="flex-1 bg-transparent text-lg text-bone-50 placeholder:text-ink-400 focus:outline-none"
              aria-label="Champ de recherche"
            />
            <button onClick={onClose} aria-label="Fermer" className="rounded p-1 text-ink-300 hover:text-gold-300"><X className="h-5 w-5" /></button>
          </div>
          <div className="max-h-96 overflow-y-auto pt-4">
            {loading && <p className="py-6 text-center text-sm text-ink-300">Recherche…</p>}
            {!loading && q && results.length === 0 && <p className="py-6 text-center text-sm text-ink-300">Aucun résultat.</p>}
            <ul className="space-y-2">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link href={`/produit/${r.slug}`} onClick={onClose} className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-white/5">
                    <img src={r.image} alt="" className="h-14 w-14 rounded object-cover" loading="lazy" />
                    <div className="flex-1">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-sm text-gold-300">{(r.priceCents / 100).toLocaleString('fr-FR')} FCFA</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}