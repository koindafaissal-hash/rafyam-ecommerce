'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';

type R = { id: string; rating: number; title: string; comment: string; createdAt: string; author: string };

export function ReviewsList({ reviews, productId }: { reviews: R[]; productId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [list, setList] = useState(reviews);
  const [form, setForm] = useState({ rating: 5, title: '', comment: '' });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const r = await fetch('/api/reviews', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productId, ...form }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? 'Erreur');
      setList([{ id: j.id, rating: form.rating, title: form.title, comment: form.comment, createdAt: new Date().toISOString(), author: 'Vous' }, ...list]);
      setForm({ rating: 5, title: '', comment: '' }); setShowForm(false);
    } catch (err: any) { alert(err.message); } finally { setSending(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-300">{list.length} avis publiés</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-outline py-2 px-4 text-xs">Rédiger un avis</button>
      </div>
      {showForm && (
        <form onSubmit={submit} className="mt-6 rounded-lg border border-white/5 bg-ink-900/50 p-6">
          <div className="flex gap-1" role="radiogroup" aria-label="Note">
            {[1,2,3,4,5].map((n) => (
              <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} aria-label={`${n} étoiles`} aria-pressed={form.rating === n}>
                <Star className={`h-6 w-6 ${n <= form.rating ? 'fill-gold-400 text-gold-400' : 'text-ink-500'}`} />
              </button>
            ))}
          </div>
          <input required placeholder="Titre de votre avis" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-luxe mt-4" />
          <textarea required placeholder="Votre commentaire" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="input-luxe mt-3 min-h-[120px]" />
          <button type="submit" disabled={sending} className="btn-primary mt-4">{sending ? '…' : 'Publier'}</button>
        </form>
      )}
      <ul className="mt-8 space-y-6">
        {list.map((r) => (
          <li key={r.id} className="border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex text-gold-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <span className="text-sm font-medium">{r.author}</span>
              <span className="text-xs text-ink-400">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <h4 className="mt-2 font-medium">{r.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-ink-200">{r.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}