import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
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
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  AlertCircle, 
  Check, 
  Copy, 
  ExternalLink,
  Globe,
  HelpCircle, 
  Info, 
  Loader2, 
  LucideIcon, 
  MailCheck,
  RefreshCw 
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Domain verification schema
const domainSchema = z.object({
  domain: z.string()
    .min(3, { message: "Domain must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, {
      message: "Please enter a valid domain (e.g., yourbusiness.com)",
    }),
});

type DomainFormValues = z.infer<typeof domainSchema>;

// MX Record verification schema
const verifyMxSchema = z.object({
  domainId: z.string(),
  verificationCode: z.string().min(6, { message: "Verification code must be at least 6 characters" }),
});

type VerifyMxFormValues = z.infer<typeof verifyMxSchema>;

interface DnsRecord {
  type: string;
  host: string;
  value: string;
  priority?: number;
  status?: "pending" | "verified" | "failed";
}

interface DomainVerificationInfo {
  domainId: string;
  verificationCode: string;
  dnsRecords: DnsRecord[];
}

const DomainConnect = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"input" | "verify" | "setup" | "complete">("input");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "checking" | "success" | "partial" | "failed">("idle");
  const [domainInfo, setDomainInfo] = useState<DomainVerificationInfo | null>(null);
  const [recordStatuses, setRecordStatuses] = useState<{[key: string]: "pending" | "verified" | "failed"}>({});
  
  // Domain input form
  const domainForm = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: "",
    },
  });
  
  // MX verification form
  const verifyMxForm = useForm<VerifyMxFormValues>({
    resolver: zodResolver(verifyMxSchema),
    defaultValues: {
      domainId: "",
      verificationCode: "",
    },
  });
  
  // Define response types for API calls
  interface DomainCheckResponse {
    message: string;
    domainId: string;
    verificationCode: string;
    dnsRecords: DnsRecord[];
  }
  
  interface DnsVerificationRecord {
    type: string;
    host: string;
    verified: boolean;
  }
  
  interface DnsVerificationResponse {
    message: string;
    records: DnsVerificationRecord[];
    allVerified: boolean;
  }

  // Domain check mutation
  const domainMutation = useMutation({
    mutationFn: (data: DomainFormValues) => {
      return apiRequest<DomainCheckResponse>("POST", "/api/domain/check", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Domain check successful",
        description: "We'll now help you set up DNS records for your domain.",
      });
      
      // Initialize domain verification info
      setDomainInfo({
        domainId: data.domainId,
        verificationCode: data.verificationCode,
        dnsRecords: data.dnsRecords
      });
      
      // Update verification form with domain ID
      verifyMxForm.setValue("domainId", data.domainId);
      
      // Move to the verification step
      setStep("verify");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to validate domain. Please try again.",
        variant: "destructive",
      });
    }
  });

  // DNS verification mutation
  const verifyDnsMutation = useMutation({
    mutationFn: (data: { domain: string }) => {
      return apiRequest<DnsVerificationResponse>("POST", "/api/domain/verify-dns", data);
    },
    onSuccess: (data) => {
      // Update records status
      const newStatuses = {...recordStatuses};
      
      data.records.forEach((record) => {
        newStatuses[`${record.type}-${record.host}`] = record.verified ? "verified" : "failed";
      });
      
      setRecordStatuses(newStatuses);
      
      // Determine overall status
      const allVerified = data.records.every((r) => r.verified);
      const anyVerified = data.records.some((r) => r.verified);
      
      if (allVerified) {
        setVerificationStatus("success");
        toast({
          title: "DNS verification complete",
          description: "All DNS records have been successfully verified.",
        });
      } else if (anyVerified) {
        setVerificationStatus("partial");
        toast({
          title: "Partial DNS verification",
          description: "Some DNS records were verified, but others are still pending.",
        });
      } else {
        setVerificationStatus("failed");
        toast({
          title: "DNS verification failed",
          description: "We couldn't verify your DNS records. Please check your settings.",
          variant: "destructive",
        });
      }
      
      setIsVerifying(false);
    },
    onError: (error) => {
      setIsVerifying(false);
      setVerificationStatus("failed");
      toast({
        title: "Verification Error",
        description: error.message || "Failed to verify DNS records. Please try again.",
        variant: "destructive",
      });
    }
  });

  // MX verification response type
  interface MxVerificationResponse {
    message: string;
    verified: boolean;
  }
  
  // MX verification mutation
  const verifyMxMutation = useMutation({
    mutationFn: (data: VerifyMxFormValues) => {
      return apiRequest<MxVerificationResponse>("POST", "/api/domain/verify-mx", data);
    },
    onSuccess: (data) => {
      toast({
        title: "MX verification successful",
        description: "Your MX records have been verified. You can now create email addresses.",
      });
      
      // Move to setup step
      setStep("setup");
    },
    onError: (error) => {
      toast({
        title: "Verification Error",
        description: error.message || "Failed to verify MX records. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Domain submission handler
  const onDomainSubmit = (data: DomainFormValues) => {
    domainMutation.mutate(data);
  };
  
  // MX verification submission handler
  const onVerifyMxSubmit = (data: VerifyMxFormValues) => {
    verifyMxMutation.mutate(data);
  };
  
  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };
  
  // Function to verify DNS records
  const verifyDnsRecords = () => {
    if (!domainForm.getValues().domain) return;
    
    setIsVerifying(true);
    setVerificationStatus("checking");
    
    verifyDnsMutation.mutate({
      domain: domainForm.getValues().domain
    });
  };
  
  // Function to proceed to email setup
  const proceedToEmailSetup = () => {
    // Store domain information in session storage for use in email setup
    sessionStorage.setItem('connectedDomain', domainForm.getValues().domain);
    sessionStorage.setItem('domainVerified', 'true');
    
    // Navigate to email setup
    setLocation("/email-setup");
  };

  return (
    <div className="container py-16 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold">Connect Your Domain</h1>
          </div>
          <p className="text-xl text-secondary-600">
            Set up your domain for professional email addresses.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === "input" 
                  ? "bg-primary text-white" 
                  : "bg-primary/20 text-primary"
              }`}>
                {step !== "input" ? <Check className="h-5 w-5" /> : "1"}
              </div>
              <span className="text-sm mt-1">Enter Domain</span>
            </div>
            <div className="w-full mx-4 h-1 bg-secondary-200">
              <div className={`h-full bg-primary ${
                step !== "input" ? "w-full" : "w-0"
              } transition-all duration-300`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === "verify" 
                  ? "bg-primary text-white" 
                  : step === "setup" || step === "complete" 
                  ? "bg-primary/20 text-primary" 
                  : "bg-secondary-200 text-secondary-400"
              }`}>
                {step === "setup" || step === "complete" ? <Check className="h-5 w-5" /> : "2"}
              </div>
              <span className="text-sm mt-1">Verify DNS</span>
            </div>
            <div className="w-full mx-4 h-1 bg-secondary-200">
              <div className={`h-full bg-primary ${
                step === "setup" || step === "complete" ? "w-full" : "w-0"
              } transition-all duration-300`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === "setup" 
                  ? "bg-primary text-white" 
                  : step === "complete"
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary-200 text-secondary-400"
              }`}>
                {step === "complete" ? <Check className="h-5 w-5" /> : "3"}
              </div>
              <span className="text-sm mt-1">Email Setup</span>
            </div>
          </div>
        </div>

        {/* Domain Input Step */}
        {step === "input" && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Enter Your Domain</CardTitle>
              <CardDescription>
                Provide the domain you want to use for your professional email addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...domainForm}>
                <form onSubmit={domainForm.handleSubmit(onDomainSubmit)} className="space-y-6">
                  <FormField
                    control={domainForm.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Domain Name</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input 
                              placeholder="yourbusiness.com" 
                              {...field} 
                              className="w-full"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      You need to have full access to your domain's DNS settings to complete the setup process.
                      Make sure you can add TXT, MX, and CNAME records to your domain.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={domainMutation.isPending}
                  >
                    {domainMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking Domain...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* DNS Verification Step */}
        {step === "verify" && domainInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Configure DNS Records</CardTitle>
              <CardDescription>
                Add the following DNS records to your domain ({domainForm.getValues().domain})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    These records allow your domain to receive emails and verify ownership.
                    Add them through your domain registrar's DNS management panel.
                  </AlertDescription>
                </Alert>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>DNS records to be added to your domain</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Host/Name</TableHead>
                        <TableHead>Value/Points to</TableHead>
                        <TableHead className="w-[100px]">Priority</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {domainInfo.dnsRecords.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{record.type}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{record.host}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6"
                                      onClick={() => copyToClipboard(record.host)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy to clipboard</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm break-all">{record.value}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 flex-shrink-0"
                                      onClick={() => copyToClipboard(record.value)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy to clipboard</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell>{record.priority || "N/A"}</TableCell>
                          <TableCell className="text-right">
                            {recordStatuses[`${record.type}-${record.host}`] === "verified" ? (
                              <div className="flex items-center justify-end">
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="ml-1 text-xs text-green-500">Verified</span>
                              </div>
                            ) : recordStatuses[`${record.type}-${record.host}`] === "failed" ? (
                              <div className="flex items-center justify-end">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="ml-1 text-xs text-red-500">Failed</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end">
                                <span className="text-xs text-secondary-500">Pending</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      onClick={verifyDnsRecords}
                      disabled={isVerifying}
                      className="flex items-center"
                    >
                      {isVerifying ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      {isVerifying ? "Verifying..." : "Verify DNS Records"}
                    </Button>
                    
                    <div className="text-sm text-secondary-500">
                      DNS changes can take up to 48 hours to propagate.
                    </div>
                  </div>
                  
                  {verificationStatus === "success" && (
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Success!</AlertTitle>
                      <AlertDescription className="text-green-700">
                        All DNS records have been verified. You can now proceed to set up your email addresses.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {verificationStatus === "partial" && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertTitle className="text-yellow-800">Partial Verification</AlertTitle>
                      <AlertDescription className="text-yellow-700">
                        Some DNS records are still pending verification. You can continue to the next step,
                        but some features may be limited until all records are verified.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {verificationStatus === "failed" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Verification Failed</AlertTitle>
                      <AlertDescription>
                        We couldn't verify your DNS records. Please check your DNS settings and try again.
                        Make sure all records have been properly added to your domain registrar.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="instructions">
                    <AccordionTrigger>
                      <span className="flex items-center">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        How to add DNS records
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <p className="text-sm text-secondary-600">
                          To add these DNS records, follow these general steps:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2 text-sm text-secondary-600">
                          <li>Log in to your domain registrar (e.g., GoDaddy, Namecheap, Google Domains)</li>
                          <li>Navigate to the DNS management or DNS settings page</li>
                          <li>Look for an option to add a new DNS record</li>
                          <li>Select the record type (TXT, MX, CNAME) as indicated in the table</li>
                          <li>Enter the Host/Name and Value exactly as shown</li>
                          <li>For MX records, set the priority as indicated</li>
                          <li>Save the changes</li>
                        </ol>
                        <p className="text-sm text-secondary-600">
                          DNS changes may take some time to propagate (up to 48 hours), though most changes
                          take effect within an hour.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setStep("input")}
              >
                Back
              </Button>
              <Button 
                onClick={() => setStep("setup")}
                disabled={verificationStatus !== "success" && verificationStatus !== "partial"}
              >
                Continue to Email Setup
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Final Verification Step */}
        {step === "setup" && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Finalize Domain Setup</CardTitle>
              <CardDescription>
                Your domain is almost ready for email. Complete the final verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    DNS configuration has been verified for {domainForm.getValues().domain}
                  </AlertDescription>
                </Alert>
                
                <div className="p-4 bg-secondary-50 rounded-md border border-secondary-200">
                  <h3 className="text-lg font-medium mb-2">Domain Connection Summary</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-1 mr-2" />
                      <span>Domain ownership verified</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-1 mr-2" />
                      <span>DNS records configured properly</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-1 mr-2" />
                      <span>Email receiving capability enabled</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-1 mr-2" />
                      <span>SPF records configured for email sending</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <p className="mb-4 text-secondary-600">
                    Your domain {domainForm.getValues().domain} is now ready to create email addresses!
                  </p>
                  <Button 
                    onClick={proceedToEmailSetup}
                    size="lg"
                    className="px-8"
                  >
                    <MailCheck className="mr-2 h-5 w-5" />
                    Create Email Addresses
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setStep("verify")}
              >
                Back to DNS Settings
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DomainConnect;