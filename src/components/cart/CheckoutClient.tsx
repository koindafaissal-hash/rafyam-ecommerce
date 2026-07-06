'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Lock, Smartphone, CreditCard, Truck, ShieldCheck, MapPin, User } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

type Step = 1 | 2 | 3;

export function CheckoutClient() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const subtotalCents = useCart((s) => s.subtotalCents());
  const shipping = subtotalCents >= 100000_00 ? 0 : 2000_00;
  const total = subtotalCents + shipping;

  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    address: '', city: 'Ouagadougou', region: '', country: 'Burkina Faso',
    delivery: 'standard' as 'standard' | 'express' | 'relay',
    payment: 'cod' as 'cod' | 'orange' | 'moov' | 'wave' | 'card',
    notes: '',
  });

  useEffect(() => {
    if (items.length === 0) router.push('/panier');
  }, [items, router]);

  const submit = async () => {
    setSubmitting(true); setError('');
    try {
      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, items }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? 'Erreur');
      clear();
      router.push(`/commande/confirmation?order=${j.number}`);
    } catch (e: any) { setError(e.message); } finally { setSubmitting(false); }
  };

  if (items.length === 0) return null;

  const deliveryLabel = { standard: 'Standard (24-72h)', express: 'Express (24h)', relay: 'Point relais' }[form.delivery];

  return (
    <section className="container-luxe py-12">
      <Steps step={step} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          {step === 1 && (
            <fieldset className="space-y-6">
              <legend className="font-display text-2xl">Informations de contact</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nom complet *" required><input className="input-luxe" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
                <Field label="Téléphone *" required><input type="tel" className="input-luxe" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
                <Field label="Email *" required full><input type="email" className="input-luxe" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              </div>

              <legend className="mt-8 font-display text-2xl">Adresse de livraison</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Adresse *" required full><input className="input-luxe" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
                <Field label="Ville *" required><input className="input-luxe" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
                <Field label="Région"><input className="input-luxe" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} /></Field>
                <Field label="Pays"><input className="input-luxe" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
              </div>

              <Field label="Notes de livraison (optionnel)" full>
                <textarea className="input-luxe min-h-[80px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Précisions sur la livraison…" />
              </Field>

              <button onClick={() => setStep(2)} className="btn-primary">Continuer <ArrowRight className="h-4 w-4" /></button>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset>
              <legend className="font-display text-2xl">Mode de livraison</legend>
              <div className="mt-6 space-y-3">
                {([
                  { id: 'standard', label: 'Standard', desc: 'Livraison sous 24h à Ouagadougou, 72h dans tout le Burkina Faso.', price: subtotalCents >= 100000_00 ? 0 : 2000_00, icon: Truck },
                  { id: 'express', label: 'Express 24h', desc: 'Livraison express garantie le lendemain sur Ouagadougou.', price: 5000_00, icon: Truck },
                  { id: 'relay', label: 'Point relais', desc: 'Retrait dans notre boutique derrière le siège de SIDWAYA.', price: 0, icon: MapPin },
                ] as const).map((o) => (
                  <label key={o.id} className={`flex cursor-pointer items-start gap-4 rounded-lg border p-5 transition-all ${form.delivery === o.id ? 'border-gold-500 bg-gold-500/5' : 'border-white/10 hover:border-gold-500/40'}`}>
                    <input type="radio" name="delivery" value={o.id} checked={form.delivery === o.id} onChange={() => setForm({ ...form, delivery: o.id as any })} className="sr-only" />
                    <o.icon className="mt-0.5 h-5 w-5 text-gold-300" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{o.label}</p>
                        <span className="font-medium text-gold-300">{o.price === 0 ? 'Gratuit' : formatPrice(o.price)}</span>
                      </div>
                      <p className="mt-1 text-sm text-ink-300">{o.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="btn-ghost">← Retour</button>
                <button onClick={() => setStep(3)} className="btn-primary">Continuer <ArrowRight className="h-4 w-4" /></button>
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset>
              <legend className="font-display text-2xl">Mode de paiement</legend>
              <div className="mt-6 space-y-3">
                {([
                  { id: 'cod', label: 'Paiement à la livraison', desc: 'Réglez en espèces à la réception de votre commande.', icon: Truck },
                  { id: 'orange', label: 'Orange Money', desc: 'Paiement mobile sécurisé via Orange Money Burkina Faso.', icon: Smartphone },
                  { id: 'moov', label: 'Moov Money', desc: 'Paiement mobile sécurisé via Moov Africa.', icon: Smartphone },
                  { id: 'wave', label: 'Wave', desc: 'Paiement instantané via Wave.', icon: Smartphone },
                  { id: 'card', label: 'Carte bancaire (Visa, Mastercard)', desc: 'Paiement sécurisé via Stripe.', icon: CreditCard },
                ] as const).map((p) => (
                  <label key={p.id} className={`flex cursor-pointer items-start gap-4 rounded-lg border p-5 transition-all ${form.payment === p.id ? 'border-gold-500 bg-gold-500/5' : 'border-white/10 hover:border-gold-500/40'}`}>
                    <input type="radio" name="payment" value={p.id} checked={form.payment === p.id} onChange={() => setForm({ ...form, payment: p.id as any })} className="sr-only" />
                    <p.icon className="mt-0.5 h-5 w-5 text-gold-300" />
                    <div className="flex-1">
                      <p className="font-medium">{p.label}</p>
                      <p className="mt-1 text-sm text-ink-300">{p.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex items-start gap-2 rounded-lg border border-white/5 bg-ink-900/40 p-4 text-xs text-ink-300">
                <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-300" />
                <span>Vos informations de paiement sont protégées par un chiffrement SSL 256 bits et ne sont jamais stockées sur nos serveurs.</span>
              </div>

              {error && <p className="mt-4 text-sm text-red-400" role="alert">{error}</p>}

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(2)} className="btn-ghost">← Retour</button>
                <button onClick={submit} disabled={submitting} className="btn-primary disabled:opacity-50">
                  {submitting ? 'Traitement…' : <>Confirmer ma commande <Check className="h-4 w-4" /></>}
                </button>
              </div>
            </fieldset>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
            <h2 className="font-display text-xl">Votre commande</h2>
            <ul className="mt-4 divide-y divide-white/5">
              {items.map((it) => (
                <li key={it.variantId} className="flex gap-3 py-3">
                  <img src={it.image} alt="" className="h-14 w-14 rounded object-cover" loading="lazy" />
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">{it.name}</p>
                    <p className="text-xs text-ink-300">{it.size} · {it.color} · ×{it.quantity}</p>
                  </div>
                  <span className="text-sm text-gold-300">{formatPrice(it.unitPriceCents * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-white/5 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-ink-300">Sous-total</dt><dd>{formatPrice(subtotalCents)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-300">Livraison</dt><dd>{shipping === 0 ? <span className="text-green-400">Offerte</span> : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between text-base font-medium"><dt>Total</dt><dd className="text-gold-300">{formatPrice(total)}</dd></div>
            </dl>
            <p className="mt-4 flex items-center gap-2 text-xs text-ink-300"><ShieldCheck className="h-3.5 w-3.5 text-gold-300" /> Garantie authenticité 2 ans</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Steps({ step }: { step: Step }) {
  const items = [
    { n: 1, label: 'Contact & livraison' },
    { n: 2, label: 'Mode de livraison' },
    { n: 3, label: 'Paiement' },
  ];
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-6">
      {items.map((it, i) => {
        const active = step === it.n;
        const done = step > it.n;
        return (
          <li key={it.n} className="flex items-center gap-2 sm:gap-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-all ${done ? 'border-gold-500 bg-gold-500 text-ink-950' : active ? 'border-gold-500 text-gold-300' : 'border-white/10 text-ink-400'}`}>
              {done ? <Check className="h-4 w-4" /> : it.n}
            </div>
            <span className={`hidden text-xs uppercase tracking-widest sm:inline ${active ? 'text-gold-300' : done ? 'text-bone-50' : 'text-ink-400'}`}>{it.label}</span>
            {i < items.length - 1 && <span className="hidden h-px w-6 bg-white/10 sm:inline-block" />}
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, required, children, full }: { label: string; required?: boolean; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs uppercase tracking-widest text-gold-300">{label}{required && <span className="text-red-400"> *</span>}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}