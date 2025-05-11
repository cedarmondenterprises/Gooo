import { Card, CardContent } from "@/components/ui/card";
import { 
  Globe, 
  ShieldCheck, 
  MailPlus, 
  Tablet, 
  HeadphonesIcon, 
  CalendarCheck,
  CheckIcon
} from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Everything You Need for Professional Email - 100% Free</h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            MailDomainPro provides all the tools and features to establish a professional email presence without any cost.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom Domain Email</h3>
              <p className="text-secondary-600">
                Create professional email addresses with your company domain (you@yourbusiness.com).
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Security</h3>
              <p className="text-secondary-600">
                Enterprise-grade security with spam filtering, anti-phishing, and encryption.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MailPlus className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Management</h3>
              <p className="text-secondary-600">
                User-friendly admin panel to manage all email accounts in one place.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Tablet className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-device Access</h3>
              <p className="text-secondary-600">
                Access your email from any device with our webmail, mobile apps, and desktop clients.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <HeadphonesIcon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-secondary-600">
                Round-the-clock technical support to help you with any issues or questions.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CalendarCheck className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Calendar & Contacts</h3>
              <p className="text-secondary-600">
                Integrated calendar and contact management to streamline your workflow.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16">
          <Card className="bg-secondary-50">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-secondary-900 mb-4">Seamless Integration with Your Favorite Tools</h3>
                  <p className="text-secondary-600 mb-6">
                    MailDomainPro works with the email clients and productivity tools you already use. Connect with Microsoft 365, Google Workspace, and more.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span>Microsoft Outlook & Exchange</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span>Gmail & Google Workspace</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span>Apple Mail & iOS devices</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span>Thunderbird & other IMAP clients</span>
                    </li>
                  </ul>
                </div>
                
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
                    alt="Email service integrations diagram" 
                    className="rounded-lg shadow-lg" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
