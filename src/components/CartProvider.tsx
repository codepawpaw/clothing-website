"use client";

import { createContext, use, useCallback, useMemo, useState, useSyncExternalStore } from "react";
import {
  MAX_QTY,
  getServerSnapshot,
  getSnapshot,
  itemKey,
  setItems,
  subscribe,
  type CartItem,
} from "@/lib/cart-store";

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (item: CartItem) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const add = useCallback((item: CartItem) => {
    const current = getSnapshot();
    const key = itemKey(item);
    const existing = current.find((i) => itemKey(i) === key);
    setItems(
      existing
        ? current.map((i) =>
            itemKey(i) === key ? { ...item, qty: Math.min(MAX_QTY, i.qty + item.qty) } : i,
          )
        : [...current, { ...item, qty: Math.min(MAX_QTY, item.qty) }],
    );
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    const clamped = Math.max(1, Math.min(MAX_QTY, Math.floor(qty)));
    setItems(getSnapshot().map((i) => (itemKey(i) === key ? { ...i, qty: clamped } : i)));
  }, []);

  const remove = useCallback((key: string) => {
    setItems(getSnapshot().filter((i) => itemKey(i) !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      add,
      setQty,
      remove,
      clear,
      drawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [items, add, setQty, remove, clear, drawerOpen, openDrawer, closeDrawer],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const ctx = use(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
