import { db } from "./db";
import { 
  siteContent,
  projects,
  services,
  siteSettings,
  type InsertSiteContent,
  type SiteContent,
  type InsertProject,
  type Project,
  type InsertService,
  type Service,
  type InsertSiteSetting,
  type SiteSetting
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Site Content
  getAllSiteContent(): Promise<SiteContent[]>;
  getSiteContent(sectionKey: string): Promise<SiteContent | undefined>;
  upsertSiteContent(content: InsertSiteContent): Promise<SiteContent>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, updates: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  // Site Settings
  getAllSettings(): Promise<SiteSetting[]>;
  getSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
}

export class DatabaseStorage implements IStorage {
  // Site Content
  async getAllSiteContent(): Promise<SiteContent[]> {
    return await db.select().from(siteContent);
  }

  async getSiteContent(sectionKey: string): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.sectionKey, sectionKey));
    return content;
  }

  async upsertSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const [result] = await db
      .insert(siteContent)
      .values(content)
      .onConflictDoUpdate({
        target: siteContent.sectionKey,
        set: {
          contentAr: content.contentAr,
          contentEn: content.contentEn,
          imageUrl: content.imageUrl,
        },
      })
      .returning();
    return result;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(desc(services.createdAt));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, updates: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db.update(services).set(updates).where(eq(services.id, id)).returning();
    return updated;
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id)).returning();
    return result.length > 0;
  }

  // Site Settings
  async getAllSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key));
    return setting;
  }

  async upsertSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [result] = await db
      .insert(siteSettings)
      .values({
        ...setting,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteSettings.settingKey,
        set: {
          settingValue: setting.settingValue,
          description: setting.description,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

}

export const storage = new DatabaseStorage();
