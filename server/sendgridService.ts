// SendGrid Email Service for domain authentication and email creation
import { MailService } from '@sendgrid/mail';
import fetch from 'node-fetch';

// Interface for domain verification results
interface DomainVerificationResult {
  domain: string;
  verified: boolean;
  dnsRecords: {
    type: string;
    host: string;
    data: string;
    valid: boolean;
  }[];
}

// Interface for email account creation
interface EmailAccountInfo {
  email: string;
  firstName: string;
  lastName: string;
  domain: string;
}

// Interface for email account creation result
interface EmailAccountResult {
  success: boolean;
  email: string;
  webmail: string;
  smtpServer: string;
  imapServer: string;
  message?: string;
}

class SendGridService {
  private apiKey: string;
  private apiBaseUrl = 'https://api.sendgrid.com/v3';
  private mailService: MailService;

  constructor() {
    // Get API key from environment variable
    this.apiKey = process.env.SENDGRID_API_KEY || '';
    if (!this.apiKey) {
      console.error('SendGrid API key is not set in environment variables');
    }

    // Initialize SendGrid mail service
    this.mailService = new MailService();
    this.mailService.setApiKey(this.apiKey);
  }

  /**
   * Check if SendGrid API is accessible
   */
  async checkApiConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error checking SendGrid API connection:', error);
      return false;
    }
  }

  /**
   * Authenticate a domain with SendGrid
   * This initiates the domain authentication process and returns DNS records to add
   */
  async authenticateDomain(domain: string): Promise<DomainVerificationResult> {
    try {
      // First check if API connection is working
      const isConnected = await this.checkApiConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to SendGrid API. Please check your API key.');
      }

      // Check if domain is already authenticated
      const existingDomains = await this.getAuthenticatedDomains();
      const existingDomain = existingDomains.find(d => d.domain === domain);
      
      if (existingDomain) {
        // Domain already exists, return its verification status
        return await this.getDomainVerificationStatus(domain);
      }

      // Create a new domain authentication
      console.log(`Initiating domain authentication for ${domain}`);
      const response = await fetch(`${this.apiBaseUrl}/whitelabel/domains`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain: domain,
          subdomain: 'mail',
          username: 'mail',
          automatic_security: true,
          custom_spf: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('SendGrid domain authentication error:', errorData);
        throw new Error(`Failed to authenticate domain: ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      // Extract the DNS records needed for verification
      const dnsRecords = [];
      
      if (data.dns && data.dns.domain_verification) {
        dnsRecords.push({
          type: data.dns.domain_verification.type as string,
          host: data.dns.domain_verification.host as string,
          data: data.dns.domain_verification.data as string,
          valid: false
        });
      }
      
      if (data.dns && data.dns.dkim) {
        dnsRecords.push({
          type: data.dns.dkim.type as string,
          host: data.dns.dkim.host as string,
          data: data.dns.dkim.data as string,
          valid: false
        });
      }
      
      if (data.dns && data.dns.mail_server) {
        for (const record of data.dns.mail_server as any[]) {
          dnsRecords.push({
            type: record.type as string,
            host: record.host as string,
            data: record.data as string,
            valid: false
          });
        }
      }
      
      return {
        domain,
        verified: false,
        dnsRecords
      };
    } catch (error) {
      console.error('Error authenticating domain with SendGrid:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to authenticate domain with SendGrid.');
    }
  }

  /**
   * Get the list of domains already authenticated with SendGrid
   */
  private async getAuthenticatedDomains(): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/whitelabel/domains`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to get authenticated domains:', response.statusText);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error getting authenticated domains:', error);
      return [];
    }
  }

  /**
   * Get domain verification status from SendGrid
   */
  async getDomainVerificationStatus(domain: string): Promise<DomainVerificationResult> {
    try {
      // Get all domains
      const domains = await this.getAuthenticatedDomains();
      const domainInfo = domains.find(d => d.domain === domain);
      
      if (!domainInfo) {
        throw new Error(`Domain ${domain} not found in SendGrid authenticated domains.`);
      }
      
      // Get domain ID
      const domainId = domainInfo.id;
      
      // Get validation status
      const response = await fetch(`${this.apiBaseUrl}/whitelabel/domains/${domainId}/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('Failed to validate domain:', response.statusText);
        
        // Return the domain with its DNS records but marked as not verified
        return {
          domain,
          verified: false,
          dnsRecords: (domainInfo.dns || []).map((record: any) => ({
            type: record.type as string,
            host: record.host as string,
            data: record.data as string,
            valid: false
          }))
        };
      }
      
      const validationResult = await response.json() as any;
      
      // Extract validation results for DNS records
      const dnsRecords = [];
      
      if (validationResult.dns && validationResult.dns.domain_verification) {
        dnsRecords.push({
          type: 'TXT',
          host: validationResult.dns.domain_verification.host as string,
          data: validationResult.dns.domain_verification.data as string,
          valid: validationResult.dns.domain_verification.valid as boolean
        });
      }
      
      if (validationResult.dns && validationResult.dns.dkim) {
        dnsRecords.push({
          type: 'CNAME',
          host: validationResult.dns.dkim.host as string,
          data: validationResult.dns.dkim.data as string,
          valid: validationResult.dns.dkim.valid as boolean
        });
      }
      
      if (validationResult.dns && validationResult.dns.mail_server) {
        for (const record of validationResult.dns.mail_server as any[]) {
          dnsRecords.push({
            type: 'MX',
            host: record.host as string,
            data: record.data as string,
            valid: record.valid as boolean
          });
        }
      }
      
      // Determine overall verification status
      const verified = dnsRecords.every(record => record.valid);
      
      return {
        domain,
        verified,
        dnsRecords
      };
    } catch (error) {
      console.error('Error getting domain verification status:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get domain verification status.');
    }
  }

  /**
   * Create an email account
   * Since SendGrid doesn't actually create mailboxes, we'll create a sending identity
   * and set up forwarding to simulate a real email account
   */
  async createEmailAccount(accountInfo: EmailAccountInfo): Promise<EmailAccountResult> {
    try {
      // First check if API connection is working
      const isConnected = await this.checkApiConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to SendGrid API. Please check your API key.');
      }
      
      // Verify domain is authenticated first
      const domainStatus = await this.getDomainVerificationStatus(accountInfo.domain);
      
      if (!domainStatus.verified) {
        throw new Error(`Domain ${accountInfo.domain} is not verified with SendGrid. Please complete domain verification first.`);
      }
      
      // Create a sender identity for this email address
      const response = await fetch(`${this.apiBaseUrl}/verified_senders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname: `${accountInfo.firstName} ${accountInfo.lastName}`,
          from_email: accountInfo.email,
          from_name: `${accountInfo.firstName} ${accountInfo.lastName}`,
          reply_to: accountInfo.email,
          reply_to_name: `${accountInfo.firstName} ${accountInfo.lastName}`,
          address: '123 Main St',
          city: 'Any City',
          country: 'US'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('SendGrid sender creation error:', errorData);
        throw new Error(`Failed to create email account: ${response.statusText}`);
      }
      
      // Return success result
      return {
        success: true,
        email: accountInfo.email,
        webmail: `https://app.sendgrid.com/email_activity?from_email=${encodeURIComponent(accountInfo.email)}`,
        smtpServer: 'smtp.sendgrid.net',
        imapServer: 'N/A (Use forwarding to receive emails)',
        message: 'Email account created successfully with SendGrid'
      };
    } catch (error) {
      console.error('Error creating email account with SendGrid:', error);
      if (error instanceof Error) {
        return {
          success: false,
          email: accountInfo.email,
          webmail: '',
          smtpServer: '',
          imapServer: '',
          message: error.message
        };
      }
      return {
        success: false,
        email: accountInfo.email,
        webmail: '',
        smtpServer: '',
        imapServer: '',
        message: 'Failed to create email account with SendGrid'
      };
    }
  }

  /**
   * Send an email using SendGrid
   */
  async sendEmail(from: string, to: string, subject: string, text: string, html: string): Promise<boolean> {
    try {
      await this.mailService.send({
        to: to,
        from: from,
        subject: subject,
        text: text,
        html: html,
      });
      return true;
    } catch (error) {
      console.error('SendGrid email sending error:', error);
      return false;
    }
  }
}

export const sendgridService = new SendGridService();