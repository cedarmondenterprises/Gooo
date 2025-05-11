import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact form schema
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: integer("createdAt").notNull().default(Math.floor(Date.now() / 1000)),
});

export const contactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export type InsertContact = z.infer<typeof contactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Email accounts schema
export const emailAccounts = pgTable("emailAccounts", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  provider: text("provider").notNull(),
  domain: text("domain").notNull(),
  createdAt: integer("createdAt").notNull().default(Math.floor(Date.now() / 1000)),
});

export const emailAccountSchema = createInsertSchema(emailAccounts).pick({
  address: true,
  firstName: true,
  lastName: true,
  provider: true,
  domain: true,
});

export type InsertEmailAccount = z.infer<typeof emailAccountSchema>;
export type EmailAccount = typeof emailAccounts.$inferSelect;
