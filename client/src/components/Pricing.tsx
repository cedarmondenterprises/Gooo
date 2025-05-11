import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PlanFeature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex">
    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
    <span>{children}</span>
  </li>
);

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">100% Free Service</h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            MailDomainPro is completely free to use. Create your professional email addresses without any cost.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="plan-card plan-card-popular">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              FREE FOREVER
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Free Plan</h3>
              <p className="text-secondary-600">Everything you need for professional email</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-end">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-secondary-600 ml-1 mb-1">/forever</span>
              </div>
              <p className="text-sm text-secondary-500 mt-1">No credit card required</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <PlanFeature>Unlimited email addresses</PlanFeature>
              <PlanFeature>25GB storage per user</PlanFeature>
              <PlanFeature>Advanced spam and virus protection</PlanFeature>
              <PlanFeature>Webmail and mobile app access</PlanFeature>
              <PlanFeature>Email forwarding and aliases</PlanFeature>
              <PlanFeature>Advanced security features</PlanFeature>
              <PlanFeature>24/7 community support</PlanFeature>
              <PlanFeature>Full access on all platforms</PlanFeature>
              <PlanFeature>Email routing and automation</PlanFeature>
            </ul>
            
            <div className="mt-auto">
              <Button className="w-full">
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <div className="rounded-lg border border-secondary-200 bg-secondary-50 shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Need help getting set up?</h3>
                <p className="text-secondary-600">
                  Our community forum and knowledge base have everything you need to get started, or contact our support team for assistance.
                </p>
              </div>
              <div>
                <a href="#contact">
                  <Button>
                    Contact Support
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
