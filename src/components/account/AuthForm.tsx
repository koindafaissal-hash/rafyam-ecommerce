'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export function AuthForm({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  const router = useRouter();
  const params = useSearchParams();
  const redirige = params.get('redirige') ?? '/compte';
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const url = mode === 'login' ? '/api/auth/login' : mode === 'register' ? '/api/auth/register' : '/api/auth/forgot';
      const body = mode === 'login' ? { email: form.email, password: form.password }
        : mode === 'register' ? { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password }
        : { email: form.email };
      const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? 'Erreur');
      if (mode === 'forgot') { setDone(true); return; }
      router.push(redirige); router.refresh();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  if (done) return <p className="mt-8 text-center text-sm text-green-400">Email envoyé si un compte existe.</p>;

  return (
    <form onSubmit={submit} className="mt-10 space-y-4">
      {mode === 'register' && (
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="text-xs uppercase tracking-widest text-gold-300">Prénom</span><input required className="input-luxe mt-2" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></label>
          <label className="block"><span className="text-xs uppercase tracking-widest text-gold-300">Nom</span><input required className="input-luxe mt-2" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></label>
          <label className="col-span-2 block"><span className="text-xs uppercase tracking-widest text-gold-300">Téléphone</span><input type="tel" className="input-luxe mt-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        </div>
      )}
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-gold-300">Email</span>
        <input type="email" required className="input-luxe mt-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      {mode !== 'forgot' && (
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-gold-300">Mot de passe</span>
          <div className="relative mt-2">
            <input type={showPwd ? 'text' : 'password'} required minLength={6} className="input-luxe pr-10" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label="Afficher le mot de passe" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-gold-300">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
      )}
      {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? '…' : mode === 'login' ? 'Se connecter' : mode === 'register' ? 'Créer mon compte' : 'Envoyer le lien'}
      </button>
      {mode === 'login' && (
        <p className="text-center text-xs text-ink-400">
          Compte démo : <code className="text-gold-300">client@rafyam.bf</code> · <code className="text-gold-300">Client1234!</code>
        </p>
      )}
    </form>
  );
}