import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  userRole?: 'public' | 'admin' | 'merchant';
}

export function Header({ userRole = 'public' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const publicNavItems = [
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Documentation', href: '/docs' },
  ];

  const adminNavItems = [
    { name: 'Merchants', href: '/admin/merchants' },
    { name: 'Compliance', href: '/admin/compliance' },
    { name: 'Content', href: '/admin/content' },
  ];

  const merchantNavItems = [
    { name: 'Dashboard', href: '/merchant/dashboard' },
    { name: 'Transactions', href: '/merchant/transactions' },
    { name: 'Settings', href: '/merchant/settings' },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : 
                   userRole === 'merchant' ? merchantNavItems : 
                   publicNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">TYNIO</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {userRole === 'public' && (
              <>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button variant="default" size="sm">
                  Get Started
                </Button>
              </>
            )}
            {userRole === 'admin' && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 rounded-full">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
                  <span className="text-sm text-success font-medium">Admin</span>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
            {userRole === 'merchant' && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
                  <Shield className="h-3 w-3 text-primary" />
                  <span className="text-sm text-primary font-medium">Merchant</span>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="flex flex-col space-y-2 p-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors duration-200 py-2 font-medium"
                >
                  {item.name}
                </a>
              ))}
              {userRole === 'public' && (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button variant="ghost" className="justify-start">
                    Sign In
                  </Button>
                  <Button variant="default" className="justify-start">
                    Get Started
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}