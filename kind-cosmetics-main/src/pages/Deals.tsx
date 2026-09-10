import { motion } from "framer-motion";
import { Tag, ExternalLink, Copy, Clock } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { deals } from "@/data/deals";

const Deals = () => {
  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`);
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Tag className="w-12 h-12 mx-auto text-primary mb-3" />
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Today's Best Deals</h1>
          <p className="text-muted-foreground">Curated offers from top beauty retailers</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((d, i) => (
            <motion.a
              key={d.id}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-gradient-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group block"
            >
              <div className="flex items-start justify-between mb-4">
                <Tag className="w-7 h-7 text-primary" />
                <Badge variant="secondary">{d.store}</Badge>
              </div>
              <div className="text-2xl font-display font-bold text-primary mb-1">{d.discount}</div>
              <h3 className="font-display text-xl font-semibold mb-2">{d.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{d.description}</p>

              {d.code && (
                <button
                  onClick={(e) => { e.preventDefault(); copy(d.code!); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 mb-3 hover:bg-primary/10"
                >
                  <span className="font-mono text-sm font-bold text-primary">{d.code}</span>
                  <Copy className="w-4 h-4 text-primary" />
                </button>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {d.expiresAt}</span>
                <span className="inline-flex items-center gap-1 text-primary group-hover:underline">Shop now <ExternalLink className="w-3 h-3" /></span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deals;
