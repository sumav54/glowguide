import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WISHLIST_KEY = "glowguide_wishlist";
const COMPARE_KEY = "glowguide_compare";
const MAX_COMPARE = 4;

interface ShoppingContextValue {
  wishlist: string[];
  compare: string[];
  toggleWishlist: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  isInWishlist: (id: string) => boolean;
  isInCompare: (id: string) => boolean;
}

const ShoppingContext = createContext<ShoppingContextValue | null>(null);

const readLocal = (key: string): string[] => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
};

export const ShoppingProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>(() => readLocal(WISHLIST_KEY));
  const [compare, setCompare] = useState<string[]>(() => readLocal(COMPARE_KEY));
  const [userId, setUserId] = useState<string | null>(null);

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUserId(session?.user.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Sync localStorage <-> DB on login
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const local = readLocal(WISHLIST_KEY);
      const { data } = await supabase.from("wishlists").select("product_id").eq("user_id", userId);
      const remote = (data ?? []).map((r) => r.product_id);
      // push local items not in remote
      const toAdd = local.filter((id) => !remote.includes(id));
      if (toAdd.length) {
        await supabase.from("wishlists").insert(toAdd.map((product_id) => ({ user_id: userId, product_id })));
      }
      const merged = Array.from(new Set([...remote, ...local]));
      setWishlist(merged);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(merged));
    })();
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
  }, [compare]);

  const toggleWishlist = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        const has = prev.includes(id);
        const next = has ? prev.filter((p) => p !== id) : [...prev, id];
        toast.success(has ? "Removed from wishlist" : "Added to wishlist");
        if (userId) {
          if (has) {
            supabase.from("wishlists").delete().eq("user_id", userId).eq("product_id", id);
          } else {
            supabase.from("wishlists").insert({ user_id: userId, product_id: id });
          }
        }
        return next;
      });
    },
    [userId],
  );

  const toggleCompare = useCallback((id: string) => {
    setCompare((prev) => {
      if (prev.includes(id)) {
        toast.success("Removed from compare");
        return prev.filter((p) => p !== id);
      }
      if (prev.length >= MAX_COMPARE) {
        toast.error(`You can compare up to ${MAX_COMPARE} products`);
        return prev;
      }
      toast.success("Added to compare");
      return [...prev, id];
    });
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  return (
    <ShoppingContext.Provider
      value={{
        wishlist,
        compare,
        toggleWishlist,
        toggleCompare,
        clearCompare,
        isInWishlist: (id) => wishlist.includes(id),
        isInCompare: (id) => compare.includes(id),
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = () => {
  const ctx = useContext(ShoppingContext);
  if (!ctx) throw new Error("useShopping must be used within ShoppingProvider");
  return ctx;
};
