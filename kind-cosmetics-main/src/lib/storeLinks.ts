import { Product } from "@/data/products";

/**
 * Many hardcoded deep links to retailer product pages go stale (404).
 * Instead we send the user to the retailer's own search results for the
 * exact brand + product name, which always resolves to a valid page.
 */
const searchBuilders: { match: RegExp; build: (q: string) => string }[] = [
  { match: /nykaa\s*man/i, build: (q) => `https://www.nykaaman.com/search/result/?q=${q}` },
  { match: /nykaa/i, build: (q) => `https://www.nykaa.com/search/result/?q=${q}` },
  { match: /amazon/i, build: (q) => `https://www.amazon.in/s?k=${q}` },
  { match: /flipkart/i, build: (q) => `https://www.flipkart.com/search?q=${q}` },
  { match: /purplle/i, build: (q) => `https://www.purplle.com/search?q=${q}` },
  { match: /tira/i, build: (q) => `https://www.tirabeauty.com/search?q=${q}` },
  { match: /myntra/i, build: (q) => `https://www.myntra.com/${q}` },
];

const hostFromUrl = (url?: string) => {
  try {
    return new URL(url ?? "").hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

/** Resolve a safe, always-working destination for a given store + product. */
export const storeUrl = (product: Product, store: string, originalUrl?: string) => {
  const query = encodeURIComponent(`${product.brand} ${product.name}`.trim());
  const builder = searchBuilders.find((b) => b.match.test(store) || b.match.test(hostFromUrl(originalUrl)));
  if (builder) return builder.build(query);

  // Brand's own store (or anything unknown): search on the site's own domain via Google,
  // so the user still lands on the right product rather than a dead URL.
  const host = hostFromUrl(originalUrl);
  if (host) return `https://www.google.com/search?q=${query}+site:${host}`;
  return `https://www.google.com/search?q=${query}`;
};

/** Default destination when no specific store is chosen. */
export const primaryStoreUrl = (product: Product) => {
  const first = product.buyLinks?.[0];
  return first ? storeUrl(product, first.store, first.url) : storeUrl(product, "", product.buyLink);
};
