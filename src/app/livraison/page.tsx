import type { Metadata } from 'next';
import { Truck, Globe, Clock, MapPin } from 'lucide-react';
export const metadata: Metadata = { title: 'Livraison & retours' };

export default function ShippingPage() {
  return (
    <article className="container-luxe py-16">
      <header className="mb-12"><h1 className="font-display text-display-lg">Livraison & <em className="text-gold-gradient not-italic">retours.</em></h1></header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Clock, title: '24h à Ouaga', desc: 'Livraison à votre domicile ou bureau dès le lendemain.' },
          { icon: MapPin, title: '72h au Burkina', desc: 'Livraison dans toutes les grandes villes du pays.' },
          { icon: Globe, title: 'UEMOA & monde', desc: 'Expédition vers l\'étranger sur devis.' },
          { icon: Truck, title: 'Retours 14 jours', desc: 'Échange et retour gratuits sous 14 jours.' },
        ].map((it) => (
          <div key={it.title} className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/30 text-gold-300"><it.icon className="h-5 w-5" /></span>
            <h3 className="mt-4 font-display text-xl">{it.title}</h3>
            <p className="mt-2 text-sm text-ink-300">{it.desc}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-invert mt-16 max-w-3xl space-y-6 text-ink-200">
        <Section title="Tarifs">La livraison est offerte à partir de 1 000 000 FCFA d&apos;achat. En dessous, elle est facturée 2 000 FCFA à Ouagadougou et 3 000 FCFA dans le reste du pays.</Section>
        <Section title="Suivi">Vous recevez un message WhatsApp et un email avec le suivi de votre commande dès son expédition. Notre équipe vous appelle pour confirmer le créneau de livraison.</Section>
        <Section title="Retours">Vous disposez de 14 jours après réception pour retourner un article non porté. Contactez-nous sur WhatsApp, nous organisons le retrait à votre domicile. Le remboursement est effectué sous 7 jours ouvrés après vérification.</Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (<section><h2 className="font-display text-xl text-gold-300">{title}</h2><p className="mt-2 leading-relaxed">{children}</p></section>);
}