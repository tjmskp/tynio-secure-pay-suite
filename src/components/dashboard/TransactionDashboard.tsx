import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  Shield,
  Eye,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'flagged';
  merchant: string;
  timestamp: string;
  paymentMethod: string;
  riskScore: number;
}

export function TransactionDashboard() {
  const mockTransactions: Transaction[] = [
    {
      id: "txn_001",
      amount: 129.99,
      currency: "GBP",
      status: "completed",
      merchant: "TechCorp Ltd",
      timestamp: "2024-01-15 14:32:18",
      paymentMethod: "Visa ****4242",
      riskScore: 12
    },
    {
      id: "txn_002", 
      amount: 89.50,
      currency: "GBP",
      status: "flagged",
      merchant: "RetailPlus",
      timestamp: "2024-01-15 14:28:45",
      paymentMethod: "Mastercard ****7890",
      riskScore: 87
    },
    {
      id: "txn_003",
      amount: 299.00,
      currency: "GBP", 
      status: "pending",
      merchant: "ServicePro",
      timestamp: "2024-01-15 14:25:12",
      paymentMethod: "Visa ****1234",
      riskScore: 23
    },
  ];

  const stats = [
    {
      label: "Total Volume",
      value: "£247,832",
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
    },
    {
      label: "Transactions",
      value: "1,247",
      change: "+8.2%", 
      changeType: "increase",
      icon: CreditCard,
    },
    {
      label: "Success Rate",
      value: "99.2%",
      change: "+0.3%",
      changeType: "increase", 
      icon: TrendingUp,
    },
    {
      label: "Fraud Alerts",
      value: "3",
      change: "-15%",
      changeType: "decrease",
      icon: AlertTriangle,
    },
  ];

  const getStatusBadge = (status: Transaction['status']) => {
    const variants = {
      completed: "bg-success/10 text-success border-success/20",
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      failed: "bg-destructive/10 text-destructive border-destructive/20",
      flagged: "bg-orange-500/10 text-orange-600 border-orange-500/20"
    };
    
    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRiskBadge = (score: number) => {
    if (score < 30) return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Low</Badge>;
    if (score < 70) return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Medium</Badge>;
    return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">High</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 shadow-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-success mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    stat.changeType === 'increase' ? "text-success" : "text-destructive"
                  )}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <stat.icon className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </Card>
        ))}
      </div>

      {/* Real-time Transactions */}
      <Card className="shadow-card border-0">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Live Transactions</h3>
              <p className="text-sm text-muted-foreground">Real-time payment monitoring</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-success font-medium">Live</span>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Merchant</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Payment Method</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Risk</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                      {transaction.id}
                    </code>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold">
                      {transaction.currency} {transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 text-foreground">{transaction.merchant}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{transaction.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(transaction.status)}</td>
                  <td className="p-4">{getRiskBadge(transaction.riskScore)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{transaction.timestamp}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Security Alert */}
      <Card className="border-orange-200 bg-orange-50/50 shadow-card">
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900">Security Alert</h4>
              <p className="text-sm text-orange-700 mt-1">
                Detected unusual transaction pattern from IP range 192.168.1.x. 
                Enhanced monitoring has been automatically enabled.
              </p>
              <Button variant="outline" size="sm" className="mt-3 border-orange-300 text-orange-700 hover:bg-orange-100">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}