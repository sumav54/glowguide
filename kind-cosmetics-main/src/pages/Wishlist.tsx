import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useShopping } from "@/context/ShoppingContext";

const Wishlist = () => {
  const { wishlist } = useShopping();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Heart className="w-12 h-12 mx-auto text-primary mb-3 fill-primary" />
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">{items.length} {items.length === 1 ? "product" : "products"} saved</p>
        </motion.div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-14 h-14 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-display text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Tap the heart on any product to save it here.</p>
            <Button asChild className="rounded-full px-8">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
