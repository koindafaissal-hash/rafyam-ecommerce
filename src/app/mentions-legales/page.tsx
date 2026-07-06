import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Mentions légales' };

export default function MentionsPage() {
  return (
    <article className="container-luxe py-16">
      <header className="mb-12"><h1 className="font-display text-display-lg">Mentions <em className="text-gold-gradient not-italic">légales.</em></h1></header>
      <div className="prose prose-invert max-w-3xl space-y-6 text-ink-200">
        <Section title="Éditeur">RAF&apos;YAM — Boutique de chaussures de luxe pour hommes. Siège : derrière le siège de SIDWAYA, Ouagadougou, Burkina Faso. Téléphone : +226 57 95 50 90. Email : contact@rafyam.bf.</Section>
        <Section title="Hébergement">Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA. La base de données est hébergée via le service de base de données de Vercel / Neon selon la configuration de production.</Section>
        <Section title="Propriété intellectuelle">L&apos;ensemble des éléments du site (textes, photographies, logos, codes, structure) est protégé par le droit d&apos;auteur et demeure la propriété exclusive de RAF&apos;YAM. Toute reproduction est interdite sans autorisation préalable.</Section>
        <Section title="Crédits photos">Les photographies de produits et d&apos;ambiance proviennent de banques d&apos;images libres de droits (Unsplash) et seront progressivement remplacées par les visuels officiels de la maison.</Section>
        <Section title="Contact">Pour toute question relative au site : contact@rafyam.bf · +226 57 95 50 90.</Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl text-gold-300">{title}</h2>
      <p className="mt-2 leading-relaxed">{children}</p>
    </section>
  );
}