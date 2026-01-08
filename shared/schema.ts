import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { z } from "zod";

// Re-export auth schema (users and sessions tables)
export * from "./models/auth";

// Blog Posts Schema
export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  contentAr: text("content_ar").notNull(),
  contentEn: text("content_en").notNull(),
  excerptAr: text("excerpt_ar").notNull(),
  excerptEn: text("excerpt_en").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
  published: integer("published", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Manual Zod schemas
export const insertBlogPostSchema = z.object({
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  contentAr: z.string().min(1),
  contentEn: z.string().min(1),
  excerptAr: z.string().min(1),
  excerptEn: z.string().min(1),
  slug: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  published: z.boolean().default(true),
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Site Content Schema - for editable website content
export const siteContent = sqliteTable("site_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sectionKey: text("section_key").notNull().unique(), // e.g., 'hero', 'about', 'contact'
  contentAr: text("content_ar").notNull(), // JSON string with Arabic content
  contentEn: text("content_en").notNull(), // JSON string with English content
  imageUrl: text("image_url"), // Optional image for the section
});

export const insertSiteContentSchema = z.object({
  sectionKey: z.string().min(1),
  contentAr: z.string().min(1),
  contentEn: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
});

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

// Projects Schema
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(), // e.g., 'residential', 'commercial', 'industrial'
  completionDate: integer("completion_date", { mode: "timestamp" }),
  featured: integer("featured", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertProjectSchema = z.object({
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  category: z.string().min(1),
  completionDate: z.date().optional().nullable(),
  featured: z.boolean().default(false),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Services Schema
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  icon: text("icon"), // Icon name or URL
  featured: integer("featured", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertServiceSchema = z.object({
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  icon: z.string().optional().nullable(),
  featured: z.boolean().default(false),
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Admin users - for admin console access
export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
});

export const insertAdminUserSchema = z.object({
  email: z.string().email(),
  isAdmin: z.boolean().default(false),
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Site Settings Schema - for global settings like tracking pixels
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  settingKey: text("setting_key").notNull().unique(), // e.g., 'fb_pixel_id', 'ga_measurement_id'
  settingValue: text("setting_value"), // The value for the setting
  description: text("description"), // Description of what this setting does
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertSiteSettingSchema = z.object({
  settingKey: z.string().min(1),
  settingValue: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

// API Contract Types
export type SiteContentResponse = SiteContent;
export type SiteContentListResponse = SiteContent[];

