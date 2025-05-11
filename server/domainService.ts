// Domain service for managing domain verification and DNS records
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import fetch from 'node-fetch';
import { sendgridService } from './sendgridService';

interface DnsRecord {
  type: string;
  host: string;
  value: string;
  priority?: number;
}

interface DomainVerificationResult {
  domainId: string;
  verificationCode: string;
  dnsRecords: DnsRecord[];
}

interface DnsVerificationResult {
  records: {
    type: string;
    host: string;
    verified: boolean;
  }[];
  allVerified: boolean;
}

interface MxVerificationResult {
  verified: boolean;
  message: string;
}

// Google DNS API response interfaces
interface GoogleDnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface GoogleDnsResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: Array<{
    name: string;
    type: number;
  }>;
  Answer?: GoogleDnsAnswer[];
}

// DNS record type mappings
const DNS_TYPES: { [key: string]: number } = {
  A: 1,
  NS: 2,
  CNAME: 5,
  SOA: 6,
  PTR: 12,
  MX: 15,
  TXT: 16,
  AAAA: 28,
  SRV: 33,
  CAA: 257
};

// In-memory storage for domain verification info
const domainVerifications = new Map<string, DomainVerificationResult>();

class DomainService {
  private googleDnsApiEndpoint = 'https://dns.google/resolve';
  
  /**
   * Check domain availability and generate verification records
   */
  async checkDomain(domain: string): Promise<DomainVerificationResult> {
    try {
      // Check if domain exists by querying DNS
      const domainExists = await this.checkDomainExists(domain);
      
      if (!domainExists) {
        throw new Error(`The domain ${domain} doesn't appear to exist. Please check the spelling and try again.`);
      }
      
      // Generate a unique domain ID
      const domainId = uuidv4();
      
      // Generate a verification code
      const verificationCode = crypto.randomBytes(6).toString('hex');
      
      // Get real SendGrid DNS verification records
      console.log(`Authenticating ${domain} with SendGrid...`);
      const sendgridDomainResult = await sendgridService.authenticateDomain(domain);
      
      // Convert SendGrid records to our format
      const dnsRecords: DnsRecord[] = sendgridDomainResult.dnsRecords.map(record => ({
        type: record.type,
        host: record.host,
        value: record.data,
        priority: record.type === 'MX' ? 10 : undefined // Add priority for MX records
      }));
      
      // Add our own verification record
      dnsRecords.push({
        type: 'TXT',
        host: `_maildomainpro.${domain}`,
        value: `verification=${verificationCode}`
      });
      
      // Store verification info
      const verificationInfo: DomainVerificationResult = {
        domainId,
        verificationCode,
        dnsRecords
      };
      
      domainVerifications.set(domain, verificationInfo);
      
      return verificationInfo;
    } catch (error) {
      console.error('Error checking domain:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to check domain. Please try again later.');
    }
  }
  
  /**
   * Check if a domain exists by querying for its NS records
   */
  private async checkDomainExists(domain: string): Promise<boolean> {
    try {
      // Query for NS records - if a domain exists, it should have NS records
      const response = await this.queryDns(domain, 'NS');
      
      // If we got a valid response with answers, the domain exists
      return response.Status === 0 && Array.isArray(response.Answer) && response.Answer.length > 0;
    } catch (error) {
      console.error('Error checking if domain exists:', error);
      // Assume the domain doesn't exist if we can't verify
      return false;
    }
  }
  
