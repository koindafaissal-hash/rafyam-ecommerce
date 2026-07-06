import Link from 'next/link';
import { Award, Globe, Heart, Sparkles, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'La Maison RAF\'YAM — Notre histoire',
  description: 'Découvrez l\'histoire, la vision et les valeurs de la maison RAF\'YAM, votre référence en chaussures de luxe à Ouagadougou.',
};

const VALUES = [
  { icon: Sparkles, title: 'Exigence', text: 'Nous refusons tout compromis sur la qualité des matières, la précision des finitions et la noblesse des formes.' },
  { icon: Heart, title: 'Passion', text: 'Chaque paire est choisie pour ce qu\'elle raconte : une rencontre entre un savoir-faire ancestral et une silhouette contemporaine.' },
  { icon: Users, title: 'Proximité', text: 'Notre boutique d\'Ouagadougou est un lieu de conseil, d\'écoute et de transmission. Nous accompagnons chaque client comme un hôte.' },
  { icon: Globe, title: 'Ouverture', text: 'Du cousu Goodyear florentin au sneaker milanais, nous parcourons l\'Europe pour ramener à Ouaga ce qui se fait de mieux.' },
  { icon: Award, title: 'Durabilité', text: 'Une belle paire se transmet. Nous sélectionnons des chaussures qui vieillissent avec panache et se ressemellent sans limite.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative -mt-20 flex min-h-[80vh] items-end overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2400&q=85&auto=format&fit=crop" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/30" />
        </div>
        <div className="container-luxe relative z-10 pb-20 pt-40">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold-300">La Maison</p>
          <h1 className="font-display text-display-2xl max-w-3xl text-balance">Une <em className="text-gold-gradient not-italic">passion</em> devenue maison.</h1>
        </div>
      </section>

      <section className="container-luxe py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-display text-display-lg">Notre histoire</h2>
          <div className="space-y-6 text-lg leading-relaxed text-ink-200">
            <p>RAF&apos;YAM est née à Ouagadougou, d&apos;une conviction simple : l&apos;élégance ne devrait jamais être un privilège. En 2019, notre fondateur parcourt les ateliers toscans et milanais pour comprendre ce qui fait la grandeur d&apos;une chaussure. Il en revient avec une obsession : offrir au Burkina Faso l&apos;accès aux plus belles pièces de la bottellerie européenne, sans compromis sur la qualité, sans détour par l&apos;à-peu-près.</p>
            <p>La maison ouvre sa première boutique derrière le siège de SIDWAYA. L&apos;endroit est discret, presque confidentiel — comme les grandes maisons italiennes que nous admirons. On y vient sur rendez-vous, on y est reçu avec le temps qu&apos;il faut, on y trouve des pièces que l&apos;on ne voit nulle part ailleurs dans le pays.</p>
            <p>Aujourd&apos;hui, RAF&apos;YAM est une référence pour tous ceux qui considèrent la chaussure comme la fondation du style. Nous sélectionnons, nous conseillons, nous accompagnons — et nous restons convaincus qu&apos;une belle paire, c&apos;est d&apos;abord une rencontre.</p>
          </div>
        </div>
      </section>

      <section className="container-luxe grid gap-12 border-y border-white/5 py-20 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Vision</p>
          <h2 className="mt-2 font-display text-display-lg text-balance">Devenir la <em className="text-gold-gradient not-italic">référence</em> de la chaussure de luxe en Afrique de l&apos;Ouest.</h2>
        </div>
        <div className="text-lg leading-relaxed text-ink-200">
          <p>Nous voulons que chaque homme africain qui aspire à l&apos;excellence puisse chausser les plus belles pièces du monde, accompagné par des conseils précis et un service à la hauteur des plus grandes maisons. Notre ambition : faire de Ouagadougou une étape incontournable du luxe discret et exigeant.</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-luxe">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Valeurs</p>
            <h2 className="mt-2 font-display text-display-lg text-balance">Cinq principes, <em className="text-gold-gradient not-italic">une signature.</em></h2>
            <div className="divider-luxe mt-6" />
          </header>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <article key={v.title} className="group rounded-lg border border-white/5 bg-ink-900/60 p-8 transition-all hover:border-gold-500/40">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/30 text-gold-300 transition-all group-hover:bg-gold-gradient group-hover:text-ink-950">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-ink-900/40">
        <div className="container-luxe grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Pourquoi nous choisir</p>
            <h2 className="mt-2 font-display text-display-lg text-balance">Une maison <em className="text-gold-gradient not-italic">à taille humaine.</em></h2>
            <p className="mt-6 leading-relaxed text-ink-200">Nous ne sommes pas une marketplace impersonnelle. Nous sommes une équipe de passionnés qui sélectionne, conseille et accompagne. Chaque paire qui sort de notre boutique a été vue, touchée, validée. Et chaque client qui pousse notre porte devient un habitué.</p>
            <ul className="mt-8 space-y-3 text-sm text-ink-200">
              <li>✓ Sélection exclusive, jamais distribuée en grande surface</li>
              <li>✓ Conseil personnalisé par WhatsApp avant et après achat</li>
              <li>✓ Garantie authenticité de deux ans sur toutes les pièces</li>
              <li>✓ Reprise et revente de vos paires d&apos;occasion</li>
              <li>✓ Entretien et patine réalisés par notre atelier</li>
            </ul>
            <Link href="/boutique" className="btn-primary mt-10">Explorer la collection</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80&auto=format&fit=crop" alt="Atelier" loading="lazy" className="aspect-[3/4] rounded-lg object-cover" />
            <img src="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=900&q=80&auto=format&fit=crop" alt="Boutique" loading="lazy" className="aspect-[3/4] mt-12 rounded-lg object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}