import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  priceXof: z.coerce.number().positive().optional(),
  comparePriceXof: z.coerce.number().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().nullable().optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isActive: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 }); }
  try {
    const { id } = await params;
    const body = schema.parse(await req.json());
    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription;
    if (body.description !== undefined) data.description = body.description;
    if (body.priceXof !== undefined) data.priceCents = Math.round(body.priceXof * 100);
    if (body.comparePriceXof !== undefined) data.comparePriceCents = body.comparePriceXof ? Math.round(body.comparePriceXof * 100) : null;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.brandId !== undefined) data.brandId = body.brandId || null;
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;
    if (body.isNew !== undefined) data.isNew = body.isNew;
    if (body.isBestseller !== undefined) data.isBestseller = body.isBestseller;
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.metaTitle !== undefined) data.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) data.metaDescription = body.metaDescription;
    if (body.images !== undefined) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (body.images.length) {
        await prisma.productImage.createMany({ data: body.images.filter(Boolean).map((url, i) => ({ productId: id, url, alt: data.name ?? '', position: i })) });
      }
    }
    await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 }); }
  const { id } = await params;
  await prisma.orderItem.deleteMany({ where: { productId: id } });
  await prisma.favorite.deleteMany({ where: { productId: id } });
  await prisma.review.deleteMany({ where: { productId: id } });
  await prisma.productVariant.deleteMany({ where: { productId: id } });
  await prisma.productImage.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}