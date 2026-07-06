'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

export function ProfileForm({ user }: { user: { firstName: string; lastName: string; email: string; phone: string | null } }) {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' });
  const [pwd, setPwd] = useState({ current: '', next: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(''); setErr(''); setLoading(true);
    try {
      const r = await fetch('/api/account/profile', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...form, currentPassword: pwd.current, newPassword: pwd.next }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? 'Erreur');
      setMsg('Profil mis à jour.'); setPwd({ current: '', next: '' }); router.refresh();
    } catch (e: any) { setErr(e.message); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="text-xs uppercase tracking-widest text-gold-300">Prénom</span><input className="input-luxe mt-2" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></label>
        <label className="block"><span className="text-xs uppercase tracking-widest text-gold-300">Nom</span><input className="input-luxe mt-2" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></label>
        <label className="block"><span className="text-xs uppercase tracking-widest text-gold-300">Email</span><input className="input-luxe mt-2" value={user.email} disabled /></label>
        <label className="block"><span className="text-xs uppercase tracking-widest text-gold-300">Téléphone</span><input className="input-luxe mt-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
      </div>
      <fieldset className="border-t border-white/5 pt-6">
        <legend className="text-xs uppercase tracking-widest text-gold-300">Changer le mot de passe</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="text-xs text-ink-300">Mot de passe actuel</span><input type="password" className="input-luxe mt-2" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} /></label>
          <label className="block"><span className="text-xs text-ink-300">Nouveau</span><input type="password" className="input-luxe mt-2" minLength={6} value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} /></label>
        </div>
      </fieldset>
      {msg && <p className="flex items-center gap-2 text-sm text-green-400"><Check className="h-4 w-4" /> {msg}</p>}
      {err && <p className="text-sm text-red-400" role="alert">{err}</p>}
      <button type="submit" disabled={loading} className="btn-primary">{loading ? '…' : 'Enregistrer'}</button>
    </form>
  );
}