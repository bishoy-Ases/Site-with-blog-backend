import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSiteContentSchema, insertSiteSettingSchema, insertProjectSchema, insertServiceSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication first
  await setupAuth(app);
  registerAuthRoutes(app);

  // Serve robots.txt
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /

Sitemap: https://aseskahraba.com/sitemap.xml

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Anthropic-AI
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Googlebot
Allow: /`);
  });

  // Serve dynamic sitemap.xml
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://aseskahraba.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="https://aseskahraba.com/?lang=ar"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://aseskahraba.com/?lang=en"/>
  </url>`;

      sitemap += "\n</urlset>";
      
      res.type("application/xml");
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // ========== Site Content API ==========
  
  // Get all site content (public)
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getAllSiteContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ message: "Failed to fetch site content" });
    }
  });

  // Get site content by section key (public)
  app.get("/api/content/:sectionKey", async (req, res) => {
    try {
      const content = await storage.getSiteContent(req.params.sectionKey);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ message: "Failed to fetch site content" });
    }
  });

  // Create or update site content (protected)
  app.put("/api/content/:sectionKey", isAuthenticated, async (req, res) => {
    try {
      const input = insertSiteContentSchema.parse({
        ...req.body,
        sectionKey: req.params.sectionKey,
      });
      const content = await storage.upsertSiteContent(input);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: error.errors[0].message,
          field: error.errors[0].path.join('.')
        });
      }
      console.error("Error saving site content:", error);
      res.status(500).json({ message: "Failed to save site content" });
    }
  });

  // ========== Projects API ==========

  // Get all projects (public)
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get single project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(Number(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Create project (protected)
  app.post("/api/projects", isAuthenticated, async (req, res) => {
    try {
      const input = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.')
        });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Update project (protected)
  app.patch("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const input = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(Number(req.params.id), input);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.')
        });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Delete project (protected)
  app.delete("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteProject(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // ========== Services API ==========

  // Get all services (public)
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get single service by ID
  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(Number(req.params.id));
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // Create service (protected)
  app.post("/api/services", isAuthenticated, async (req, res) => {
    try {
      const input = insertServiceSchema.parse(req.body);
      const service = await storage.createService(input);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.')
        });
      }
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  // Update service (protected)
  app.patch("/api/services/:id", isAuthenticated, async (req, res) => {
    try {
      const input = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(Number(req.params.id), input);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.')
        });
      }
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  // Delete service (protected)
  app.delete("/api/services/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteService(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // ========== Site Settings API ==========

  // Get all settings (public - for loading FB Pixel, GA, etc.)
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Get single setting by key
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      console.error("Error fetching setting:", error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  // Upsert setting (protected)
  app.post("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const input = insertSiteSettingSchema.parse(req.body);
      const setting = await storage.upsertSetting(input);
      res.json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.')
        });
      }
      console.error("Error upserting setting:", error);
      res.status(500).json({ message: "Failed to save setting" });
    }
  });

  // Seed initial site content
  await seedSiteContent();
  await seedSettings();

  return httpServer;
}

async function seedSiteContent() {
  try {
    const existingContent = await storage.getAllSiteContent();
    if (existingContent.length === 0) {
      // Seed hero section
      await storage.upsertSiteContent({
        sectionKey: "hero",
        contentAr: JSON.stringify({
          tagline: "كهرباء معمولة صح… من أول مرة",
          subtitle: "تنفيذ هندسي معتمد | بدون تنازلات | ضمان سنة كاملة",
          cta: "اطلب معاينة هندسية",
          ctaSecondary: "تواصل معنا",
        }),
        contentEn: JSON.stringify({
          tagline: "Electrical Work Done Right — From Day One",
          subtitle: "Certified Engineering | No Compromises | 1-Year Warranty",
          cta: "Request Engineering Visit",
          ctaSecondary: "Contact Us",
        }),
      });

      // Seed about section
      await storage.upsertSiteContent({
        sectionKey: "about",
        contentAr: JSON.stringify({
          title: "من نحن",
          content: "أسس كهربا شركة متخصصة في الأعمال الكهربائية الاحترافية، بخبرة عملية منذ عام 2012 في التأسيس، التشطيب، التيار الخفيف، والأنظمة الذكية.\n\nنحن نؤمن أن الكهرباء علم هندسي وليس اجتهادًا، لذلك نعتمد فقط على حلول مدروسة، خامات معتمدة، وتنفيذ تحت إشراف هندسي مباشر، مع التزام كامل بالكود المصري والمعايير الدولية.\n\nهدفنا هو بناء بنية كهربائية آمنة، مستقرة، وقابلة للاعتماد عليها لسنوات طويلة بدون مشاكل.",
          experience: "سنوات الخبرة",
          experienceValue: "+12",
        }),
        contentEn: JSON.stringify({
          title: "About Us",
          content: "Ases Kahraba is a professional electrical services company with hands-on experience since 2012 in electrical infrastructure, low current systems, and smart home solutions.\n\nWe believe electrical work is an engineering discipline—not guesswork. Every project is designed and executed using certified materials, proper calculations, and direct engineering supervision, fully compliant with local and international standards.\n\nOur mission is to deliver safe, reliable, and future-ready electrical systems.",
          experience: "Years of Experience",
          experienceValue: "12+",
        }),
      });

      // Seed contact section
      await storage.upsertSiteContent({
        sectionKey: "contact",
        contentAr: JSON.stringify({
          title: "تواصل معنا",
          description: "نحن جاهزون لمناقشة مشروعك وتقديم الحل الهندسي الأنسب له.",
          location: "19 محمد شفيق",
          phone: "01004111999",
          email: "info@aseskahraba.com",
          cta: "احجز معاينة",
        }),
        contentEn: JSON.stringify({
          title: "Contact Us",
          description: "Let's discuss your project and provide the right engineering solution.",
          location: "19 Mohammed Shafeek",
          phone: "+20 100 411 1999",
          email: "info@aseskahraba.com",
          cta: "Book a Visit",
        }),
      });

      console.log("Site content seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding site content:", error);
  }
}

async function seedSettings() {
  try {
    const existingSettings = await storage.getAllSettings();
    if (existingSettings.length === 0) {
      // Seed default settings
      await storage.upsertSetting({
        settingKey: "fb_pixel_id",
        settingValue: "",
        description: "Facebook Pixel ID for tracking website events"
      });

      await storage.upsertSetting({
        settingKey: "ga_measurement_id",
        settingValue: "G-WDRD35B2HV",
        description: "Google Analytics Measurement ID"
      });

      console.log("Site settings seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding settings:", error);
  }
}



