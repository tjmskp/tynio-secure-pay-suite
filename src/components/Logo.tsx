import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
        <ShieldCheck className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
      </div>
      {showWord && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Secure<span className="text-primary">key</span>
        </span>
      )}
    </div>
  );
}
