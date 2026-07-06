import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Conditions Générales de Vente' };

export default function CgvPage() {
  return (
    <article className="container-luxe py-16">
      <header className="mb-12"><h1 className="font-display text-display-lg">Conditions Générales de <em className="text-gold-gradient not-italic">Vente.</em></h1></header>
      <div className="prose prose-invert max-w-3xl space-y-6 text-ink-200">
        <Section title="1. Identité">RAF&apos;YAM — Boutique située derrière le siège de SIDWAYA, Ouagadougou, Burkina Faso. Téléphone : +226 57 95 50 90. Email : contact@rafyam.bf.</Section>
        <Section title="2. Prix">Les prix sont affichés en Francs CFA (FCFA / XOF), TTC. Les frais de livraison sont indiqués avant la validation de la commande. RAF&apos;YAM se réserve le droit de modifier ses prix à tout moment, les commandes étant facturées au tarif en vigueur au moment de la validation.</Section>
        <Section title="3. Commande">Toute commande vaut acceptation des présentes CGV et des prix affichés. La commande est réputée acceptée à réception du paiement ou, pour le paiement à la livraison, à la confirmation par notre équipe. RAF&apos;YAM se réserve le droit de refuser une commande pour motif légitime.</Section>
        <Section title="4. Paiement">Le paiement s&apos;effectue par Orange Money, Moov Money, Wave, carte bancaire (Visa, Mastercard via Stripe sécurisé), ou en espèces à la livraison. Le paiement à la livraison est disponible pour tout le Burkina Faso.</Section>
        <Section title="5. Livraison">Les commandes sont expédiées sous 24 heures à Ouagadougou et sous 72 heures dans le reste du pays. Les délais sont communiqués à titre indicatif. En cas de force majeure, RAF&apos;YAM ne saurait être tenu responsable des retards.</Section>
        <Section title="6. Rétractation et retours">Conformément à la réglementation, vous disposez d&apos;un délai de 14 jours à compter de la réception pour exercer votre droit de rétractation, sans motif. Les articles doivent être retournés dans leur état et emballage d&apos;origine, non portés. Les frais de retour sont pris en charge par RAF&apos;YAM.</Section>
        <Section title="7. Garantie">Tous les produits bénéficient d&apos;une garantie d&apos;authenticité de deux ans. Les défauts de fabrication constatés dans ce délai donnent lieu à échange ou remboursement intégral.</Section>
        <Section title="8. Données personnelles">Vos données sont traitées conformément à notre politique de confidentialité. Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression.</Section>
        <Section title="9. Réclamations">Toute réclamation doit être adressée à contact@rafyam.bf ou via WhatsApp au +226 57 95 50 90. En cas de litige, le tribunal compétent est celui de Ouagadougou, droit burkinabè applicable.</Section>
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