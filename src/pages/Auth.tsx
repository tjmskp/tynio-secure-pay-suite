import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { generateSalt, deriveKey } from "@/lib/crypto";

const emailSchema = z.string().trim().email({ message: "Enter a valid email" }).max(255);
const passwordSchema = z.string().min(8, { message: "Master password must be at least 8 characters" }).max(200);

export default function Auth() {
  const navigate = useNavigate();
  const { session, setEncryptionKey } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // sign-in fields
  const [siEmail, setSiEmail] = useState("");
  const [siPwd, setSiPwd] = useState("");
  const [siShow, setSiShow] = useState(false);
  const [siLoading, setSiLoading] = useState(false);

  // sign-up fields
  const [suEmail, setSuEmail] = useState("");
  const [suPwd, setSuPwd] = useState("");
  const [suPwd2, setSuPwd2] = useState("");
  const [suShow, setSuShow] = useState(false);
  const [suLoading, setSuLoading] = useState(false);

  useEffect(() => {
    if (session) navigate("/vault", { replace: true });
  }, [session, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(siEmail);
      passwordSchema.parse(siPwd);
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      return;
    }
    setSiLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: siEmail, password: siPwd });
      if (error) throw error;
      // Fetch salt and derive key
      const { data: keyRow, error: keyErr } = await supabase
        .from("user_keys")
        .select("salt")
        .eq("user_id", data.user!.id)
        .maybeSingle();
      if (keyErr) throw keyErr;
      if (!keyRow) {
        toast.error("Vault not initialized for this account");
        return;
      }
      const key = await deriveKey(siPwd, keyRow.salt);
      setEncryptionKey(key);
      toast.success("Welcome back");
      navigate("/vault", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Sign in failed");
    } finally {
      setSiLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(suEmail);
      passwordSchema.parse(suPwd);
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      return;
    }
    if (suPwd !== suPwd2) {
      toast.error("Passwords do not match");
      return;
    }
    setSuLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email: suEmail,
        password: suPwd,
        options: { emailRedirectTo: redirectUrl },
      });
      if (error) throw error;
      if (!data.user) {
        toast.success("Check your email to confirm your account");
        return;
      }
      // Generate salt + store
      const salt = generateSalt();
      const { error: insErr } = await supabase
        .from("user_keys")
        .insert({ user_id: data.user.id, salt });
      if (insErr) throw insErr;
      const key = await deriveKey(suPwd, salt);
      setEncryptionKey(key);
      toast.success("Vault created");
      navigate("/vault", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Sign up failed");
    } finally {
      setSuLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10" style={{ background: "var(--gradient-hero), hsl(var(--background))" }}>
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl shadow-card">
          <CardContent className="p-6 sm:p-8">
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Unlock your secure vault.</p>
                </div>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="si-email">Email</Label>
                    <Input id="si-email" type="email" autoComplete="email" value={siEmail} onChange={(e) => setSiEmail(e.target.value)} placeholder="you@domain.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si-pwd">Master password</Label>
                    <div className="relative">
                      <Input id="si-pwd" type={siShow ? "text" : "password"} autoComplete="current-password" value={siPwd} onChange={(e) => setSiPwd(e.target.value)} placeholder="••••••••" required />
                      <button type="button" onClick={() => setSiShow(!siShow)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle visibility">
                        {siShow ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={siLoading}>
                    {siLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unlock vault"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold tracking-tight">Create your vault</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Your master password encrypts everything.</p>
                </div>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="su-email">Email</Label>
                    <Input id="su-email" type="email" autoComplete="email" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} placeholder="you@domain.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-pwd">Master password</Label>
                    <div className="relative">
                      <Input id="su-pwd" type={suShow ? "text" : "password"} autoComplete="new-password" value={suPwd} onChange={(e) => setSuPwd(e.target.value)} placeholder="At least 8 characters" required />
                      <button type="button" onClick={() => setSuShow(!suShow)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle visibility">
                        {suShow ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-pwd2">Confirm master password</Label>
                    <Input id="su-pwd2" type={suShow ? "text" : "password"} autoComplete="new-password" value={suPwd2} onChange={(e) => setSuPwd2(e.target.value)} placeholder="Repeat your password" required />
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive-foreground/90">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p><span className="font-semibold">Important:</span> Your master password cannot be recovered. If you forget it, your vault is permanently lost.</p>
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={suLoading}>
                    {suLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create vault"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          End-to-end encrypted · Zero-knowledge
        </p>
      </div>
    </div>
  );
}
