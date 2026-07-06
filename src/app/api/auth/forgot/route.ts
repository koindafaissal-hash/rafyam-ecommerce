import { NextResponse } from 'next/server';
import { z } from 'zod';
const schema = z.object({ email: z.string().email() });
export async function POST(req: Request) {
  try {
    const { email } = schema.parse(await req.json());
    // En production : envoyer un email avec un token de reset signé.
    console.log('[forgot] reset link would be sent to', email);
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}