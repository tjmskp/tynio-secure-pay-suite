import { Header } from "@/components/layout/Header";
import { TransactionDashboard } from "@/components/dashboard/TransactionDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileCheck, 
  AlertTriangle, 
  Shield, 
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

export default function AdminDashboard() {
  const merchantRequests = [
    {
      id: "req_001",
      merchantName: "TechStart Ltd",
      applicationDate: "2024-01-15",
      status: "pending_review",
      riskScore: 25,
      documents: 4,
      missingDocs: 1
    },
    {
      id: "req_002", 
      merchantName: "RetailCorp",
      applicationDate: "2024-01-14",
      status: "approved",
      riskScore: 15,
      documents: 5,
      missingDocs: 0
    },
    {
      id: "req_003",
      merchantName: "HighRisk Ventures",
      applicationDate: "2024-01-13", 
      status: "suspended",
      riskScore: 85,
      documents: 3,
      missingDocs: 2
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending_review: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      approved: "bg-success/10 text-success border-success/20",
      suspended: "bg-destructive/10 text-destructive border-destructive/20",
      rejected: "bg-muted text-muted-foreground border-muted"
    };
    
    const labels = {
      pending_review: "Pending Review",
      approved: "Approved",
      suspended: "Suspended", 
      rejected: "Rejected"
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending_review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'suspended':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const adminStats = [
    {
      label: "Pending Applications",
      value: "12",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      label: "Active Merchants", 
      value: "247",
      icon: Users,
      color: "text-success"
    },
    {
      label: "Compliance Issues",
      value: "3",
      icon: AlertTriangle,
      color: "text-destructive"
    },
    {
      label: "Security Alerts",
      value: "1",
      icon: Shield,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="admin" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((stat) => (
              <Card key={stat.label} className="p-6 shadow-card border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </Card>
            ))}
          </div>

          {/* Merchant Management */}
          <Card className="shadow-card border-0">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Merchant Applications</h3>
                  <p className="text-sm text-muted-foreground">Review and approve merchant onboarding requests</p>
                </div>
                <Button variant="outline">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Bulk Review
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr className="text-left">
                    <th className="p-4 text-sm font-medium text-muted-foreground">Merchant</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Application Date</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Risk Score</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Documents</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {merchantRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(request.status)}
                          <div>
                            <p className="font-medium text-foreground">{request.merchantName}</p>
                            <p className="text-sm text-muted-foreground">{request.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{request.applicationDate}</td>
                      <td className="p-4">{getStatusBadge(request.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{request.riskScore}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            request.riskScore < 30 ? 'bg-success' : 
                            request.riskScore < 70 ? 'bg-yellow-500' : 'bg-destructive'
                          }`} />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span>{request.documents}/5</span>
                          {request.missingDocs > 0 && (
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs">
                              {request.missingDocs} missing
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status === 'pending_review' && (
                            <>
                              <Button variant="success" size="sm">
                                Approve
                              </Button>
                              <Button variant="destructive" size="sm">
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Transaction Dashboard */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Transaction Monitoring</h3>
            <TransactionDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}