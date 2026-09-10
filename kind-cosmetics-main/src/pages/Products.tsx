import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { products, SkinType } from "@/data/products";

const skinTypes: (SkinType | "all")[] = ["all", "oily", "dry", "normal", "combination"];

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialSkin = searchParams.get("skin") as SkinType | null;
  const genderParam = searchParams.get("gender");
  const [filter, setFilter] = useState<SkinType | "all">(initialSkin || "all");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["all", ...cats];
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const skinMatch = filter === "all" || p.skinTypes.includes(filter as SkinType);
      const catMatch = category === "all" || p.category === category;
      const genderMatch = !genderParam || p.gender === genderParam || p.gender === "unisex" || !p.gender;
      return skinMatch && catMatch && genderMatch;
    });
  }, [filter, category, genderParam]);

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display font-bold text-center mb-2"
        >
          {genderParam === "men" ? "Men's Skincare" : genderParam === "women" ? "Women's Skincare" : "Product Recommendations"}
        </motion.h1>
        <p className="text-muted-foreground text-center mb-10">
          {filter !== "all"
            ? `Showing products recommended for ${filter} skin`
            : "Browse all recommended skincare products"}
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-muted-foreground self-center mr-1">Skin Type:</span>
            {skinTypes.map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  filter === st
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-muted-foreground self-center mr-1">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  category === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No products match this filter combination.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
