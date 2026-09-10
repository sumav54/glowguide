import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: -16, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 16, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
