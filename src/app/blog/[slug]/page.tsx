import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.blogPost.findUnique({ where: { slug } });
  if (!p) return { title: 'Article introuvable' };
  return { title: p.title, description: p.excerpt, openGraph: { images: p.coverImage ? [p.coverImage] : [] } };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) notFound();
  return (
    <article>
      <header className="relative flex min-h-[60vh] items-end overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={post.coverImage ?? ''} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
        </div>
        <div className="container-luxe relative z-10 pb-12 pt-40">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">{new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h1 className="mt-2 max-w-3xl font-display text-display-xl text-balance">{post.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-200">{post.excerpt}</p>
        </div>
      </header>
      <section className="container-luxe py-16">
        <div className="prose prose-invert mx-auto max-w-3xl">
          {post.content.split('\n').map((p, i) => <p key={i} className="mb-6 leading-relaxed text-ink-200">{p}</p>)}
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <Link href="/blog" className="text-xs uppercase tracking-widest text-gold-300 hover:text-gold-200">← Retour au journal</Link>
        </div>
      </section>
    </article>
  );
}