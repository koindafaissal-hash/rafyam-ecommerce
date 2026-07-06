'use client';
import { useState } from 'react';
import { Check } from 'lucide-react';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) });
      if (!r.ok) throw new Error((await r.json()).error ?? 'Erreur');
      setSent(true);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  if (sent) return (
    <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-10 text-center">
      <Check className="mx-auto h-12 w-12 text-green-400" />
      <p className="mt-4 font-display text-2xl">Message envoyé</p>
      <p className="mt-2 text-sm text-ink-300">Nous vous répondons sous 1 heure.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="text-xs uppercase tracking-widest text-gold-300">Nom *</span><input required className="input-luxe mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="block"><span className="text-xs uppercase tracking-widest text-gold-300">Email *</span><input required type="email" className="input-luxe mt-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="block sm:col-span-2"><span className="text-xs uppercase tracking-widest text-gold-300">Téléphone</span><input className="input-luxe mt-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        <label className="block sm:col-span-2"><span className="text-xs uppercase tracking-widest text-gold-300">Sujet *</span><input required className="input-luxe mt-2" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></label>
        <label className="block sm:col-span-2"><span className="text-xs uppercase tracking-widest text-gold-300">Message *</span><textarea required className="input-luxe mt-2 min-h-[160px]" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
      </div>
      {err && <p className="text-sm text-red-400" role="alert">{err}</p>}
      <button type="submit" disabled={busy} className="btn-primary">{busy ? '…' : 'Envoyer'}</button>
    </form>
  );
}