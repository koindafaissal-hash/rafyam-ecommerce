import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Commande confirmée', robots: { index: false } };

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  const o = order ? await prisma.order.findUnique({ where: { number: order } }) : null;
  return (
    <section className="container-luxe py-20">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-400" />
        <h1 className="mt-6 font-display text-display-lg text-balance">Merci pour votre <em className="text-gold-gradient not-italic">confiance.</em></h1>
        <p className="mt-4 text-lg text-ink-200">
          Votre commande {o ? <strong className="text-gold-300">{o.number}</strong> : ''} a bien été enregistrée. Un email de confirmation vient de vous être envoyé.
        </p>
        <div className="mt-8 rounded-lg border border-white/5 bg-ink-900/40 p-6 text-left">
          <h2 className="font-display text-xl">Et maintenant&nbsp;?</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-200">
            <li>1. Notre équipe prépare votre commande avec le plus grand soin.</li>
            <li>2. Vous recevez un appel ou un message WhatsApp pour confirmer la livraison.</li>
            <li>3. Nous livrons à Ouagadougou sous 24h, partout au Burkina sous 72h.</li>
            <li>4. Pour toute question, contactez-nous au +226 57 95 50 90.</li>
          </ul>
        </div>
        <div className="mt-10 flex justify-center gap-3">
          <Link href="/boutique" className="btn-primary">Continuer mes achats</Link>
          {o && <Link href={`/compte/commandes/${o.id}`} className="btn-outline">Voir ma commande</Link>}
        </div>
      </div>
    </section>
  );
}