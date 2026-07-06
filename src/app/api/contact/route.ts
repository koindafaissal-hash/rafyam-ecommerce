import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
const schema = z.object({ name: z.string().min(1), email: z.string().email(), phone: z.string().optional(), subject: z.string().min(1), message: z.string().min(1) });
export async function POST(req: Request) {
  try {
    const data = schema.parse(await req.json());
    await prisma.contactMessage.create({ data });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}