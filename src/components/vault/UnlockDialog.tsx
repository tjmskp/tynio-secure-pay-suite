import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, KeyRound, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { deriveKey, verifyKey } from "@/lib/crypto";
import { toast } from "sonner";

export function UnlockDialog() {
  const { user, encryptionKey, setEncryptionKey, signOut } = useAuth();
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const open = !!user && !encryptionKey;

  useEffect(() => {
    if (!open) setPwd("");
  }, [open]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { data: keyRow, error } = await supabase
        .from("user_keys")
        .select("salt")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (!keyRow) {
        toast.error("No vault key found for this account");
        return;
      }
      const key = await deriveKey(pwd, keyRow.salt);
      // Try to validate against an existing entry if any
      const { data: sample } = await supabase
        .from("vault_entries")
        .select("password_ciphertext, password_iv")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      const ok = await verifyKey(
        key,
        sample ? { ciphertext: sample.password_ciphertext, iv: sample.password_iv } : undefined
      );
      if (!ok) {
        toast.error("Incorrect master password");
        return;
      }
      setEncryptionKey(key);
      toast.success("Vault unlocked");
    } catch (err: any) {
      toast.error(err.message || "Unlock failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <KeyRound className="h-5 w-5 text-primary-foreground" />
          </div>
          <DialogTitle>Unlock your vault</DialogTitle>
          <DialogDescription>
            Enter your master password to decrypt your entries. We never store or send it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unlock-pwd">Master password</Label>
            <div className="relative">
              <Input
                id="unlock-pwd"
                type={show ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                autoFocus
                required
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>Forgot your master password? It cannot be recovered. You'll need to sign out and start a fresh vault.</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={signOut} className="flex-1">Sign out</Button>
            <Button type="submit" variant="hero" disabled={loading} className="flex-1">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unlock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
