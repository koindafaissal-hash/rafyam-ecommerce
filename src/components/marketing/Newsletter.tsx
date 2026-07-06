'use client';
import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) { setState('error'); setMsg('Email invalide.'); return; }
    setState('loading');
    try {
      const r = await fetch('/api/newsletter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? 'Erreur');
      setState('done'); setMsg('Merci, vous êtes inscrit.');
    } catch (err: any) {
      setState('error'); setMsg(err.message ?? 'Une erreur est survenue.');
    }
  };

  return (
    <section className="section-pad" aria-labelledby="news-title">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-ink-900 p-10 sm:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Le Journal RAF&apos;YAM</p>
              <h2 id="news-title" className="mt-2 font-display text-display-lg text-balance">Recevez nos <em className="text-gold-gradient not-italic">confidentiels.</em></h2>
              <p className="mt-4 max-w-md text-ink-200">
                Avant-premières, sélections privées et conseils d&apos;entretien. Quatre lettres par an, jamais plus.
              </p>
            </div>
            <form onSubmit={submit} className="flex flex-col gap-3" aria-label="Inscription newsletter">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="news-email" className="sr-only">Adresse email</label>
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input id="news-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                         placeholder="votre@email.com"
                         className="input-luxe pl-11" />
                </div>
                <button type="submit" disabled={state === 'loading'} className="btn-primary whitespace-nowrap">
                  {state === 'loading' ? '…' : state === 'done' ? <><Check className="h-4 w-4" /> Inscrit</> : "S'inscrire"}
                </button>
              </div>
              <p className="text-xs text-ink-400" aria-live="polite">{msg || 'Désinscription en un clic. Nous respectons votre vie privée.'}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}