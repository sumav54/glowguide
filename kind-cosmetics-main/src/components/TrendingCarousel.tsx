import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

const TrendingCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true, dragFree: true });
  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-display font-bold mb-1 flex items-center gap-3"
            >
              <TrendingUp className="w-7 h-7 text-primary" /> Trending Now
            </motion.h2>
            <p className="text-muted-foreground text-sm">Top-rated picks loved by our community</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={scrollPrev} className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center" aria-label="Previous">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={scrollNext} className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center" aria-label="Next">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden -mx-2" ref={emblaRef}>
          <div className="flex">
            {trending.map((p, i) => (
              <div key={p.id} className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33%] xl:flex-[0_0_25%] px-2">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;
