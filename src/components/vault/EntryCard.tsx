import { useEffect, useState } from "react";
import { Copy, Eye, EyeOff, ExternalLink, Pencil, Trash2, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { decryptString } from "@/lib/crypto";
import { toast } from "sonner";
import type { VaultEntryRow } from "./EntryDialog";

interface Props {
  entry: VaultEntryRow;
  onEdit: (entry: VaultEntryRow) => void;
  onDelete: (entry: VaultEntryRow) => void;
}

export function EntryCard({ entry, onEdit, onDelete }: Props) {
  const { encryptionKey } = useAuth();
  const [show, setShow] = useState(false);
  const [plain, setPlain] = useState<string>("");

  useEffect(() => {
    if (!show || plain || !encryptionKey) return;
    decryptString(entry.password_ciphertext, entry.password_iv, encryptionKey)
      .then(setPlain)
      .catch(() => toast.error("Failed to decrypt"));
  }, [show, plain, encryptionKey, entry]);

  const copyPwd = async () => {
    if (!encryptionKey) return;
    try {
      const pwd = plain || (await decryptString(entry.password_ciphertext, entry.password_iv, encryptionKey));
      if (!plain) setPlain(pwd);
      await navigator.clipboard.writeText(pwd);
      toast.success("Password copied · clears in 30s");
      setTimeout(() => navigator.clipboard.writeText("").catch(() => {}), 30_000);
    } catch {
      toast.error("Copy failed");
    }
  };

  const host = (() => {
    try { return entry.url ? new URL(entry.url.startsWith("http") ? entry.url : `https://${entry.url}`).hostname : null; }
    catch { return null; }
  })();

  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card/60 p-4 transition-all hover:border-primary/40 hover:shadow-elegant animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
          {host ? (
            <img
              src={`https://www.google.com/s2/favicons?sz=64&domain=${host}`}
              alt=""
              className="h-5 w-5 rounded"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <Globe className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-medium text-foreground">{entry.title}</h3>
              {entry.username && <p className="truncate text-xs text-muted-foreground">{entry.username}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(entry)} aria-label="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(entry)} aria-label="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 truncate rounded-md bg-secondary/60 px-2 py-1.5 font-mono text-xs text-muted-foreground">
              {show && plain ? plain : "••••••••••••"}
            </code>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShow(!show)} aria-label="Reveal">
              {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyPwd} aria-label="Copy">
              <Copy className="h-3.5 w-3.5" />
            </Button>
            {entry.url && (
              <a href={entry.url.startsWith("http") ? entry.url : `https://${entry.url}`} target="_blank" rel="noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground" aria-label="Open URL">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
