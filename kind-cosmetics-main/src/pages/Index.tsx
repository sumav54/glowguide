import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Droplets, Shield, Camera, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import FloatingProducts from "@/components/FloatingProducts";
import BrandShowcase from "@/components/BrandShowcase";
import TrendingCarousel from "@/components/TrendingCarousel";
import SkinConcerns from "@/components/SkinConcerns";
import { deals } from "@/data/deals";
import heroImage from "@/assets/hero-skincare.png";
import womenImage from "@/assets/audience/women-skincare.jpg";
import menImage from "@/assets/audience/men-skincare.jpg";

const features = [
  { icon: Sparkles, title: "Personalized Quiz", desc: "Discover your skin type with our quick interactive quiz." },
  { icon: Camera, title: "AI Skin Analysis", desc: "Take a photo and get instant AI-powered skin analysis & treatment plan." },
  { icon: Droplets, title: "Curated Products", desc: "Real products from top brands with ingredients, age limits & direct buy links." },
  { icon: Shield, title: "Ingredient Insights", desc: "Learn what goes into your skincare and why it matters." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <FloatingProducts />
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
              Your Skin,{" "}
              <span className="text-gradient-rose">Your Glow</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
              Discover your unique skin type and find the perfect products crafted just for you. 
              Science-backed recommendations, beautifully simple.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/quiz">
                  Take the Quiz <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link to="/skin-analysis">
                  <Camera className="mr-2 w-4 h-4" /> AI Skin Scan
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link to="/products">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link to="/routine-builder">Build Routine</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Skincare products arranged on cream background"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-center mb-4"
          >
            How It Works
          </motion.h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            Four simple steps to your personalized skincare routine.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-gradient-card rounded-xl p-8 text-center border border-border hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BrandShowcase />
      <TrendingCarousel />
      <SkinConcerns />

      {/* Gender sections */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            Shop by <span className="text-gradient-rose">You</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <motion.div
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] shadow-lg"
            >
              <img src={womenImage} alt="Woman with healthy natural skin" loading="lazy" width={960} height={1200} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-background">
                <h3 className="text-3xl font-display font-semibold mb-1">Skincare for Women</h3>
                <p className="text-sm text-background/80 mb-5">Curated care from trusted everyday and clinical brands.</p>
                <Button asChild variant="secondary"><Link to="/products?gender=women">Explore Women's <ArrowRight className="ml-1 w-4 h-4" /></Link></Button>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] shadow-lg"
            >
              <img src={menImage} alt="Man with healthy natural skin" loading="lazy" width={960} height={1200} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-background">
                <h3 className="text-3xl font-display font-semibold mb-1">Skincare for Men</h3>
                <p className="text-sm text-background/80 mb-5">Focused routines for cleansing, hydration and daily protection.</p>
                <Button asChild variant="secondary"><Link to="/products?gender=men">Explore Men's <ArrowRight className="ml-1 w-4 h-4" /></Link></Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deals Strip */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-1 flex items-center gap-3">
                <Tag className="w-7 h-7 text-primary" /> Today's Deals
              </h2>
              <p className="text-muted-foreground text-sm">Limited-time offers from top beauty stores</p>
            </div>
            <Button asChild variant="ghost" className="rounded-full hidden sm:flex">
              <Link to="/deals">View all <ArrowRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.slice(0, 3).map((d, i) => (
              <motion.a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-gradient-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all block"
              >
                <div className="flex items-center justify-between mb-3">
                  <Tag className="w-6 h-6 text-primary" />
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary">{d.store}</span>
                </div>
                <div className="text-xl font-display font-bold text-primary mb-1">{d.discount}</div>
                <h3 className="font-semibold mb-1">{d.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{d.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-2xl p-12 md:p-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Ready to Find Your Perfect Routine?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Take our 60-second skin quiz and get personalized product recommendations instantly.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-10">
              <Link to="/quiz">
                Start Now <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-display text-lg font-semibold text-foreground mb-1">GlowGuide</p>
          <p>Your personalized skincare companion</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
