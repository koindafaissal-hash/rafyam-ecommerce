import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, publishedAt: true } }),
  ]);

  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE.url}/boutique`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE.url}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/a-propos`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/livraison`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.url}/guide-des-tailles`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.url}/entretien`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.url}/cgv`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/mentions-legales`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/politique-confidentialite`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  return [
    ...staticPages,
    ...categories.map((c) => ({ url: `${SITE.url}/boutique?categorie=${c.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...products.map((p) => ({ url: `${SITE.url}/produit/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: p.publishedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}