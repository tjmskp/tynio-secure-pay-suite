import { useState, useEffect } from "react";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Wand2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { encryptString, decryptString } from "@/lib/crypto";
import { toast } from "sonner";
import { generatePassword } from "@/lib/password";

export interface VaultEntryRow {
  id: string;
  user_id: string;
  title: string;
  username: string | null;
  url: string | null;
  notes: string | null;
  password_ciphertext: string;
  password_iv: string;
  created_at: string;
  updated_at: string;
}

const schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  username: z.string().trim().max(200).optional(),
  url: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
  password: z.string().min(1, "Password is required").max(500),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  entry?: VaultEntryRow | null;
  onSaved: () => void;
}

export function EntryDialog({ open, onOpenChange, entry, onSaved }: Props) {
  const { user, encryptionKey } = useAuth();
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (entry && encryptionKey) {
      setTitle(entry.title);
      setUsername(entry.username ?? "");
      setUrl(entry.url ?? "");
      setNotes(entry.notes ?? "");
      decryptString(entry.password_ciphertext, entry.password_iv, encryptionKey)
        .then(setPassword)
        .catch(() => toast.error("Failed to decrypt entry"));
    } else {
      setTitle(""); setUsername(""); setUrl(""); setNotes(""); setPassword("");
    }
    setShow(false);
  }, [open, entry, encryptionKey]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !encryptionKey) return;
    const parsed = schema.safeParse({ title, username, url, notes, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      const { ciphertext, iv } = await encryptString(password, encryptionKey);
      const payload = {
        user_id: user.id,
        title: parsed.data.title,
        username: parsed.data.username || null,
        url: parsed.data.url || null,
        notes: parsed.data.notes || null,
        password_ciphertext: ciphertext,
        password_iv: iv,
      };
      if (entry) {
        const { error } = await supabase.from("vault_entries").update(payload).eq("id", entry.id);
        if (error) throw error;
        toast.success("Entry updated");
      } else {
        const { error } = await supabase.from("vault_entries").insert(payload);
        if (error) throw error;
        toast.success("Entry saved");
      }
      onSaved();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{entry ? "Edit entry" : "New entry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="e-title">Title</Label>
            <Input id="e-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="GitHub" required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="e-user">Username / email</Label>
              <Input id="e-user" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="you@domain.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-url">URL</Label>
              <Input id="e-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="e-pwd">Password</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input id="e-pwd" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button type="button" variant="outline" size="icon" onClick={() => setPassword(generatePassword({ length: 20, lower: true, upper: true, numbers: true, symbols: true }))} title="Generate strong password">
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="e-notes">Notes</Label>
            <Textarea id="e-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Optional" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="hero" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : entry ? "Save changes" : "Create entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
