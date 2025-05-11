// Email service for validating domains and creating email accounts
import crypto from 'crypto';
import { sendgridService } from './sendgridService';

interface DomainValidationResult {
  isAvailable: boolean;
  mxRecordsValid: boolean;
  dnsVerified: boolean;
}

interface EmailAccountInfo {
  emailAddress: string;
  firstName: string;
  lastName: string;
  provider: string;
  domain: string;
}

interface EmailAccountCreationResult {
  success: boolean;
  mailboxSetup: boolean;
  webmailUrl: string;
  smtpHost: string;
  smtpPort: number;
  imapHost: string;
  imapPort: number;
  dnsRecords: {
    type: string;
    host: string;
    value: string;
  }[];
}

class EmailService {
  // Email provider configurations for different tiers
  private providerConfigs: {
    [key: string]: {
      displayName: string;
      smtpHost: string;
      smtpPort: number;
      imapHost: string;
      imapPort: number;
      webmailUrl: string;
    };
  } = {
    standard: {
      displayName: 'Standard Email',
      smtpHost: 'smtp.sendgrid.net',
      smtpPort: 587,
      imapHost: 'N/A - Use email forwarding',
      imapPort: 0,
      webmailUrl: 'https://app.sendgrid.com'
    },
    business: {
      displayName: 'Business Email',
      smtpHost: 'smtp.sendgrid.net',
      smtpPort: 587,
      imapHost: 'N/A - Use email forwarding',
      imapPort: 0,
      webmailUrl: 'https://app.sendgrid.com'
    },
    enterprise: {
      displayName: 'Enterprise Email',
      smtpHost: 'smtp.sendgrid.net',
      smtpPort: 587,
      imapHost: 'N/A - Use email forwarding',
      imapPort: 0, 
      webmailUrl: 'https://app.sendgrid.com'
    }
  };

  /**
   * Validate a domain for email setup
   * This checks if the domain is properly verified with SendGrid
   */
  async validateDomain(domainName: string): Promise<DomainValidationResult> {
    try {
      console.log(`Validating domain: ${domainName} with SendGrid`);
      
      // Check API connection first
      const apiConnected = await sendgridService.checkApiConnection();
      if (!apiConnected) {
        throw new Error('Unable to connect to the email service. Please check your API key.');
      }
      
      // Get domain verification status from SendGrid
      const domainStatus = await sendgridService.getDomainVerificationStatus(domainName);
      
      return {
        isAvailable: true, // Domain availability is checked earlier in the flow
        mxRecordsValid: domainStatus.verified, // This checks if SendGrid can receive emails
        dnsVerified: domainStatus.verified // Overall verification status
      };
    } catch (error) {
      console.error('Error validating domain with SendGrid:', error);
      
      // If domain isn't found, it means it's not set up yet
      if (error instanceof Error && error.message.includes('not found')) {
        return {
          isAvailable: true,
          mxRecordsValid: false,
          dnsVerified: false
        };
      }
      
      // For other errors, throw
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to validate domain. The email service may be temporarily unavailable.');
    }
  }

  /**
   * Create an email account for a domain using SendGrid
   */
  async createEmailAccount(account: EmailAccountInfo): Promise<EmailAccountCreationResult> {
    try {
      console.log(`Creating email account: ${account.emailAddress} with SendGrid`);
      
      // Check SendGrid connection
      const apiConnected = await sendgridService.checkApiConnection();
      if (!apiConnected) {
        throw new Error('Unable to connect to SendGrid. Please check your API key.');
      }
      
      // Create the email account on SendGrid
      const emailAccountResult = await sendgridService.createEmailAccount({
        email: account.emailAddress,
        firstName: account.firstName,
        lastName: account.lastName,
        domain: account.domain
      });
      
      if (!emailAccountResult.success) {
        throw new Error(emailAccountResult.message || 'Failed to create email account with SendGrid.');
      }
      
      // Get provider configuration
      const provider = this.providerConfigs[account.provider] || this.providerConfigs.standard;
      
      // Return success result with SendGrid details
      return {
        success: true,
        mailboxSetup: true,
        webmailUrl: emailAccountResult.webmail,
        smtpHost: emailAccountResult.smtpServer || provider.smtpHost,
        smtpPort: provider.smtpPort,
        imapHost: provider.imapHost,
        imapPort: provider.imapPort,
        dnsRecords: [
          {
            type: 'MX',
            host: account.domain,
            value: 'mx.sendgrid.net'
          },
          {
            type: 'TXT',
            host: account.domain,
            value: 'v=spf1 include:sendgrid.net ~all'
          }
        ]
      };
    } catch (error) {
      console.error('Error creating email account with SendGrid:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create email account with SendGrid. Please try again later.');
    }
  }
  
  /**
   * Check if an email address is available
   * This performs basic validation and assumes the email is available
   * (SendGrid doesn't have an API to check availability)
   */
  async checkEmailAvailability(emailAddress: string, domain: string): Promise<boolean> {
    try {
      // Check if API is available
      const apiConnected = await sendgridService.checkApiConnection();
      if (!apiConnected) {
        throw new Error('Unable to connect to the email service. Please check your API key.');
      }
      
      // This is a basic validation since SendGrid doesn't offer an API to check availability
      const validEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!validEmailPattern.test(`${emailAddress}@${domain}`)) {
        return false;
      }
      
      // For SendGrid, any valid email format is considered available
      return true;
    } catch (error) {
      console.error('Error checking email availability:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to check email availability. Please try again later.');
    }
  }
  
  /**
   * Send a test email using the newly created account
   */
  async sendTestEmail(from: string, to: string, subject: string = 'Test Email'): Promise<boolean> {
    const text = 'This is a test email sent from your new email account.';
    const html = '<p>This is a test email sent from your new email account.</p>';
    
    try {
      return await sendgridService.sendEmail(from, to, subject, text, html);
    } catch (error) {
      console.error('Error sending test email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();