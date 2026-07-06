import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';

const schema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  try {
    const body = schema.parse(await req.json());
    const data: any = {};
    if (body.firstName) data.firstName = body.firstName;
    if (body.lastName) data.lastName = body.lastName;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.newPassword) {
      if (!body.currentPassword) return NextResponse.json({ error: 'Mot de passe actuel requis' }, { status: 400 });
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      const ok = await verifyPassword(body.currentPassword, dbUser!.passwordHash);
      if (!ok) return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });
      data.passwordHash = await hashPassword(body.newPassword);
    }
    await prisma.user.update({ where: { id: user.id }, data });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}