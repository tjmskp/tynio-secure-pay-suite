import { Header } from "@/components/layout/Header";
import { OnboardingWizard } from "@/components/merchant/OnboardingWizard";
import { TransactionDashboard } from "@/components/dashboard/TransactionDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Key,
  CreditCard,
  BarChart3,
  FileText,
  Lock
} from "lucide-react";

export default function MerchantPortal() {
  const complianceStatus = {
    overall: "compliant",
    lastAudit: "2024-01-01",
    nextAudit: "2024-04-01",
    issues: 0,
    certifications: [
      { name: "PCI DSS Level 1", status: "active", expires: "2024-12-31" },
      { name: "ISO 27001", status: "active", expires: "2024-11-15" },
      { name: "SOC 2 Type II", status: "active", expires: "2024-10-30" }
    ]
  };

  const merchantStats = [
    {
      label: "Monthly Volume",
      value: "£45,230",
      change: "+18.2%",
      icon: CreditCard
    },
    {
      label: "Success Rate", 
      value: "99.8%",
      change: "+0.5%",
      icon: CheckCircle
    },
    {
      label: "Avg Transaction",
      value: "£127.50",
      change: "-2.1%", 
      icon: BarChart3
    },
    {
      label: "Compliance Score",
      value: "98/100",
      change: "0%",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="merchant" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, TechStart Ltd</h1>
              <p className="text-muted-foreground">Manage your payment processing and compliance</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Shield className="h-3 w-3 mr-1" />
                PCI Compliant
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchantStats.map((stat) => (
              <Card key={stat.label} className="p-6 shadow-card border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${
                      stat.change.startsWith('+') ? 'text-success' : 
                      stat.change.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {stat.change} vs last month
                    </p>
                  </div>
                  <stat.icon className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <TransactionDashboard />
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card className="p-6 shadow-card border-0">
                <h3 className="text-lg font-semibold text-foreground mb-4">Transaction Analysis</h3>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Advanced transaction analytics coming soon</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              {/* Compliance Overview */}
              <Card className="p-6 shadow-card border-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Compliance Status</h3>
                    <p className="text-sm text-muted-foreground">Your current compliance standing</p>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Fully Compliant
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {complianceStatus.certifications.map((cert) => (
                    <div key={cert.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{cert.name}</h4>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {cert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expires: {cert.expires}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h4 className="font-medium text-foreground">Next Audit</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scheduled for {complianceStatus.nextAudit}. 
                    All requirements are currently met.
                  </p>
                </div>
              </Card>

              {/* Onboarding Status */}
              <Card className="p-6 shadow-card border-0">
                <h3 className="text-lg font-semibold text-foreground mb-4">Account Setup</h3>
                <OnboardingWizard />
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* API Configuration */}
              <Card className="p-6 shadow-card border-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">API Configuration</h3>
                    <p className="text-sm text-muted-foreground">Manage your API keys and webhooks</p>
                  </div>
                  <Button variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Production API Key</h4>
                        <p className="text-sm text-muted-foreground font-mono">pk_live_••••••••••••••••••••••••7890</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          Active
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Test API Key</h4>
                        <p className="text-sm text-muted-foreground font-mono">pk_test_••••••••••••••••••••••••1234</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          Test Mode
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Security Settings */}
              <Card className="p-6 shadow-card border-0">
                <div className="flex items-center space-x-2 mb-6">
                  <Lock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Additional security for your account</p>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Enabled
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Webhook Encryption</h4>
                      <p className="text-sm text-muted-foreground">Secure webhook payload delivery</p>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">IP Whitelisting</h4>
                      <p className="text-sm text-muted-foreground">Restrict API access to specific IPs</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}