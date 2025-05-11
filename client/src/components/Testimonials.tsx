import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  return (
    <section className="py-16 bg-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Trusted by Businesses Worldwide</h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            See what our customers have to say about their experience with MailDomainPro.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="testimonial-card">
            <div className="flex-1">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-secondary-700 mb-4">
                "Setting up professional email for our startup was incredibly easy with MailDomainPro. The guided setup process saved us hours of technical headaches."
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Emily Robertson portrait" 
                  className="w-10 h-10 rounded-full mr-3 object-cover" 
                />
                <div>
                  <p className="font-medium">Emily Robertson</p>
                  <p className="text-sm text-secondary-500">CEO, DesignHub</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="flex-1">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-secondary-700 mb-4">
                "The security features are impressive. We moved from a generic email provider and immediately noticed the reduction in spam and phishing attempts."
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Michael Chen portrait" 
                  className="w-10 h-10 rounded-full mr-3 object-cover" 
                />
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-sm text-secondary-500">CTO, CloudSecure</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="flex-1">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-secondary-700 mb-4">
                "Customer support has been outstanding. They helped us migrate 50+ email accounts from our old provider with zero downtime. Couldn't be happier."
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Sarah Johnson portrait" 
                  className="w-10 h-10 rounded-full mr-3 object-cover" 
                />
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-secondary-500">Operations Manager, Global Retail</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white rounded-lg border border-secondary-200 p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <Star className="h-4 w-4 fill-current" fill="none" />
                </div>
                <span className="text-secondary-700 font-medium">4.9 out of 5 stars from 500+ reviews</span>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                "MailDomainPro transformed our company's professional image overnight."
              </h3>
              <p className="text-secondary-700 mb-6">
                "As a growing law firm, we needed email addresses that matched our domain name. MailDomainPro made it simple to set up, manage, and secure our team's email. The migration support was exceptional, and our clients now receive emails from our branded addresses, enhancing our credibility instantly."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Robert Williams portrait" 
                  className="w-12 h-12 rounded-full mr-4 object-cover" 
                />
                <div>
                  <p className="font-medium text-lg">Robert Williams</p>
                  <p className="text-secondary-500">Managing Partner, Williams & Associates Law</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-full flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
                alt="Professional office environment" 
                className="rounded-lg shadow-lg" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
