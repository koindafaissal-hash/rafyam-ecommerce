import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  if (!q) return NextResponse.json({ products: [] });
  const products = await prisma.product.findMany({
    where: { isActive: true, OR: [{ name: { contains: q } }, { shortDescription: { contains: q } }] },
    take: 8,
    include: { images: { take: 1 } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({
    products: products.map((p) => ({ id: p.id, slug: p.slug, name: p.name, priceCents: p.priceCents, image: p.images[0]?.url ?? '' })),
  });
}