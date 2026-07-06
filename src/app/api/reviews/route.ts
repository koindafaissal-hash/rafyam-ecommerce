import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const schema = z.object({ productId: z.string(), rating: z.number().int().min(1).max(5), title: z.string().min(1), comment: z.string().min(1) });

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Connectez-vous pour publier un avis' }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const review = await prisma.review.create({
      data: { ...data, userId: user.id, isApproved: true },
    });
    const agg = await prisma.review.aggregate({ where: { productId: data.productId }, _avg: { rating: true }, _count: true });
    await prisma.product.update({ where: { id: data.productId }, data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count } });
    return NextResponse.json({ ok: true, id: review.id });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}