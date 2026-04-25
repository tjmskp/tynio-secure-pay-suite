import { useEffect, useMemo, useState } from "react";
import { Plus, Search, KeyRound, Loader2 } from "lucide-react";
import { VaultLayout } from "@/components/vault/VaultLayout";
import { UnlockDialog } from "@/components/vault/UnlockDialog";
import { EntryCard } from "@/components/vault/EntryCard";
import { EntryDialog, type VaultEntryRow } from "@/components/vault/EntryDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function Vault() {
  const { user, encryptionKey } = useAuth();
  const [entries, setEntries] = useState<VaultEntryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VaultEntryRow | null>(null);
  const [deleting, setDeleting] = useState<VaultEntryRow | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("vault_entries")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    else setEntries((data ?? []) as VaultEntryRow[]);
    setLoading(false);
  };

  useEffect(() => { if (user && encryptionKey) load(); /* eslint-disable-next-line */ }, [user, encryptionKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.username ?? "").toLowerCase().includes(q) ||
        (e.url ?? "").toLowerCase().includes(q)
    );
  }, [entries, query]);

  const confirmDelete = async () => {
    if (!deleting) return;
    const { error } = await supabase.from("vault_entries").delete().eq("id", deleting.id);
    if (error) return toast.error(error.message);
    toast.success("Entry deleted");
    setDeleting(null);
    load();
  };

  return (
    <>
      <VaultLayout>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Your vault</h1>
              <p className="text-sm text-muted-foreground">{entries.length} entries · end-to-end encrypted</p>
            </div>
            <Button variant="hero" onClick={() => { setEditing(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4" />
              New entry
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search entries..."
              className="pl-9"
            />
          </div>

          {loading || !encryptionKey ? (
            <div className="flex justify-center py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-card/40 px-6 py-16 text-center animate-fade-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-medium">{query ? "No matches" : "Your vault is empty"}</h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                {query ? "Try a different search." : "Add your first password to get started. Everything is encrypted on your device."}
              </p>
              {!query && (
                <Button variant="hero" onClick={() => { setEditing(null); setDialogOpen(true); }} className="mt-2">
                  <Plus className="h-4 w-4" /> Add first entry
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filtered.map((e) => (
                <EntryCard key={e.id} entry={e} onEdit={(en) => { setEditing(en); setDialogOpen(true); }} onDelete={setDeleting} />
              ))}
            </div>
          )}
        </div>
      </VaultLayout>

      <EntryDialog open={dialogOpen} onOpenChange={setDialogOpen} entry={editing} onSaved={load} />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting?.title}" will be permanently removed from your vault. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UnlockDialog />
    </>
  );
}
