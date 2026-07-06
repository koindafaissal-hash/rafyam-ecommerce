import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journal — Conseils & savoir-faire',
  description: 'Le journal RAF\'YAM : conseils d\'entretien, guides des tailles, focus sur les savoir-faire et nouveautés de la maison.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: 'desc' } });
  return (
    <>
      <header className="border-b border-white/5 py-16">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Journal</p>
          <h1 className="mt-2 font-display text-display-xl">Le <em className="text-gold-gradient not-italic">journal.</em></h1>
          <p className="mt-4 max-w-xl text-ink-300">Conseils d&apos;entretien, focus sur les savoir-faire, décryptages.</p>
        </div>
      </header>
      <section className="container-luxe py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="group">
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img src={p.coverImage ?? ''} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-widest text-gold-300">{new Date(p.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <h2 className="mt-2 font-display text-2xl transition-colors group-hover:text-gold-300">{p.title}</h2>
              <p className="mt-2 text-sm text-ink-300">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}