import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const PlanFeature = ({ included, children }: { included: boolean; children: React.ReactNode }) => (
  <li className="flex">
    {included ? (
      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
    ) : (
      <X className="h-5 w-5 text-secondary-400 mr-2 flex-shrink-0" />
    )}
    <span className={!included ? "text-secondary-500" : ""}>{children}</span>
  </li>
);

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core email features.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="plan-card">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-secondary-600">Perfect for small businesses and freelancers</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-end">
                <span className="text-4xl font-bold">$4</span>
                <span className="text-secondary-600 ml-1 mb-1">/user/month</span>
              </div>
              <p className="text-sm text-secondary-500 mt-1">Billed annually</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <PlanFeature included={true}>5 email addresses</PlanFeature>
              <PlanFeature included={true}>10GB storage per user</PlanFeature>
              <PlanFeature included={true}>Basic spam and virus protection</PlanFeature>
              <PlanFeature included={true}>Webmail access</PlanFeature>
              <PlanFeature included={true}>Email forwarding</PlanFeature>
              <PlanFeature included={false}>Advanced security features</PlanFeature>
              <PlanFeature included={false}>Priority support</PlanFeature>
            </ul>
            
            <div className="mt-auto">
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </div>
          </div>
          
          <div className="plan-card plan-card-popular">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              MOST POPULAR
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Business</h3>
              <p className="text-secondary-600">Ideal for growing businesses and teams</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-end">
                <span className="text-4xl font-bold">$8</span>
                <span className="text-secondary-600 ml-1 mb-1">/user/month</span>
              </div>
              <p className="text-sm text-secondary-500 mt-1">Billed annually</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <PlanFeature included={true}>Unlimited email addresses</PlanFeature>
              <PlanFeature included={true}>25GB storage per user</PlanFeature>
              <PlanFeature included={true}>Advanced spam and virus protection</PlanFeature>
              <PlanFeature included={true}>Webmail and mobile app access</PlanFeature>
              <PlanFeature included={true}>Email forwarding and aliases</PlanFeature>
              <PlanFeature included={true}>Advanced security features</PlanFeature>
              <PlanFeature included={true}>Standard support (24-hour response)</PlanFeature>
            </ul>
            
            <div className="mt-auto">
              <Button className="w-full">
                Get Started
              </Button>
            </div>
          </div>
          
          <div className="plan-card">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-secondary-600">For large organizations with advanced needs</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-end">
                <span className="text-4xl font-bold">$15</span>
                <span className="text-secondary-600 ml-1 mb-1">/user/month</span>
              </div>
              <p className="text-sm text-secondary-500 mt-1">Billed annually</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <PlanFeature included={true}>Unlimited email addresses</PlanFeature>
              <PlanFeature included={true}>50GB storage per user</PlanFeature>
              <PlanFeature included={true}>Enterprise-grade security</PlanFeature>
              <PlanFeature included={true}>Full access on all platforms</PlanFeature>
              <PlanFeature included={true}>Email routing and automation</PlanFeature>
              <PlanFeature included={true}>Advanced admin controls & audit logs</PlanFeature>
              <PlanFeature included={true}>Priority support (4-hour response)</PlanFeature>
            </ul>
            
            <div className="mt-auto">
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <div className="rounded-lg border border-secondary-200 bg-secondary-50 shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Need a custom solution?</h3>
                <p className="text-secondary-600">
                  Contact our sales team for custom pricing and features tailored to your organization's specific requirements.
                </p>
              </div>
              <div>
                <a href="#contact">
                  <Button>
                    Contact Sales
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
