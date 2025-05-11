import { useState } from "react";
import { Link } from "wouter";
import { MailCheck, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-secondary-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <MailCheck className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-secondary-900">
                MailDomain<span className="text-primary">Pro</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium text-secondary-700 hover:text-primary">Features</a>
            <a href="#pricing" className="text-sm font-medium text-secondary-700 hover:text-primary">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-secondary-700 hover:text-primary">FAQ</a>
            <a href="#contact" className="text-sm font-medium text-secondary-700 hover:text-primary">Contact</a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="hidden sm:inline-flex h-9">
              Sign In
            </Button>
            <a href="#pricing">
              <Button className="h-9">
                Get Started
              </Button>
            </a>
            
            {/* Mobile menu button */}
            <Button 
              variant="outline" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="border-t border-secondary-200 bg-white py-3 px-4">
            <nav className="flex flex-col space-y-3">
              <a 
                href="#features" 
                className="text-sm font-medium text-secondary-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="text-sm font-medium text-secondary-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                className="text-sm font-medium text-secondary-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <a 
                href="#contact" 
                className="text-sm font-medium text-secondary-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <a 
                href="#" 
                className="text-sm font-medium text-secondary-700 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
