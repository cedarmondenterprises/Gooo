import { Button } from "@/components/ui/button";

const Cta = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Professional Business Email?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust MailDomainPro for their professional email needs. Get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="#pricing">
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto text-primary-700 bg-white hover:bg-primary-50"
              >
                View Pricing Plans
              </Button>
            </a>
            <a href="#domain-setup">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-primary-300 text-white hover:bg-primary-700"
              >
                Create Your Email
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
