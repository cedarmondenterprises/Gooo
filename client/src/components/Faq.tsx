import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen?: boolean;
}

const FaqItem = ({ question, answer, isOpen = false }: FaqItemProps) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  return (
    <Card className="p-4">
      <button 
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-lg font-medium">{question}</span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-secondary-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-secondary-500" />
        )}
      </button>
      <div className={`mt-3 text-secondary-600 ${isExpanded ? '' : 'hidden'}`}>
        <p>{answer}</p>
      </div>
    </Card>
  );
};

const Faq = () => {
  const faqItems = [
    {
      question: "How does the domain verification process work?",
      answer: "Domain verification is a simple process that confirms you own the domain. We'll provide you with a TXT record that you'll add to your domain's DNS settings. Once verified, you can create email addresses with that domain. Our step-by-step guide makes this process straightforward, even for those without technical experience.",
      isOpen: true
    },
    {
      question: "Can I use my existing email address with your service?",
      answer: "Yes, you can migrate from your existing email provider to our service. We offer migration tools and support to help transfer your emails, contacts, and calendar data. Our team can assist with the entire process to ensure a smooth transition without data loss."
    },
    {
      question: "What email clients can I use with your service?",
      answer: "Our service is compatible with all major email clients, including Microsoft Outlook, Apple Mail, Gmail, Thunderbird, and mobile email apps. We support standard protocols (IMAP, POP3, SMTP) for maximum compatibility. You can also access your email through our webmail interface from any browser."
    },
    {
      question: "How do I add or remove email accounts?",
      answer: "Adding or removing email accounts is simple through our admin dashboard. Administrators can create new accounts, set permissions, and manage storage allocations in just a few clicks. You only pay for active accounts, and you can add or remove users as your business needs change."
    },
    {
      question: "What security features are included?",
      answer: "Our service includes comprehensive security features such as spam filtering, virus protection, phishing defense, and TLS encryption for all emails. Business and Enterprise plans include additional features like two-factor authentication, advanced threat protection, and data loss prevention tools."
    }
  ];

  return (
    <section id="faq" className="py-16 bg-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Get answers to common questions about our business email services.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <FaqItem 
                key={index} 
                question={item.question} 
                answer={item.answer}
                isOpen={item.isOpen}
              />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-secondary-600 mb-4">Don't see your question here?</p>
            <a href="#contact">
              <Button variant="outline">
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