  /**
   * Query Google's public DNS API
   */
  private async queryDns(name: string, type: string): Promise<GoogleDnsResponse> {
    const typeCode = DNS_TYPES[type] || 1; // Default to A record
    const url = `${this.googleDnsApiEndpoint}?name=${encodeURIComponent(name)}&type=${typeCode}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`DNS query failed with status: ${response.status}`);
      }
      
      return await response.json() as GoogleDnsResponse;
    } catch (error) {
      console.error('Error querying DNS:', error);
      throw new Error('Failed to query DNS. Please try again later.');
    }
  }
  
  /**
   * Verify DNS records for a domain
   * This makes actual DNS queries to verify the records
   */
  async verifyDnsRecords(domain: string): Promise<DnsVerificationResult> {
    try {
      // Get the verification info
      const verificationInfo = domainVerifications.get(domain);
      
      if (!verificationInfo) {
        throw new Error('Domain verification info not found');
      }
      
      // First check with SendGrid for verification status
      let sendgridVerification: any = null;
      try {
        console.log(`Checking SendGrid verification status for ${domain}...`);
        sendgridVerification = await sendgridService.getDomainVerificationStatus(domain);
        console.log(`SendGrid verification result:`, sendgridVerification);
      } catch (error) {
        console.error('Error checking with SendGrid:', error);
        // Continue with our own verification if SendGrid fails
      }
      
      // Verify each DNS record
      const verificationResults = await Promise.all(
        verificationInfo.dnsRecords.map(async (record) => {
          let verified = false;
          
          // First check if the record is verified by SendGrid
          if (sendgridVerification) {
            const sendgridRecord = sendgridVerification.dnsRecords.find(
              (r: any) => r.type === record.type && r.host === record.host
            );
            
            if (sendgridRecord && sendgridRecord.valid) {
              verified = true;
              return {
                type: record.type,
                host: record.host,
                verified: true
              };
            }
          }
          
          // If not verified by SendGrid, verify using DNS lookup
          try {
            // Construct the full hostname for the query
            const hostname = record.host === domain ? 
              domain : 
              record.host;
            
            // Query for the specific record type
            const dnsResponse = await this.queryDns(hostname, record.type);
            
            if (dnsResponse.Status === 0 && dnsResponse.Answer) {
              // Look for the specific value in the answers
              if (record.type === 'MX') {
                // MX records have priority and hostname separated by space
                verified = dnsResponse.Answer.some(answer => {
                  const parts = answer.data.split(' ');
                  // Check if priority and hostname match
                  return (parts.length > 1 && 
                          parseInt(parts[0], 10) === (record.priority || 0) && 
                          parts[1].toLowerCase() === record.value.toLowerCase());
                });
              } else if (record.type === 'TXT') {
                // TXT records may have quotes that need to be removed
                verified = dnsResponse.Answer.some(answer => {
                  // Remove quotes if present
                  const cleanData = answer.data.replace(/^"(.*)"$/, '$1');
                  return cleanData.includes(record.value);
                });
              } else {
                // For other record types, directly compare values
                verified = dnsResponse.Answer.some(answer => 
                  answer.data.toLowerCase() === record.value.toLowerCase());
              }
            }
          } catch (error) {
            console.error(`Error verifying record ${record.type} for ${record.host}:`, error);
            // Leave verified as false if there was an error
          }
          
          return {
            type: record.type,
            host: record.host,
            verified
          };
        })
      );
      
      const allVerified = verificationResults.every(r => r.verified);
      
      return {
        records: verificationResults,
        allVerified
      };
    } catch (error) {
      console.error('Error verifying DNS records:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to verify DNS records. Please try again later.');
    }
  }
  
  /**
   * Verify MX records for a domain
   */
  async verifyMxRecords(domainId: string, verificationCode: string): Promise<MxVerificationResult> {
    try {
      // Find the domain by domainId
      let foundDomain: string | undefined;
      let foundVerification: DomainVerificationResult | undefined;
      
      // Convert entries to array to avoid downlevelIteration issues
      const entries = Array.from(domainVerifications.entries());
      for (const [domain, verification] of entries) {
        if (verification.domainId === domainId) {
          foundDomain = domain;
          foundVerification = verification;
          break;
        }
      }
      
      if (!foundDomain || !foundVerification) {
        throw new Error('Domain verification info not found');
      }
      
      // Verify the verification code
      if (foundVerification.verificationCode !== verificationCode) {
        return {
          verified: false,
          message: 'Invalid verification code'
        };
      }
      
      // Check with SendGrid first for domain verification
      try {
        const sendgridVerification = await sendgridService.getDomainVerificationStatus(foundDomain);
        
        if (sendgridVerification.verified) {
          return {
            verified: true,
            message: 'Domain verified successfully with SendGrid'
          };
        }
      } catch (error) {
        console.error('Error checking with SendGrid:', error);
        // Continue with DNS verification if SendGrid check fails
      }
      
      // If SendGrid verification failed or wasn't available, verify MX records via DNS
      try {
        const dnsResponse = await this.queryDns(foundDomain, 'MX');
        
        if (dnsResponse.Status === 0 && dnsResponse.Answer && dnsResponse.Answer.length > 0) {
          return {
            verified: true,
            message: 'MX records verified successfully'
          };
        } else {
          return {
            verified: false,
            message: 'No MX records found for the domain'
          };
        }
      } catch (error) {
        return {
          verified: false,
          message: 'Error verifying MX records'
        };
      }
    } catch (error) {
      console.error('Error verifying MX records:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to verify MX records. Please try again later.');
    }
  }
}

export const domainService = new DomainService();