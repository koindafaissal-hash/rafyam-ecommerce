import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const schema = z.object({
  code: z.string().min(2).transform((s) => s.toUpperCase()),
  type: z.enum(['PERCENT', 'FIXED']),
  value: z.coerce.number().positive(),
  minSubtotalXof: z.coerce.number().default(0),
  daysValid: z.coerce.number().int().min(1).default(30),
});

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 }); }
  try {
    const body = schema.parse(await req.json());
    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + body.daysValid * 24 * 60 * 60 * 1000);
    const promo = await prisma.promoCode.create({
      data: {
        code: body.code, type: body.type, value: body.type === 'PERCENT' ? Math.round(body.value) : Math.round(body.value * 100),
        minSubtotalCents: Math.round(body.minSubtotalXof * 100),
        startsAt, endsAt, isActive: true,
      },
    });
    return NextResponse.json({ ok: true, id: promo.id });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}