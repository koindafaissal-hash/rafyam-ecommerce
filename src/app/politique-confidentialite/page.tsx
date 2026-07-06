import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Politique de confidentialité' };

export default function PrivacyPage() {
  return (
    <article className="container-luxe py-16">
      <header className="mb-12"><h1 className="font-display text-display-lg">Politique de <em className="text-gold-gradient not-italic">confidentialité.</em></h1></header>
      <div className="prose prose-invert max-w-3xl space-y-6 text-ink-200">
        <Section title="Responsable de traitement">RAF&apos;YAM, boutique située derrière le siège de SIDWAYA, Ouagadougou, Burkina Faso. Contact DPO : contact@rafyam.bf.</Section>
        <Section title="Données collectées">Nous collectons les données strictement nécessaires : identité (nom, prénom), email, téléphone, adresses de livraison, historique de commandes, données de paiement (transitant uniquement par nos prestataires sécurisés), et données de navigation (cookies analytiques anonymisés).</Section>
        <Section title="Finalités">Les données sont utilisées pour le traitement et la livraison de vos commandes, la gestion de votre compte client, l&apos;envoi de communications marketing (avec votre consentement), l&apos;amélioration de nos services et le respect de nos obligations légales.</Section>
        <Section title="Durée de conservation">Vos données sont conservées pendant toute la durée de la relation commerciale et 3 ans après la dernière interaction. Les données comptables sont conservées 10 ans conformément aux obligations légales.</Section>
        <Section title="Vos droits">Conformément à la loi, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;opposition, de suppression, de portabilité et de limitation. Pour exercer ces droits : contact@rafyam.bf.</Section>
        <Section title="Cookies">Nous utilisons des cookies strictement nécessaires au fonctionnement du site et des cookies analytiques anonymisés (Vercel Analytics, aucune donnée personnelle). Aucun cookie publicitaire tiers.</Section>
        <Section title="Sécurité">Vos données sont chiffrées en transit (HTTPS/TLS) et au repos. Les paiements sont délégués à des prestataires certifiés PCI-DSS (Stripe, opérateurs Mobile Money). Aucune donnée de carte bancaire n&apos;est stockée sur nos serveurs.</Section>
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