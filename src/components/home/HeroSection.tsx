import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Lock, TrendingUp, Users, CreditCard } from "lucide-react";

export function HeroSection() {
  const stats = [
    { label: "Transactions Processed", value: "£2.4B+", icon: CreditCard },
    { label: "Active Merchants", value: "12,000+", icon: Users },
    { label: "Uptime", value: "99.99%", icon: TrendingUp },
  ];

  return (
    <section className="relative bg-background text-foreground overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      
      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in stagger-children">{/* Added stagger effect */}
            <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>PCI DSS Level 1 Certified</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Secure Payment Processing 
              <span className="text-primary"> for the UK</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Enterprise-grade payment gateway built for UK businesses. 
              Process payments securely with our PCI-compliant infrastructure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group animate-bounce-subtle">
                Start Integration
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                View Documentation
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Real-time Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">256-bit Encryption</span>
              </div>
            </div>
          </div>

          {/* Right Column - Stats Cards */}
          <div className="space-y-6 animate-slide-up">
            {stats.map((stat, index) => (
              <Card 
                key={stat.label} 
                className="p-6 bg-card border border-border backdrop-blur-sm hover:bg-accent transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                style={{ animationDelay: `${index * 150}ms` }} // Increased delay for better stagger
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </Card>
            ))}

            {/* Live Transaction Indicator */}
            <Card className="p-6 bg-primary/10 border-primary/20 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <div>
                  <p className="text-foreground font-semibold">Live Transactions</p>
                  <p className="text-muted-foreground text-sm">Processing payments in real-time</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}