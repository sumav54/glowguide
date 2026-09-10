import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Heart, Tag } from "lucide-react";
import { useShopping } from "@/context/ShoppingContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { wishlist } = useShopping();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/quiz", label: "Quiz" },
    { to: "/skin-analysis", label: "AI Scan" },
    { to: "/products", label: "Products" },
    { to: "/products?gender=women", label: "Women" },
    { to: "/products?gender=men", label: "Men" },
    { to: "/routine-builder", label: "Routine" },
    { to: "/deals", label: "Deals" },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 gap-2">
        <Link to="/" className="font-display text-2xl font-bold text-foreground tracking-wide whitespace-nowrap">
          Glow<span className="text-primary">Guide</span>
        </Link>
        <div className="flex gap-1 flex-wrap items-center">
          {links.map((link) => {
            const isActive = location.pathname + location.search === link.to ||
              (link.to === location.pathname && !location.search);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/wishlist"
            className="relative ml-1 w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <ThemeToggle />
          {user ? (
            <Button size="sm" variant="outline" onClick={handleSignOut} className="ml-2 gap-1">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </Button>
          ) : (
            <Button size="sm" asChild className="ml-2 gap-1">
              <Link to="/auth"><LogIn className="w-3.5 h-3.5" /> Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
