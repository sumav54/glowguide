import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, X, ExternalLink, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useShopping } from "@/context/ShoppingContext";
import { storeUrl } from "@/lib/storeLinks";

const Compare = () => {
  const { compare, toggleCompare, clearCompare } = useShopping();
  const items = products.filter((p) => compare.includes(p.id));

  const rows: { label: string; render: (p: typeof products[number]) => React.ReactNode }[] = [
    { label: "Brand", render: (p) => p.brand },
    { label: "Category", render: (p) => p.category },
    { label: "Price", render: (p) => <span className="font-bold text-primary">{p.price}</span> },
    { label: "Rating", render: (p) => <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-gold text-gold" />{p.rating}</span> },
    { label: "Skin Types", render: (p) => p.skinTypes.join(", ") },
    { label: "Age Limit", render: (p) => p.ageLimit },
    { label: "Size", render: (p) => p.size ?? "—" },
    { label: "Key Benefits", render: (p) => p.benefits.join(", ") },
    { label: "Ingredients", render: (p) => <span className="text-xs">{p.ingredients.join(", ")}</span> },
    { label: "How to Use", render: (p) => <span className="text-xs">{p.howToUse ?? "—"}</span> },
    { label: "Warnings", render: (p) => <span className="text-xs">{p.warnings ?? "—"}</span> },
  ];

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Scale className="w-12 h-12 mx-auto text-primary mb-3" />
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Compare Products</h1>
          <p className="text-muted-foreground">Side-by-side breakdown of ingredients, price and more</p>
        </motion.div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Scale className="w-14 h-14 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-display text-2xl font-semibold mb-2">No products to compare</h2>
            <p className="text-muted-foreground mb-6">Add up to 4 products from the Products page.</p>
            <Button asChild className="rounded-full px-8">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={clearCompare}>Clear all</Button>
            </div>
            <div className="overflow-x-auto bg-card rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left font-medium text-muted-foreground w-32">Feature</th>
                    {items.map((p) => (
                      <th key={p.id} className="p-4 text-left min-w-[200px]">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <img src={p.image} alt={p.name} loading="lazy" width={640} height={640} className="w-16 h-16 rounded-lg object-cover bg-secondary mb-2" />
                            <div className="font-display font-semibold">{p.name}</div>
                          </div>
                          <button onClick={() => toggleCompare(p.id)} className="text-muted-foreground hover:text-destructive">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-b border-border last:border-0">
                      <td className="p-4 font-medium text-muted-foreground align-top">{row.label}</td>
                      {items.map((p) => (
                        <td key={p.id} className="p-4 align-top">{row.render(p)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-4 font-medium text-muted-foreground align-top">Buy</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-4 align-top">
                        <div className="flex flex-wrap gap-1">
                          {(p.buyLinks ?? []).map((bl) => (
                            <a
                              key={bl.store}
                              href={storeUrl(p, bl.store, bl.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary text-primary-foreground text-xs hover:bg-primary/90"
                            >
                              {bl.store} <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Compare;
