import { useEffect, useMemo, useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { VaultLayout } from "@/components/vault/VaultLayout";
import { UnlockDialog } from "@/components/vault/UnlockDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generatePassword, passwordStrength } from "@/lib/password";
import { toast } from "sonner";

export default function Generator() {
  const [length, setLength] = useState(20);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [pwd, setPwd] = useState("");

  const regenerate = () => setPwd(generatePassword({ length, lower, upper, numbers, symbols }));

  useEffect(() => { regenerate(); /* eslint-disable-next-line */ }, [length, lower, upper, numbers, symbols]);

  const strength = useMemo(() => passwordStrength(pwd), [pwd]);

  const copy = async () => {
    await navigator.clipboard.writeText(pwd);
    toast.success("Password copied · clears in 30s");
    setTimeout(() => navigator.clipboard.writeText("").catch(() => {}), 30_000);
  };

  return (
    <>
      <VaultLayout>
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Password generator</h1>
            <p className="text-sm text-muted-foreground">Cryptographically random, generated entirely in your browser.</p>
          </div>

          <Card className="border-border/60 bg-card/60 shadow-card">
            <CardContent className="space-y-6 p-6">
              <div className="rounded-lg border border-border bg-secondary/40 p-4">
                <code className="block break-all font-mono text-base text-foreground sm:text-lg">{pwd}</code>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-1 items-center gap-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full transition-all ${strength.color}`} style={{ width: `${(strength.score / 6) * 100}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{strength.label}</span>
                </div>
                <Button variant="outline" size="sm" onClick={regenerate}>
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </Button>
                <Button variant="hero" size="sm" onClick={copy}>
                  <Copy className="h-4 w-4" /> Copy
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Length</Label>
                    <span className="text-sm tabular-nums text-muted-foreground">{length}</span>
                  </div>
                  <Slider value={[length]} onValueChange={(v) => setLength(v[0])} min={8} max={64} step={1} />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <ToggleRow label="a–z" checked={lower} onChange={setLower} />
                  <ToggleRow label="A–Z" checked={upper} onChange={setUpper} />
                  <ToggleRow label="0–9" checked={numbers} onChange={setNumbers} />
                  <ToggleRow label="!@#" checked={symbols} onChange={setSymbols} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </VaultLayout>
      <UnlockDialog />
    </>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 transition-colors hover:bg-secondary/60">
      <span className="font-mono text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
