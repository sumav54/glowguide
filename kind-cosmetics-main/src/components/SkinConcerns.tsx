import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import acneImage from "@/assets/concerns/acne.jpg";
import drynessImage from "@/assets/concerns/dryness.jpg";
import pigmentationImage from "@/assets/concerns/pigmentation.jpg";
import agingImage from "@/assets/concerns/aging.jpg";
import darkCirclesImage from "@/assets/concerns/dark-circles.jpg";
import sensitivityImage from "@/assets/concerns/sensitivity.jpg";

const concerns = [
  { id: "acne", title: "Acne & Breakouts", image: acneImage, desc: "Care for blemishes, congestion and post-acne marks" },
  { id: "dryness", title: "Dryness", image: drynessImage, desc: "Restore moisture and support the skin barrier" },
  { id: "pigmentation", title: "Pigmentation", image: pigmentationImage, desc: "Target uneven tone and visible dark spots" },
  { id: "aging", title: "Mature Skin", image: agingImage, desc: "Support firmness, texture and lasting hydration" },
  { id: "dark-circles", title: "Dark Circles", image: darkCirclesImage, desc: "Care for the delicate under-eye area" },
  { id: "sensitive", title: "Sensitivity", image: sensitivityImage, desc: "Soothe visible redness and strengthen resilience" },
];

const SkinConcerns = () => (
  <section className="py-20 bg-gradient-warm">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
          Shop by <span className="text-gradient-rose">Skin Concern</span>
        </h2>
        <p className="text-muted-foreground">Find products targeted to what your skin needs most.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {concerns.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Link
              to={`/products?concern=${c.id}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-card shadow-md hover:shadow-xl transition-shadow h-full"
            >
              <img src={c.image} alt={`Real skin showing ${c.title.toLowerCase()}`} loading="lazy" width={768} height={960} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-background">
                <h3 className="font-display text-2xl font-semibold mb-1">{c.title}</h3>
                <p className="text-sm text-background/80 leading-snug">{c.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SkinConcerns;
