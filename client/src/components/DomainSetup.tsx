import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Plus, Check, Timer } from "lucide-react";

const DomainSetup = () => {
  const [domain, setDomain] = useState("");
  
  return (
    <section id="domain-setup" className="py-16 bg-gradient-to-b from-white to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Create Your Free Professional Email in 3 Steps</h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Get your business email address with your custom domain quickly and easily, completely free.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="flex flex-col items-center text-center">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Your Domain</h3>
              <p className="text-secondary-600 mb-4">
                Select an existing domain you own or register a new one directly through our platform.
              </p>
              <div className="mt-auto pt-6 w-full">
                <div className="relative">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-secondary-300 bg-secondary-50 text-secondary-500 text-sm">
                      www.
                    </span>
                    <Input 
                      type="text" 
                      placeholder="yourbusiness.com" 
                      className="rounded-l-none"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button variant="outline" className="flex-1 py-1 px-3 h-8">I have a domain</Button>
                  <Button variant="outline" className="flex-1 py-1 px-3 h-8">Get new domain</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col items-center text-center">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Email Addresses</h3>
              <p className="text-secondary-600 mb-4">
                Set up email addresses for your team with custom usernames @yourdomain.com.
              </p>
              <div className="mt-auto pt-6 w-full">
                <div className="border border-secondary-200 rounded-md overflow-hidden">
                  <div className="bg-secondary-50 p-3 border-b border-secondary-200">
                    <h4 className="text-sm font-medium">Email Addresses</h4>
                  </div>
                  <div className="p-3 border-b border-secondary-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">john@{domain || "yourbusiness.com"}</span>
                      <span className="text-xs text-secondary-500">Admin</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <Button 
                      variant="link" 
                      className="text-sm text-primary font-medium p-0 h-auto flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add another email
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col items-center text-center">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Configure & Connect</h3>
              <p className="text-secondary-600 mb-4">
                We'll guide you through setup or handle the technical configuration for you.
              </p>
              <div className="mt-auto pt-6 w-full">
                <div className="bg-secondary-50 rounded-md p-4 border border-secondary-200">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Domain verification</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">MX records setup</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <Timer className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Email client configuration</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <a href="/domain-connect">
            <Button size="lg" className="px-8">
              Get Started Free
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DomainSetup;
