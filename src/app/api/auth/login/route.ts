import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signSession, setSessionCookie } from '@/lib/auth';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    const token = await signSession({ sub: user.id, email: user.email, role: user.role });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, role: user.role });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}