import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, ArrowRight } from "lucide-react";
import { useShopping } from "@/context/ShoppingContext";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";

const CompareTray = () => {
  const { compare, toggleCompare, clearCompare } = useShopping();
  const items = products.filter((p) => compare.includes(p.id));

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-2xl shadow-2xl px-4 py-3 max-w-[95vw]"
        >
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-primary shrink-0" />
            <div className="flex gap-2 overflow-x-auto">
              {items.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded-lg whitespace-nowrap">
                  <img src={p.image} alt={p.name} loading="lazy" width={640} height={640} className="w-6 h-6 rounded object-cover bg-background" />
                  <span className="text-xs font-medium max-w-[100px] truncate">{p.name}</span>
                  <button onClick={() => toggleCompare(p.id)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <Button asChild size="sm" className="rounded-full shrink-0">
              <Link to="/compare">Compare <ArrowRight className="ml-1 w-3 h-3" /></Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={clearCompare} className="shrink-0">Clear</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareTray;
