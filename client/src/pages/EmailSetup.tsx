import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { MailCheck, Check, AlertCircle, Loader2 } from "lucide-react";

// Schema for domain and email validation
const domainFormSchema = z.object({
  domainName: z.string()
    .min(3, { message: "Domain name must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, {
      message: "Please enter a valid domain (e.g., yourbusiness.com)",
    }),
  domainOwnership: z.enum(["new", "existing"]),
});

const emailFormSchema = z.object({
  emailPrefix: z.string()
    .min(2, { message: "Email prefix must be at least 2 characters" })
    .regex(/^[a-zA-Z0-9._%+-]+$/, {
      message: "Please enter a valid email prefix (letters, numbers, ., _, %, +, -)",
    }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  emailProvider: z.string().min(1, { message: "Please select an email provider" }),
});

type DomainFormValues = z.infer<typeof domainFormSchema>;
type EmailFormValues = z.infer<typeof emailFormSchema>;

const EmailSetup = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<"domain" | "email" | "verify" | "complete">("domain");
  const [domain, setDomain] = useState("");
  
  // Domain setup form
  const domainForm = useForm<DomainFormValues>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: {
      domainName: "",
      domainOwnership: "existing",
    },
  });
  
  // Email setup form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      emailPrefix: "",
      firstName: "",
      lastName: "",
      emailProvider: "",
    },
  });

  // Domain validation mutation
  const domainMutation = useMutation({
    mutationFn: (data: DomainFormValues) => {
      return apiRequest("POST", "/api/validate-domain", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Domain validated",
        description: "Your domain has been successfully validated.",
      });
      setDomain(domainForm.getValues().domainName);
      setCurrentStep("email");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to validate domain. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Email creation mutation
  const emailMutation = useMutation({
    mutationFn: (data: EmailFormValues & { domain: string }) => {
      return apiRequest("POST", "/api/create-email", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Email created",
        description: `Your email address ${emailForm.getValues().emailPrefix}@${domain} has been created successfully.`,
      });
      setCurrentStep("complete");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create email address. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Form submission handlers
  const onDomainSubmit = (data: DomainFormValues) => {
    domainMutation.mutate(data);
  };

  const onEmailSubmit = (data: EmailFormValues) => {
    emailMutation.mutate({
      ...data,
      domain: domain
    });
  };

  return (
    <div className="container py-16 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <MailCheck className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold">Create Your Professional Email</h1>
          </div>
          <p className="text-xl text-secondary-600">
            Set up your custom domain email address in a few simple steps.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === "domain" 
                  ? "bg-primary text-white" 
                  : "bg-primary/20 text-primary"
              }`}>
                {currentStep !== "domain" ? <Check className="h-5 w-5" /> : "1"}
              </div>
              <span className="text-sm mt-1">Domain Setup</span>
            </div>
            <div className="w-full mx-4 h-1 bg-secondary-200">
              <div className={`h-full bg-primary ${
                currentStep !== "domain" ? "w-full" : "w-0"
              } transition-all duration-300`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === "email" 
                  ? "bg-primary text-white" 
                  : currentStep === "verify" || currentStep === "complete" 
                  ? "bg-primary/20 text-primary" 
                  : "bg-secondary-200 text-secondary-400"
              }`}>
                {currentStep === "verify" || currentStep === "complete" ? <Check className="h-5 w-5" /> : "2"}
              </div>
              <span className="text-sm mt-1">Email Setup</span>
            </div>
            <div className="w-full mx-4 h-1 bg-secondary-200">
              <div className={`h-full bg-primary ${
                currentStep === "verify" || currentStep === "complete" ? "w-full" : "w-0"
              } transition-all duration-300`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === "complete" 
                  ? "bg-primary/20 text-primary" 
                  : currentStep === "verify"
                  ? "bg-primary text-white"
                  : "bg-secondary-200 text-secondary-400"
              }`}>
                {currentStep === "complete" ? <Check className="h-5 w-5" /> : "3"}
              </div>
              <span className="text-sm mt-1">Completion</span>
            </div>
          </div>
        </div>

        {/* Domain Setup Step */}
        {currentStep === "domain" && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Set Up Your Domain</CardTitle>
              <CardDescription>
                Choose a domain name for your professional email addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...domainForm}>
                <form onSubmit={domainForm.handleSubmit(onDomainSubmit)} className="space-y-6">
                  <Tabs defaultValue="existing" onValueChange={(value) => 
                    domainForm.setValue("domainOwnership", value as "new" | "existing")
                  }>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="existing">I have a domain</TabsTrigger>
                      <TabsTrigger value="new">I need a domain</TabsTrigger>
                    </TabsList>
                    <TabsContent value="existing" className="pt-4">
                      <FormField
                        control={domainForm.control}
                        name="domainName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Domain Name</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-secondary-300 bg-secondary-50 text-secondary-500 text-sm">
                                  www.
                                </span>
                                <Input placeholder="yourbusiness.com" className="rounded-l-none" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="mt-4 bg-blue-50 p-4 rounded-md">
                        <p className="text-sm text-blue-700">
                          You'll need to verify ownership of this domain in the next step. 
                          Have your domain provider login details ready.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="new" className="pt-4">
                      <FormField
                        control={domainForm.control}
                        name="domainName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Choose a Domain Name</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-secondary-300 bg-secondary-50 text-secondary-500 text-sm">
                                  www.
                                </span>
                                <Input placeholder="yourbusiness.com" className="rounded-l-none" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="mt-4 bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-green-700">
                          We'll help you register this domain name. Domain registration is free as part of our service.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={domainMutation.isPending}
                  >
                    {domainMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      "Continue to Email Setup"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Email Setup Step */}
        {currentStep === "email" && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Create Your Email Address</CardTitle>
              <CardDescription>
                Set up your professional email with your domain {domain}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <div className="bg-secondary-50 p-4 rounded-md mb-2">
                    <h3 className="font-medium text-sm text-secondary-700">Your Domain:</h3>
                    <p className="text-primary font-medium">{domain}</p>
                  </div>
                  
                  <div className="grid gap-4">
                    <FormField
                      control={emailForm.control}
                      name="emailPrefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input {...field} placeholder="john.doe" className="rounded-r-none" />
                              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-secondary-300 bg-secondary-50 text-secondary-500 text-sm">
                                @{domain}
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={emailForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="John" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={emailForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Doe" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={emailForm.control}
                      name="emailProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Provider</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an email provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="google">Google Workspace</SelectItem>
                              <SelectItem value="microsoft">Microsoft 365</SelectItem>
                              <SelectItem value="zoho">Zoho Mail</SelectItem>
                              <SelectItem value="maildomainpro">MailDomainPro Default</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setCurrentStep("domain")}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={emailMutation.isPending}
                    >
                      {emailMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Email...
                        </>
                      ) : (
                        "Create Email Address"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Completion Step */}
        {currentStep === "complete" && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Your Email Address is Ready!</CardTitle>
              <CardDescription>
                You can now use your professional email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary-50 p-6 rounded-lg text-center mb-6">
                <h3 className="text-lg font-medium text-secondary-900 mb-1">Your new email address:</h3>
                <p className="text-xl font-bold text-primary">
                  {emailForm.getValues().emailPrefix}@{domain}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Email Address Created
                  </h4>
                  <p className="text-secondary-600 text-sm">
                    Your email address has been successfully created and is ready to use.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    DNS Records Configured
                  </h4>
                  <p className="text-secondary-600 text-sm">
                    All necessary DNS records have been set up for your domain.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Security Enabled
                  </h4>
                  <p className="text-secondary-600 text-sm">
                    Spam filtering, anti-phishing, and encryption are all enabled for your email.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full">
                Go to Email Dashboard
              </Button>
              <Button variant="outline" className="w-full">
                Set Up Email on My Devices
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmailSetup;