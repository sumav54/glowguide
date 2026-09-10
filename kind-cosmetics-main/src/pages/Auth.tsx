import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const signUpSchema = z.object({
  username: z.string().trim().min(2, "Username too short").max(40),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [su, setSu] = useState({ username: "", email: "", password: "" });
  const [si, setSi] = useState({ email: "", password: "" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/");
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse(su);
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { username: parsed.data.username },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome to GlowGuide!", description: "Account created successfully." });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse(si);
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
    setLoading(false);
    if (error) toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-gradient-card border border-border rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold">Welcome to GlowGuide</h1>
            <p className="text-sm text-muted-foreground mt-1">Save your routines & track your skin journey</p>
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" type="email" value={si.email} onChange={(e) => setSi({ ...si, email: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="si-password">Password</Label>
                  <Input id="si-password" type="password" value={si.password} onChange={(e) => setSi({ ...si, password: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="su-username">Username</Label>
                  <Input id="su-username" value={su.username} onChange={(e) => setSu({ ...su, username: e.target.value })} placeholder="glow_lover" required />
                </div>
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" type="email" value={su.email} onChange={(e) => setSu({ ...su, email: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="su-password">Password</Label>
                  <Input id="su-password" type="password" value={su.password} onChange={(e) => setSu({ ...su, password: e.target.value })} placeholder="Min 6 characters" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
