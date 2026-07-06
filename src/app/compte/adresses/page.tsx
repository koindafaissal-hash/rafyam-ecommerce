import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mes adresses' };

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/compte/connexion');
  const addresses = await prisma.address.findMany({ where: { userId: user.id }, orderBy: { isDefault: 'desc' } });
  return (
    <section className="container-luxe py-12">
      <h1 className="font-display text-display-lg">Mes <em className="text-gold-gradient not-italic">adresses.</em></h1>
      {addresses.length === 0 ? (
        <p className="mt-8 text-ink-300">Aucune adresse enregistrée. Elles seront proposées lors de votre prochaine commande.</p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
              <div className="flex items-center justify-between">
                <p className="font-medium">{a.label}</p>
                {a.isDefault && <span className="badge-gold">Par défaut</span>}
              </div>
              <p className="mt-3 text-sm text-ink-200">{a.fullName}</p>
              <p className="text-sm text-ink-200">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
              <p className="text-sm text-ink-200">{a.city}, {a.country}</p>
              <p className="mt-2 text-sm text-ink-300">{a.phone}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}