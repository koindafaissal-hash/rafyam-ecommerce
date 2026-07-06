import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';
import { getCurrentUser, clearSessionCookie } from '@/lib/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mon espace' };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/compte/connexion');
  return (
    <section className="container-luxe py-12">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Bienvenue</p>
        <h1 className="mt-2 font-display text-display-lg">Bonjour {user.firstName}.</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card href="/compte/commandes" icon={Package} title="Mes commandes" desc="Suivez vos achats en cours et passés." />
        <Card href="/compte/favoris" icon={Heart} title="Mes favoris" desc="Retrouvez vos pièces préférées." />
        <Card href="/compte/adresses" icon={MapPin} title="Mes adresses" desc="Gérez vos adresses de livraison." />
        <Card href="/compte/profil" icon={User} title="Mon profil" desc="Informations personnelles et mot de passe." />
        <form action={async () => { 'use server'; await clearSessionCookie(); redirect('/'); }} className="contents">
          <button type="submit" className="group flex items-start gap-4 rounded-lg border border-white/5 bg-ink-900/40 p-6 text-left transition-all hover:border-gold-500/40">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/30 text-gold-300 group-hover:bg-gold-gradient group-hover:text-ink-950">
              <LogOut className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl">Déconnexion</h2>
              <p className="mt-1 text-sm text-ink-300">À très bientôt.</p>
            </div>
          </button>
        </form>
      </div>
    </section>
  );
}

function Card({ href, icon: Icon, title, desc }: { href: string; icon: any; title: string; desc: string }) {
  return (
    <Link href={href} className="group flex items-start gap-4 rounded-lg border border-white/5 bg-ink-900/40 p-6 transition-all hover:border-gold-500/40">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/30 text-gold-300 transition-all group-hover:bg-gold-gradient group-hover:text-ink-950">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h2 className="font-display text-xl">{title}</h2>
        <p className="mt-1 text-sm text-ink-300">{desc}</p>
      </div>
    </Link>
  );
}