import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const FloatingAIButton = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1, type: "spring", stiffness: 200 }}
    className="fixed bottom-6 right-6 z-40"
  >
    <Link
      to="/skin-analysis"
      className="group relative flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-2xl transition-shadow"
      aria-label="AI Skin Assistant"
    >
      <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
      <Sparkles className="w-5 h-5 relative" />
      <span className="font-medium text-sm relative hidden sm:inline">Ask AI</span>
    </Link>
  </motion.div>
);

export default FloatingAIButton;
