import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const itemSchema = z.object({
  productId: z.string(), variantId: z.string(), slug: z.string(), name: z.string(), image: z.string(),
  size: z.string(), color: z.string(), unitPriceCents: z.number(), quantity: z.number().int().positive(),
});

const schema = z.object({
  fullName: z.string().min(1), email: z.string().email(), phone: z.string().min(6),
  address: z.string().min(1), city: z.string().min(1), region: z.string().optional(), country: z.string().default('Burkina Faso'),
  delivery: z.enum(['standard', 'express', 'relay']),
  payment: z.enum(['cod', 'orange', 'moov', 'wave', 'card']),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const user = await getCurrentUser();

    const subtotalCents = data.items.reduce((a, i) => a + i.unitPriceCents * i.quantity, 0);
    const shippingCents = subtotalCents >= 100000_00 ? 0 : 2000_00;
    const taxCents = Math.round(subtotalCents * 0.18 / 1.18);
    const totalCents = subtotalCents + shippingCents;

    const number = 'RFY-' + Date.now().toString(36).toUpperCase();

    // Pour Stripe / Orange / Moov / Wave : ici viendrait l'init du paiement.
    // Pour ce template, tous les paiements non-COD sont marqués PENDING.

    const order = await prisma.order.create({
      data: {
        number, userId: user?.id ?? null,
        email: data.email, fullName: data.fullName, phone: data.phone,
        subtotalCents, shippingCents, taxCents, totalCents, currency: 'XOF',
        status: 'PENDING', paymentStatus: 'PENDING',
        paymentMethod: ({ cod: 'COD', orange: 'ORANGE_MONEY', moov: 'MOOV_MONEY', wave: 'WAVE', card: 'STRIPE' } as const)[data.payment],
        notes: data.notes,
        items: {
          create: data.items.map((it) => ({
            productId: it.productId, variantId: it.variantId,
            quantity: it.quantity, unitPriceCents: it.unitPriceCents,
            size: it.size, color: it.color,
          })),
        },
      },
    });

    return NextResponse.json({ ok: true, number: order.number, id: order.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Erreur' }, { status: 400 });
  }
}