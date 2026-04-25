import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, KeyRound, Wand2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function VaultLayout({ children }: { children: ReactNode }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const navItem = (to: string, icon: ReactNode, label: string) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
          isActive
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        )
      }
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </NavLink>
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--gradient-hero), hsl(var(--background))" }}
    >
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between gap-4">
          <Logo />
          <nav className="flex items-center gap-1">
            {navItem("/vault", <KeyRound className="h-4 w-4" />, "Vault")}
            {navItem("/generator", <Wand2 className="h-4 w-4" />, "Generator")}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground md:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8 animate-fade-in">{children}</main>
    </div>
  );
}
