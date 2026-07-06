'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  color: string;
  unitPriceCents: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (variantId: string) => void;
  setQuantity: (variantId: string, q: number) => void;
  clear: () => void;
  count: () => number;
  subtotalCents: () => number;
};

export const useCart = create<CartState>()(persist((set, get) => ({
  items: [],
  add: (item) => set((s) => {
    const existing = s.items.find((i) => i.variantId === item.variantId);
    if (existing) {
      return { items: s.items.map((i) => i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i) };
    }
    return { items: [...s.items, item] };
  }),
  remove: (variantId) => set((s) => ({ items: s.items.filter((i) => i.variantId !== variantId) })),
  setQuantity: (variantId, q) => set((s) => ({ items: s.items.map((i) => i.variantId === variantId ? { ...i, quantity: Math.max(1, q) } : i) })),
  clear: () => set({ items: [] }),
  count: () => get().items.reduce((a, i) => a + i.quantity, 0),
  subtotalCents: () => get().items.reduce((a, i) => a + i.unitPriceCents * i.quantity, 0),
}), { name: 'rafyam-cart' }));