import { users, type User, type InsertUser, type Contact, type InsertContact, type EmailAccount, type InsertEmailAccount } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  createEmailAccount(emailAccount: InsertEmailAccount): Promise<EmailAccount>;
  getEmailAccountByAddress(address: string): Promise<EmailAccount | undefined>;
  getEmailAccountsByDomain(domain: string): Promise<EmailAccount[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private emailAccounts: Map<number, EmailAccount>;
  currentUserId: number;
  currentContactId: number;
  currentEmailAccountId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.emailAccounts = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentEmailAccountId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: Math.floor(Date.now() / 1000) 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async createEmailAccount(insertEmailAccount: InsertEmailAccount): Promise<EmailAccount> {
    const id = this.currentEmailAccountId++;
    const emailAccount: EmailAccount = {
      ...insertEmailAccount,
      id,
      createdAt: Math.floor(Date.now() / 1000)
    };
    this.emailAccounts.set(id, emailAccount);
    return emailAccount;
  }

  async getEmailAccountByAddress(address: string): Promise<EmailAccount | undefined> {
    return Array.from(this.emailAccounts.values()).find(
      (account) => account.address === address
    );
  }

  async getEmailAccountsByDomain(domain: string): Promise<EmailAccount[]> {
    return Array.from(this.emailAccounts.values()).filter(
      (account) => account.domain === domain
    );
  }
}

export const storage = new MemStorage();
