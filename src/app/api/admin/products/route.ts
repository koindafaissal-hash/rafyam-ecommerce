import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  shortDescription: z.string().default(''),
  description: z.string().default(''),
  priceXof: z.coerce.number().positive(),
  comparePriceXof: z.coerce.number().optional(),
  categoryId: z.string(),
  brandId: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  images: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export async function GET() {
  await requireAdmin();
  const products = await prisma.product.findMany({ include: { category: true, brand: true, images: true, _count: { select: { variants: true } } }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 }); }
  try {
    const body = schema.parse(await req.json());
    const slug = body.slug || slugify(body.name);
    const sku = 'RFY-' + slug.slice(0, 8).toUpperCase();
    const product = await prisma.product.create({
      data: {
        name: body.name, slug, sku,
        shortDescription: body.shortDescription, description: body.description,
        priceCents: Math.round(body.priceXof * 100),
        comparePriceCents: body.comparePriceXof ? Math.round(body.comparePriceXof * 100) : null,
        categoryId: body.categoryId, brandId: body.brandId || null,
        isFeatured: body.isFeatured, isNew: body.isNew, isBestseller: body.isBestseller, isActive: body.isActive,
        metaTitle: body.metaTitle, metaDescription: body.metaDescription,
        images: { create: body.images.filter(Boolean).map((url, i) => ({ url, alt: body.name, position: i })) },
      },
    });
    return NextResponse.json({ ok: true, id: product.id });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}