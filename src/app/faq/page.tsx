import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Questions fréquentes',
  description: 'Toutes les réponses aux questions sur nos chaussures, la livraison, les retours et le paiement.',
};

const FAQ = [
  { q: 'Comment choisir ma pointure ?', a: 'Nous vous recommandons de mesurer votre pied en fin de journée, debout, en charge. Ajoutez 5 à 8 mm à cette mesure pour le confort. Notre guide des tailles détaille les correspondances EU/UK/US. Notre équipe reste disponible par WhatsApp pour vous conseiller.' },
  { q: 'Combien de temps pour recevoir ma commande ?', a: 'À Ouagadougou, nous livrons sous 24 heures. Dans les autres villes du Burkina Faso, comptez 48 à 72 heures. Pour les commandes spéciales, nous convenons ensemble du délai.' },
  { q: 'Puis-je payer à la livraison ?', a: 'Oui, le paiement à la livraison en espèces est disponible partout au Burkina Faso. Nous acceptons également Orange Money, Moov Money, Wave, Visa et Mastercard.' },
  { q: 'Comment se passe un échange ou un retour ?', a: 'Vous disposez de 14 jours après réception pour échanger ou retourner un article non porté, dans son emballage d\'origine. Contactez-nous par WhatsApp, nous organisons le retrait à votre domicile.' },
  { q: 'Vos produits sont-ils authentiques ?', a: 'Chaque pièce est sélectionnée directement auprès des grandes maisons italiennes, espagnoles et françaises, ou conçue dans notre propre atelier. Nous garantissons l\'authenticité de toutes nos chaussures pendant deux ans.' },
  { q: 'Comment entretenir mes chaussures en cuir ?', a: 'Alternez les paires pour les laisser reposer au moins 24 heures. Utilisez des embauchoirs en cèdre. Nourrissez le cuir tous les mois avec une crème adaptée. Cirage à la brosse en soie pour la brillance. Notre guide d\'entretien détaille tout cela.' },
  { q: 'Proposez-vous des patines et resemelages ?', a: 'Oui, notre atelier propose patine, cirage, resemelage cousu Goodyear et petites réparations. Comptez 2 à 4 semaines selon le service.' },
  { q: 'Puis-je venir essayer en boutique ?', a: 'Absolument. Notre boutique est située derrière le siège de SIDWAYA à Ouagadougou. Nous recommandons de venir sur rendez-vous pour être reçu dans les meilleures conditions. Vous pouvez aussi nous écrire sur WhatsApp avant de passer.' },
  { q: 'Livrez-vous en dehors du Burkina Faso ?', a: 'Oui, nous expédions dans toute l\'UEMOA et au-delà sur demande. Les frais et délais varient selon la destination. Contactez-nous pour un devis.' },
  { q: 'Comment utiliser un code promo ?', a: 'Le code se saisit à l\'étape « Paiement » de votre commande. La réduction s\'applique automatiquement si le montant minimum est atteint. Les codes sont cumulables ou non selon les campagnes.' },
];

export default function FAQPage() {
  return (
    <>
      <header className="border-b border-white/5 py-16">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Questions fréquentes</p>
          <h1 className="mt-2 font-display text-display-xl">Toutes les <em className="text-gold-gradient not-italic">réponses.</em></h1>
        </div>
      </header>
      <section className="container-luxe py-16">
        <div className="mx-auto max-w-3xl">
          <FAQAccordion items={FAQ} />
        </div>
      </section>
    </>
  );
}