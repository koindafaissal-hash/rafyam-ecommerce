import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3, Settings, ChevronRight } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { SITE } from '@/lib/site';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect('/compte/connexion');

  const NAV = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/produits', label: 'Produits', icon: Package },
    { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/promotions', label: 'Promotions', icon: Tag },
    { href: '/admin/statistiques', label: 'Statistiques', icon: BarChart3 },
    { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="container-luxe py-8">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <div className="rounded-lg border border-gold-500/30 bg-gold-500/5 p-4 text-xs">
            <p className="text-gold-300">Administration</p>
            <p className="mt-1 font-display text-lg text-bone-50">{user.firstName} {user.lastName}</p>
          </div>
          <nav className="mt-4 rounded-lg border border-white/5 bg-ink-900/40 p-3" aria-label="Administration">
            <ul className="space-y-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="group flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-white/5 hover:text-gold-300">
                    <span className="flex items-center gap-2">
                      <n.icon className="h-4 w-4 text-ink-400 group-hover:text-gold-300" />
                      {n.label}
                    </span>
                    <ChevronRight className="h-3 w-3 text-ink-500" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-white/5 pt-3">
              <Link href="/" className="block rounded-md px-3 py-2 text-xs uppercase tracking-widest text-ink-400 hover:text-gold-300">← Retour boutique</Link>
            </div>
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}