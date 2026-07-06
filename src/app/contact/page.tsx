import { ContactForm } from '@/components/marketing/ContactForm';
import { SITE } from '@/lib/site';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nous contacter',
  description: 'Notre équipe est à votre écoute. Boutique à Ouagadougou, Burkina Faso. WhatsApp, téléphone, email.',
};

export default function ContactPage() {
  return (
    <>
      <header className="border-b border-white/5 py-16">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Contact</p>
          <h1 className="mt-2 font-display text-display-xl">Parlons <em className="text-gold-gradient not-italic">ensemble.</em></h1>
          <p className="mt-4 max-w-xl text-ink-300">Notre équipe vous répond sous 1 heure en moyenne, du lundi au samedi.</p>
        </div>
      </header>
      <section className="container-luxe py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <div>
            <ContactForm />
          </div>
          <aside className="space-y-6">
            <InfoCard icon={Phone} label="Téléphone" value={SITE.phone} href={`tel:${SITE.phoneRaw}`} />
            <InfoCard icon={MessageCircle} label="WhatsApp" value="Discuter maintenant" href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}`} />
            <InfoCard icon={Mail} label="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
            <InfoCard icon={MapPin} label="Boutique" value={SITE.address} />
            <InfoCard icon={Clock} label="Horaires" value={SITE.hours} />
            <div className="overflow-hidden rounded-lg border border-white/5">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`}
                width="100%" height="240" loading="lazy"
                style={{ border: 0, filter: 'invert(0.92) hue-rotate(180deg) saturate(0.6)' }}
                title="Carte Google Maps"
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function InfoCard({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-4 rounded-lg border border-white/5 bg-ink-900/40 p-5 transition-all hover:border-gold-500/40">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-300"><Icon className="h-5 w-5" /></span>
      <div>
        <p className="text-xs uppercase tracking-widest text-gold-300">{label}</p>
        <p className="mt-1 text-sm text-bone-100">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{inner}</a> : inner;
}