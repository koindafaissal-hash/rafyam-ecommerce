import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Guide des tailles' };

const SIZES = [
  { eu: '39', cm: '25.1', uk: '6', us: '6.5' },
  { eu: '40', cm: '25.7', uk: '6.5', us: '7' },
  { eu: '41', cm: '26.3', uk: '7.5', us: '8' },
  { eu: '42', cm: '26.9', uk: '8', us: '8.5' },
  { eu: '43', cm: '27.6', uk: '9', us: '9.5' },
  { eu: '44', cm: '28.3', uk: '9.5', us: '10' },
  { eu: '45', cm: '29.0', uk: '10.5', us: '11' },
  { eu: '46', cm: '29.6', uk: '11.5', us: '12' },
];

export default function SizeGuidePage() {
  return (
    <article className="container-luxe py-16">
      <header className="mb-12"><h1 className="font-display text-display-lg">Guide des <em className="text-gold-gradient not-italic">tailles.</em></h1><p className="mt-4 max-w-xl text-ink-300">Mesurez votre pied en fin de journée, debout, en charge, et reportez-vous au tableau ci-dessous.</p></header>
      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full text-sm">
          <thead className="bg-ink-900 text-xs uppercase tracking-widest text-gold-300">
            <tr><th className="px-6 py-4 text-left">EU</th><th className="px-6 py-4 text-left">UK</th><th className="px-6 py-4 text-left">US</th><th className="px-6 py-4 text-left">Longueur (cm)</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {SIZES.map((s) => (
              <tr key={s.eu} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-display text-lg">{s.eu}</td>
                <td className="px-6 py-4 text-ink-200">{s.uk}</td>
                <td className="px-6 py-4 text-ink-200">{s.us}</td>
                <td className="px-6 py-4 text-ink-200">{s.cm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-12 rounded-lg border border-gold-500/30 bg-gold-500/5 p-6">
        <h2 className="font-display text-xl text-gold-300">Conseil personnalisé</h2>
        <p className="mt-2 text-sm text-ink-200">Vous hésitez entre deux pointures ou vous avez un pied large ? Notre équipe vous conseille sur WhatsApp avant votre achat.</p>
        <Link href="https://wa.me/22657955090" className="btn-outline mt-4 inline-flex">Discuter sur WhatsApp</Link>
      </div>
    </article>
  );
}