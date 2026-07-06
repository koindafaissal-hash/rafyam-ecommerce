import Link from 'next/link';
import { Instagram, Facebook, Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-ink-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" aria-hidden="true" />
      <div className="container-luxe py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient font-display text-lg font-bold text-ink-950 shadow-gold">RY</span>
              <div>
                <div className="font-display text-2xl tracking-wider">RAF&apos;YAM</div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-gold-300">Maison · Burkina Faso</div>
              </div>
            </Link>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-300">
              La maison RAF&apos;YAM sélectionne avec passion les plus belles chaussures de luxe pour hommes, en alliant tradition artisanale et exigences contemporaines. Notre boutique vous accueille au cœur d&apos;Ouagadougou.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <SocialLink href={SITE.social.instagram} label="Instagram"><Instagram className="h-4 w-4" /></SocialLink>
              <SocialLink href={SITE.social.facebook} label="Facebook"><Facebook className="h-4 w-4" /></SocialLink>
              <SocialLink href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}`} label="WhatsApp"><Send className="h-4 w-4" /></SocialLink>
            </div>
          </div>

          <FooterCol title="Boutique" links={[
            { href: '/boutique', label: 'Tous les produits' },
            { href: '/categories', label: 'Catégories' },
            { href: '/nouveautes', label: 'Nouveautés' },
            { href: '/meilleures-ventes', label: 'Meilleures ventes' },
            { href: '/promotions', label: 'Promotions' },
          ]} />

          <FooterCol title="La Maison" links={[
            { href: '/a-propos', label: 'Notre histoire' },
            { href: '/blog', label: 'Journal' },
            { href: '/faq', label: 'Questions fréquentes' },
            { href: '/contact', label: 'Nous contacter' },
          ]} />

          <FooterCol title="Assistance" links={[
            { href: '/livraison', label: 'Livraison & retours' },
            { href: '/guide-des-tailles', label: 'Guide des tailles' },
            { href: '/entretien', label: 'Entretien des cuirs' },
            { href: '/cgv', label: 'CGV' },
            { href: '/mentions-legales', label: 'Mentions légales' },
            { href: '/politique-confidentialite', label: 'Confidentialité' },
          ]} />

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.25em] text-gold-300">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-ink-200">
              <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-300" /><a href={`tel:${SITE.phoneRaw}`} className="hover:text-gold-300">{SITE.phone}</a></li>
              <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-300" /><a href={`mailto:${SITE.email}`} className="hover:text-gold-300 break-all">{SITE.email}</a></li>
              <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-300" /><span>{SITE.address}</span></li>
              <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-300" /><span className="text-ink-300">{SITE.hours}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-ink-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {SITE.name} — Tous droits réservés. Conçu et développé avec passion à Ouagadougou.</p>
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ink-500">
            <span className="rounded border border-white/10 px-2 py-1">Orange Money</span>
            <span className="rounded border border-white/10 px-2 py-1">Moov Money</span>
            <span className="rounded border border-white/10 px-2 py-1">Wave</span>
            <span className="rounded border border-white/10 px-2 py-1">Visa</span>
            <span className="rounded border border-white/10 px-2 py-1">Mastercard</span>
            <span className="rounded border border-white/10 px-2 py-1">Paiement à la livraison</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="lg:col-span-2">
      <h3 className="text-xs uppercase tracking-[0.25em] text-gold-300">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ink-200 transition-colors hover:text-gold-300">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
       className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-bone-100 transition-all hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950">
      {children}
    </a>
  );
}