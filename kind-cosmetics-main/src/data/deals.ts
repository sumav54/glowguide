export interface Deal {
  id: string;
  title: string;
  store: "Nykaa" | "Amazon" | "Flipkart" | "Myntra" | "Purplle" | "Tira";
  discount: string;
  description: string;
  code?: string;
  url: string;
  expiresAt: string;
}

export const deals: Deal[] = [
  {
    id: "d1",
    title: "Pink Friday Sale",
    store: "Nykaa",
    discount: "Up to 50% OFF",
    description: "Mega skincare sale across Minimalist, Dot & Key, The Derma Co, Mamaearth and more.",
    url: "https://www.nykaa.com/sp/pink-friday-sale/pink-friday-sale",
    expiresAt: "Limited time",
  },
  {
    id: "d2",
    title: "Beauty Bonanza",
    store: "Amazon",
    discount: "Min 40% OFF",
    description: "Premium skincare from CeraVe, Cetaphil, Bioré and L'Oréal.",
    code: "BEAUTY40",
    url: "https://www.amazon.in/beauty",
    expiresAt: "Today only",
  },
  {
    id: "d3",
    title: "Big Skincare Sale",
    store: "Flipkart",
    discount: "Flat 35% OFF",
    description: "Trending Indian brands — Beardo, Ustraa, Plum, WOW Skin Science.",
    code: "GLOW35",
    url: "https://www.flipkart.com/beauty-and-personal-care/skin-care/pr?sid=g9b,fp3",
    expiresAt: "Ends in 2 days",
  },
  {
    id: "d4",
    title: "Beauty Days",
    store: "Myntra",
    discount: "Up to 60% OFF",
    description: "Lakmé, Maybelline, L'Oréal and Biotique with extra bank discounts.",
    url: "https://www.myntra.com/beauty",
    expiresAt: "This weekend",
  },
  {
    id: "d5",
    title: "Purplle Carnival",
    store: "Purplle",
    discount: "Up to 70% OFF",
    description: "Korean & Indian skincare with free samples on every order.",
    code: "GLOWNOW",
    url: "https://www.purplle.com/shop/sale-and-offers",
    expiresAt: "5 days left",
  },
  {
    id: "d6",
    title: "Luxe Beauty",
    store: "Tira",
    discount: "Buy 2 Get 1 Free",
    description: "Premium brands like Dr. Sheth's, The Face Shop, COSRX.",
    url: "https://www.tirabeauty.com/sale",
    expiresAt: "While stocks last",
  },
];
