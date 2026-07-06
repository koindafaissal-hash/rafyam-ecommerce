import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Entretien des cuirs' };

export default function CarePage() {
  return (
    <article className="container-luxe py-16">
      <header className="mb-12"><h1 className="font-display text-display-lg">L&apos;art d&apos;<em className="text-gold-gradient not-italic">entretenir</em> vos souliers.</h1></header>
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { t: '1. Alternez', d: 'Ne portez jamais deux jours de suite la même paire. Laissez le cuir reposer 24 heures pour évacuer l\'humidité.' },
          { t: '2. Embauchoirs', d: 'Placez des embauchoirs en cèdre dès que vous retirez vos chaussures. Ils conservent la forme et absorbent l\'humidité.' },
          { t: '3. Crème nourrissante', d: 'Tous les 15 jours, appliquez une crème de qualité avec un chiffon doux, par mouvements circulaires. Laissez sécher 15 minutes.' },
          { t: '4. Cirage', d: 'Appliquez une fine couche de cirage en pâte assorti à la couleur. Laissez sécher, puis lustrez à la brosse en soie.' },
          { t: '5. Cuir grainé', d: 'Utilisez une brosse à reluire en crin de cheval pour ne pas lisser le grain. Crème plutôt que cirage pour ne pas tasser la matière.' },
          { t: '6. Cuir velours', d: 'Brossez toujours dans le sens du poil avec une brosse spéciale daim. Utilisez un spray imperméabilisant tous les deux mois.' },
        ].map((s) => (
          <div key={s.t} className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
            <h2 className="font-display text-xl text-gold-300">{s.t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-200">{s.d}</p>
          </div>
        ))}
      </div>
      <p className="mt-12 text-sm text-ink-300">Pour un entretien complet ou un resemelage, confiez-nous vos chaussures : atelier@maison.bf · +226 57 95 50 90.</p>
    </article>
  );
}