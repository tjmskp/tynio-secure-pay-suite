import { Shield, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span className="text-lg font-bold">TYNIO LTD</span>
            </div>
            <div className="flex items-start space-x-2 text-sm opacity-90">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>124-128 City Road, London, United Kingdom, EC1V 2NX</span>
            </div>
            <div className="flex items-center space-x-2 text-sm opacity-90">
              <Mail className="h-4 w-4" />
              <span>support@tynio.com</span>
            </div>
            <div className="flex items-center space-x-2 text-sm opacity-90">
              <Phone className="h-4 w-4" />
              <span>+44 20 7946 0958</span>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Products</h3>
            <div className="space-y-2 text-sm opacity-90">
              <a href="/payment-processing" className="block hover:opacity-100 transition-opacity">
                Payment Processing
              </a>
              <a href="/fraud-detection" className="block hover:opacity-100 transition-opacity">
                Fraud Detection
              </a>
              <a href="/api-integration" className="block hover:opacity-100 transition-opacity">
                API Integration
              </a>
              <a href="/merchant-dashboard" className="block hover:opacity-100 transition-opacity">
                Merchant Dashboard
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Resources</h3>
            <div className="space-y-2 text-sm opacity-90">
              <a href="/documentation" className="block hover:opacity-100 transition-opacity">
                Documentation
              </a>
              <a href="/api-reference" className="block hover:opacity-100 transition-opacity">
                API Reference
              </a>
              <a href="/compliance" className="block hover:opacity-100 transition-opacity">
                Compliance Guide
              </a>
              <a href="/support" className="block hover:opacity-100 transition-opacity">
                Support Center
              </a>
            </div>
          </div>

          {/* Compliance */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Compliance</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg">
                <Shield className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">PCI DSS Level 1</span>
              </div>
              <div className="text-xs opacity-75">
                <p>Certified and compliant with:</p>
                <ul className="mt-1 space-y-1">
                  <li>• FCA Regulations</li>
                  <li>• GDPR Compliance</li>
                  <li>• ISO 27001</li>
                  <li>• SOC 2 Type II</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-75">
          <p>&copy; 2024 TYNIO LTD. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="hover:opacity-100 transition-opacity">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:opacity-100 transition-opacity">
              Terms of Service
            </a>
            <a href="/cookies" className="hover:opacity-100 transition-opacity">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}