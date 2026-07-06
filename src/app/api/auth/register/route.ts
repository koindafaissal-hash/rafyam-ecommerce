import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, signSession, setSessionCookie } from '@/lib/auth';

const schema = z.object({
  firstName: z.string().min(1), lastName: z.string().min(1),
  email: z.string().email(), phone: z.string().optional(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (exists) return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });
    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: { ...data, email: data.email.toLowerCase(), passwordHash, role: 'CUSTOMER' },
    });
    const token = await signSession({ sub: user.id, email: user.email, role: user.role });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}