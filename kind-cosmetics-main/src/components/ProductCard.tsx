import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Clock, Info, AlertTriangle, Package, Heart, Scale } from "lucide-react";
import { useShopping } from "@/context/ShoppingContext";
import { storeUrl, primaryStoreUrl } from "@/lib/storeLinks";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { isInWishlist, isInCompare, toggleWishlist, toggleCompare } = useShopping();
  const wished = isInWishlist(product.id);
  const compared = isInCompare(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group bg-gradient-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col relative"
    >
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
            wished ? "bg-primary text-primary-foreground" : "bg-background/80 text-muted-foreground hover:text-primary"
          }`}
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={() => toggleCompare(product.id)}
          aria-label={compared ? "Remove from compare" : "Add to compare"}
          className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
            compared ? "bg-primary text-primary-foreground" : "bg-background/80 text-muted-foreground hover:text-primary"
          }`}
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>
      <motion.div
        className="mb-4 rounded-lg overflow-hidden bg-secondary/40 aspect-square"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
      >
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          loading="lazy"
          width={640}
          height={640}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </motion.div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</span>
        <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">{product.name}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {product.benefits.map((b) => (
          <span key={b} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{b}</span>
        ))}
      </div>

      <div className="mb-3">
        <p className="text-xs font-medium text-muted-foreground mb-1">Key Ingredients:</p>
        <div className="flex flex-wrap gap-1">
          {product.ingredients.slice(0, 4).map((i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{i}</span>
          ))}
          {product.ingredients.length > 4 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{product.ingredients.length - 4} more</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Recommended age: <strong className="text-foreground">{product.ageLimit}</strong></span>
      </div>

      {product.size && (
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Size: <strong className="text-foreground">{product.size}</strong></span>
        </div>
      )}

      {product.howToUse && (
        <div className="mb-2 p-2 rounded-md bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-foreground/80 leading-relaxed"><strong>How to use:</strong> {product.howToUse}</p>
          </div>
        </div>
      )}

      {product.warnings && (
        <div className="mb-3 p-2 rounded-md bg-destructive/5 border border-destructive/10">
          <div className="flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-foreground/80 leading-relaxed">{product.warnings}</p>
          </div>
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-lg font-bold text-foreground">{product.price}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="text-sm font-medium text-foreground">{product.rating}</span>
          </div>
        </div>

        {product.buyLinks && product.buyLinks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.buyLinks.map((bl) => (
              <a
                key={bl.store}
                href={storeUrl(product, bl.store, bl.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[80px] flex items-center justify-center gap-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                {bl.store} <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        ) : (
          <a
            href={primaryStoreUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Buy Now <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {product.skinTypes.map((st) => (
          <span key={st} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">{st}</span>
        ))}
        {product.gender && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground capitalize">{product.gender}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
