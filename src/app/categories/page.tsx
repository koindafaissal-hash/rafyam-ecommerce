import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toutes les catégories — RAF\'YAM',
  description: 'Explorez l\'ensemble de nos univers : richelieus, mocassins, derbies, bottines, sneakers luxe et sandales premium.',
};

const CATEGORY_IMG: Record<string, string> = {
  'chaussures-de-ville': 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=1400&q=85&auto=format&fit=crop',
  'mocassins': 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=1400&q=85&auto=format&fit=crop',
  'derbies': 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=1400&q=85&auto=format&fit=crop',
  'richelieus': 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1400&q=85&auto=format&fit=crop',
  'bottines': 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=1400&q=85&auto=format&fit=crop',
  'sneakers-luxe': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=85&auto=format&fit=crop',
  'sandales-premium': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1400&q=85&auto=format&fit=crop',
};

export default async function CategoriesPage() {
  const cats = await prisma.category.findMany({ where: { isActive: true }, orderBy: { position: 'asc' }, include: { _count: { select: { products: true } } } });
  return (
    <>
      <header className="border-b border-white/5 py-16">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Univers</p>
          <h1 className="mt-2 font-display text-display-xl">Toutes les <em className="text-gold-gradient not-italic">catégories.</em></h1>
          <p className="mt-4 max-w-xl text-ink-300">Chaque univers a ses codes, ses matières, ses saisons. Trouvez le vôtre.</p>
        </div>
      </header>
      <section className="container-luxe py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <Link key={c.slug} href={`/boutique?categorie=${c.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-lg">
              <img src={CATEGORY_IMG[c.slug] ?? CATEGORY_IMG['chaussures-de-ville']} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h2 className="font-display text-2xl">{c.name}</h2>
                <p className="mt-1 text-sm text-ink-200">{c.description}</p>
                <p className="mt-3 text-[10px] uppercase tracking-widest text-gold-300">{c._count.products} pièces →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}