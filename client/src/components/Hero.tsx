import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-white border-b border-secondary-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-secondary-900 mb-6">
              Professional Email Addresses for Your Business
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Create custom email addresses with your domain name for free. Boost your credibility and brand recognition with every message you send.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <a href="/email-setup">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  Create Your Free Email
                </Button>
              </a>
              <a href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                  View Features
                </Button>
              </a>
            </div>
            
            <div className="mt-8 flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Customer portrait" 
                  className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Customer portrait" 
                  className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Customer portrait" 
                  className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                />
              </div>
              <div className="text-sm text-secondary-600">
                <span className="font-semibold text-secondary-900">5,000+</span> businesses trust us
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Email dashboard interface" 
              className="w-full rounded-lg shadow-2xl" 
            />
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-secondary-200">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-secondary-500">New email created</p>
                  <p className="text-sm font-medium">john@yourbusiness.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-secondary-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="flex justify-center grayscale opacity-70 hover:opacity-100 transition-opacity">
              <span className="text-xl font-bold text-secondary-400">Microsoft 365</span>
            </div>
            <div className="flex justify-center grayscale opacity-70 hover:opacity-100 transition-opacity">
              <span className="text-xl font-bold text-secondary-400">Google Workspace</span>
            </div>
            <div className="flex justify-center grayscale opacity-70 hover:opacity-100 transition-opacity">
              <span className="text-xl font-bold text-secondary-400">Zoho Mail</span>
            </div>
            <div className="flex justify-center grayscale opacity-70 hover:opacity-100 transition-opacity">
              <span className="text-xl font-bold text-secondary-400">Amazon WorkMail</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
