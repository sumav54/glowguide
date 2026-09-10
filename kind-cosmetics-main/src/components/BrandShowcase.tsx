import { motion } from "framer-motion";

const brands = [
  "Mamaearth", "Lakmé", "Minimalist", "Cetaphil", "Dot & Key", "Biotique",
  "Plum", "The Derma Co", "Innisfree", "CeraVe", "Kama Ayurveda", "Bioré",
];

const BrandShowcase = () => {
  const row = [...brands, ...brands];
  return (
    <section className="py-14 bg-background border-y border-border overflow-hidden">
      <div className="container mx-auto px-4 mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-1">Top Brands We Love</h2>
        <p className="text-sm text-muted-foreground">Trusted skincare from the world's best</p>
      </div>
      <div className="relative">
        <motion.div
          className="flex gap-4 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {row.map((b, i) => (
            <div
              key={`${b}-${i}`}
              className="flex items-center px-7 py-4 border-y border-border whitespace-nowrap"
            >
              <span className="font-display text-xl font-semibold tracking-wide">{b}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandShowcase;
