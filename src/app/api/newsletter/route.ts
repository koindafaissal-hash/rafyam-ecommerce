import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
const schema = z.object({ email: z.string().email() });
export async function POST(req: Request) {
  try {
    const { email } = schema.parse(await req.json());
    await prisma.newsletter.upsert({ where: { email: email.toLowerCase() }, update: { isActive: true }, create: { email: email.toLowerCase() } });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}