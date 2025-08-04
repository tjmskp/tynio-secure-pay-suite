import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  Shield, 
  FileText, 
  Lock,
  Building,
  CreditCard
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  icon: any;
}

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: OnboardingStep[] = [
    {
      id: "business-info",
      title: "Business Information",
      description: "Company details and registration",
      status: "completed",
      icon: Building
    },
    {
      id: "pci-questionnaire", 
      title: "PCI DSS Assessment",
      description: "Security compliance questionnaire",
      status: "in-progress",
      icon: Shield
    },
    {
      id: "document-upload",
      title: "Document Verification", 
      description: "Upload required business documents",
      status: "pending",
      icon: FileText
    },
    {
      id: "integration-setup",
      title: "API Integration",
      description: "Configure payment processing",
      status: "pending", 
      icon: CreditCard
    }
  ];

  const pciQuestions = [
    {
      id: "data-storage",
      question: "Does your organization store cardholder data?",
      options: [
        "No, we do not store any cardholder data",
        "Yes, we store encrypted cardholder data",
        "Yes, we store plaintext cardholder data"
      ],
      selected: 0,
      riskLevel: "low"
    },
    {
      id: "encryption",
      question: "What encryption standards do you use for data transmission?",
      options: [
        "TLS 1.3 with AES-256 encryption",
        "TLS 1.2 with AES-128 encryption", 
        "SSL/TLS with basic encryption",
        "No encryption implemented"
      ],
      selected: 0,
      riskLevel: "low"
    },
    {
      id: "network-security",
      question: "How is your network segmented?",
      options: [
        "Fully segmented with firewall protection",
        "Partially segmented network",
        "Shared network environment",
        "No network segmentation"
      ],
      selected: 0,
      riskLevel: "low"
    },
    {
      id: "access-control",
      question: "What access controls are in place?",
      options: [
        "Multi-factor authentication required",
        "Password-based authentication only",
        "Basic user authentication",
        "No formal access controls"
      ],
      selected: 0,
      riskLevel: "low"
    }
  ];

  const getStepIcon = (status: OnboardingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'in-progress':
        return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <div className="w-5 h-5 border-2 border-muted rounded-full" />;
    }
  };

  const getStepStatus = (status: OnboardingStep['status']) => {
    const variants = {
      completed: "bg-success/10 text-success border-success/20",
      'in-progress': "bg-primary/10 text-primary border-primary/20",
      failed: "bg-destructive/10 text-destructive border-destructive/20",
      pending: "bg-muted text-muted-foreground border-muted"
    };
    
    return (
      <Badge variant="outline" className={variants[status]}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="p-6 shadow-card border-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Merchant Onboarding</h2>
              <p className="text-muted-foreground">Complete all steps to activate your account</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{completedSteps}/{steps.length}</p>
              <p className="text-sm text-muted-foreground">Steps Completed</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </Card>

      {/* Steps List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Onboarding Steps</h3>
          {steps.map((step, index) => (
            <Card 
              key={step.id} 
              className={`p-4 cursor-pointer transition-all shadow-card border-0 ${
                currentStep === index ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-center space-x-4">
                {getStepIcon(step.status)}
                <step.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {getStepStatus(step.status)}
              </div>
            </Card>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {steps[currentStep]?.title}
          </h3>

          {/* PCI Questionnaire */}
          {currentStep === 1 && (
            <Card className="p-6 shadow-card border-0">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 p-3 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium text-primary">PCI DSS Self-Assessment</span>
                </div>

                {pciQuestions.map((question, qIndex) => (
                  <div key={question.id} className="space-y-3">
                    <h4 className="font-medium text-foreground">
                      {qIndex + 1}. {question.question}
                    </h4>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <label key={oIndex} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <input
                            type="radio"
                            name={question.id}
                            value={oIndex}
                            checked={question.selected === oIndex}
                            className="text-primary"
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-success" />
                    <span className="text-sm text-success font-medium">
                      Current Assessment: Low Risk
                    </span>
                  </div>
                  <Button variant="default">
                    Save & Continue
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Document Upload */}
          {currentStep === 2 && (
            <Card className="p-6 shadow-card border-0">
              <div className="space-y-6">
                <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-medium text-foreground mb-2">Upload Documents</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop files or click to browse
                  </p>
                  <Button variant="outline">Choose Files</Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Required Documents</h4>
                  {[
                    { name: "Certificate of Incorporation", status: "pending" },
                    { name: "VAT Registration", status: "pending" },
                    { name: "Bank Statement (Last 3 months)", status: "pending" },
                    { name: "Director ID Verification", status: "pending" }
                  ].map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{doc.name}</span>
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}