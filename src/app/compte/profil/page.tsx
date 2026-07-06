import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ProfileForm } from '@/components/account/ProfileForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mon profil' };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/compte/connexion');
  return (
    <section className="container-luxe py-12">
      <h1 className="font-display text-display-lg">Mon <em className="text-gold-gradient not-italic">profil.</em></h1>
      <div className="mt-10 max-w-xl">
        <ProfileForm user={user} />
      </div>
    </section>
  );
}