import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { contactSchema } from "@shared/schema";
import { emailService } from "./emailService";

// Domain validation schema
const domainValidationSchema = z.object({
  domainName: z.string()
    .min(3, { message: "Domain name must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, {
      message: "Please enter a valid domain (e.g., yourbusiness.com)",
    }),
  domainOwnership: z.enum(["new", "existing"]),
});

// Email creation schema
const createEmailSchema = z.object({
  emailPrefix: z.string()
    .min(2, { message: "Email prefix must be at least 2 characters" })
    .regex(/^[a-zA-Z0-9._%+-]+$/, {
      message: "Please enter a valid email prefix (letters, numbers, ., _, %, +, -)",
    }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  emailProvider: z.string().min(1, { message: "Please select an email provider" }),
  domain: z.string().min(3, { message: "Domain is required" }),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = contactSchema.parse(req.body);
      
      // Store the contact submission
      const contact = await storage.createContact(validatedData);
      
      // Return success response
      res.status(201).json({ 
        message: "Contact form submitted successfully", 
        id: contact.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: error.errors 
        });
      }
      
      // Handle other errors
      console.error("Error processing contact form:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Domain validation endpoint
  app.post("/api/validate-domain", async (req, res) => {
    try {
      // Validate request body
      const validatedData = domainValidationSchema.parse(req.body);
      
      // Check domain availability and validity
      const domainValidation = await emailService.validateDomain(validatedData.domainName);
      
      // Return success response
      res.status(200).json({ 
        message: "Domain validation successful", 
        domain: validatedData.domainName,
        ...domainValidation
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid domain data", 
          errors: error.errors 
        });
      }
      
      console.error("Error validating domain:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ 
        message: "Domain validation failed", 
        error: errorMessage
      });
    }
  });

  // Email creation endpoint
  app.post("/api/create-email", async (req, res) => {
    try {
      // Validate request body
      const validatedData = createEmailSchema.parse(req.body);
      
      // Create email account
      const emailAccount = await emailService.createEmailAccount({
        emailAddress: `${validatedData.emailPrefix}@${validatedData.domain}`,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        provider: validatedData.emailProvider,
        domain: validatedData.domain
      });
      
      // Store the email account
      const storedAccount = await storage.createEmailAccount({
        address: `${validatedData.emailPrefix}@${validatedData.domain}`,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        provider: validatedData.emailProvider,
        domain: validatedData.domain,
        createdAt: Math.floor(Date.now() / 1000)
      });
      
      // Return success response
      res.status(201).json({ 
        message: "Email account created successfully", 
        emailAccount: {
          id: storedAccount.id,
          email: `${validatedData.emailPrefix}@${validatedData.domain}`,
          ...emailAccount
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid email data", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating email account:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ 
        message: "Email account creation failed", 
        error: errorMessage
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
