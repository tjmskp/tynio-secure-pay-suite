import { Card } from "@/components/ui/card";
import { Code, Shield, Zap, CheckCircle } from "lucide-react";

export function IntegrationProcess() {
  const steps = [
    {
      step: "01",
      title: "Quick Setup",
      description: "Create your account and get API credentials in under 5 minutes",
      icon: Code,
      color: "text-primary",
    },
    {
      step: "02", 
      title: "Security Review",
      description: "Complete our PCI compliance questionnaire and document verification",
      icon: Shield,
      color: "text-success",
    },
    {
      step: "03",
      title: "Go Live",
      description: "Start processing payments with our robust, real-time infrastructure",
      icon: Zap,
      color: "text-accent",
    },
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Start Processing in 3 Simple Steps
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our streamlined onboarding process gets you up and running quickly while ensuring full compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card 
              key={step.step} 
              className="relative p-8 hover:shadow-elegant transition-all duration-300 border-0 shadow-card"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 ${step.color} mb-6 mt-4`}>
                <step.icon className="w-full h-full" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connection Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Security Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { feature: "End-to-End Encryption", icon: Shield },
            { feature: "Real-time Fraud Detection", icon: Zap },
            { feature: "3D Secure Authentication", icon: CheckCircle },
            { feature: "Tokenization Technology", icon: Code },
          ].map((item, index) => (
            <div 
              key={item.feature}
              className="flex items-center space-x-3 p-4 bg-card rounded-lg border shadow-card"
            >
              <item.icon className="h-5 w-5 text-success" />
              <span className="text-sm font-medium text-foreground">{item.feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}