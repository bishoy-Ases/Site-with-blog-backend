import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { translations, getDirection, type Language } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiUrl } from "@/lib/api";
import { apiRequest, queryClient } from "@/lib/queryClient";
import logoUrl from "@assets/⬇️_Download_1766924051122.png";
import { ArrowLeft, ArrowRight, Plus, Pencil, Trash2, Settings as SettingsIcon, Home, Info, Phone, LogIn, LogOut, Save, Loader2 } from "lucide-react";
import type { SiteContent, Project, InsertProject, Service, InsertService, SiteSetting, InsertSiteSetting } from "@shared/schema";

const emptyProject: InsertProject = {
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  category: 'residential',
  featured: false,
};

const emptyService: InsertService = {
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  featured: false,
};

function AboutEditor() {
  return (
    <SiteContentEditor
      sectionKey="about"
      title="About Section"
      icon={Info}
      renderForm={(contentAr, contentEn, setContentAr, setContentEn) => {
        const ar = contentAr as AboutContent;
        const en = contentEn as AboutContent;
        return (
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="english" data-testid="tab-about-english">English</TabsTrigger>
              <TabsTrigger value="arabic" data-testid="tab-about-arabic">Arabic</TabsTrigger>
            </TabsList>
            <TabsContent value="english" className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={en?.title || ""}
                  onChange={(e) => setContentEn({ ...en, title: e.target.value })}
                  data-testid="input-about-title-en"
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={en?.content || ""}
                  onChange={(e) => setContentEn({ ...en, content: e.target.value })}
                  rows={6}
                  data-testid="input-about-content-en"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Experience Label</Label>
                  <Input
                    value={en?.experience || ""}
                    onChange={(e) => setContentEn({ ...en, experience: e.target.value })}
                    data-testid="input-about-experience-en"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Experience Value</Label>
                  <Input
                    value={en?.experienceValue || ""}
                    onChange={(e) => setContentEn({ ...en, experienceValue: e.target.value })}
                    data-testid="input-about-experience-value-en"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="arabic" className="space-y-4" dir="rtl">
              <div className="space-y-2">
                <Label>العنوان</Label>
                <Input
                  value={ar?.title || ""}
                  onChange={(e) => setContentAr({ ...ar, title: e.target.value })}
                  data-testid="input-about-title-ar"
                />
              </div>
              <div className="space-y-2">
                <Label>المحتوى</Label>
                <Textarea
                  value={ar?.content || ""}
                  onChange={(e) => setContentAr({ ...ar, content: e.target.value })}
                  rows={6}
                  data-testid="input-about-content-ar"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نص الخبرة</Label>
                  <Input
                    value={ar?.experience || ""}
                    onChange={(e) => setContentAr({ ...ar, experience: e.target.value })}
                    data-testid="input-about-experience-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label>قيمة الخبرة</Label>
                  <Input
                    value={ar?.experienceValue || ""}
                    onChange={(e) => setContentAr({ ...ar, experienceValue: e.target.value })}
                    data-testid="input-about-experience-value-ar"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        );
      }}
    />
  );
}

function ContactEditor() {
  return (
    <SiteContentEditor
      sectionKey="contact"
      title="Contact Section"
      icon={Phone}
      renderForm={(contentAr, contentEn, setContentAr, setContentEn) => {
        const ar = contentAr as ContactContent;
        const en = contentEn as ContactContent;
        return (
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="english" data-testid="tab-contact-english">English</TabsTrigger>
              <TabsTrigger value="arabic" data-testid="tab-contact-arabic">Arabic</TabsTrigger>
            </TabsList>
            <TabsContent value="english" className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={en?.title || ""}
                  onChange={(e) => setContentEn({ ...en, title: e.target.value })}
                  data-testid="input-contact-title-en"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={en?.description || ""}
                  onChange={(e) => setContentEn({ ...en, description: e.target.value })}
                  rows={3}
                  data-testid="input-contact-description-en"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={en?.phone || ""}
                    onChange={(e) => setContentEn({ ...en, phone: e.target.value })}
                    data-testid="input-contact-phone-en"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={en?.email || ""}
                    onChange={(e) => setContentEn({ ...en, email: e.target.value })}
                    data-testid="input-contact-email-en"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={en?.location || ""}
                    onChange={(e) => setContentEn({ ...en, location: e.target.value })}
                    data-testid="input-contact-location-en"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Button</Label>
                  <Input
                    value={en?.cta || ""}
                    onChange={(e) => setContentEn({ ...en, cta: e.target.value })}
                    data-testid="input-contact-cta-en"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="arabic" className="space-y-4" dir="rtl">
              <div className="space-y-2">
                <Label>العنوان</Label>
                <Input
                  value={ar?.title || ""}
                  onChange={(e) => setContentAr({ ...ar, title: e.target.value })}
                  data-testid="input-contact-title-ar"
                />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={ar?.description || ""}
                  onChange={(e) => setContentAr({ ...ar, description: e.target.value })}
                  rows={3}
                  data-testid="input-contact-description-ar"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الهاتف</Label>
                  <Input
                    value={ar?.phone || ""}
                    onChange={(e) => setContentAr({ ...ar, phone: e.target.value })}
                    data-testid="input-contact-phone-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    value={ar?.email || ""}
                    onChange={(e) => setContentAr({ ...ar, email: e.target.value })}
                    data-testid="input-contact-email-ar"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الموقع</Label>
                  <Input
                    value={ar?.location || ""}
                    onChange={(e) => setContentAr({ ...ar, location: e.target.value })}
                    data-testid="input-contact-location-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label>زر الإجراء</Label>
                  <Input
                    value={ar?.cta || ""}
                    onChange={(e) => setContentAr({ ...ar, cta: e.target.value })}
                    data-testid="input-contact-cta-ar"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        );
      }}
    />
  );
}


function ProjectsManager({ language, t }: { language: Language; t: typeof translations['en'] }) {
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [project, setProject] = useState<InsertProject>(emptyProject);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertProject) => apiRequest("/api/projects", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Success", description: "Project created successfully" });
      setIsCreating(false);
      setProject(emptyProject);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertProject> }) =>
      apiRequest(`/api/projects/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Success", description: "Project updated successfully" });
      setEditingProject(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/projects/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Success", description: "Project deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: project });
    } else {
      createMutation.mutate(project);
    }
  };

  const startEdit = (item: Project) => {
    setEditingProject(item);
    setProject({
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      descriptionAr: item.descriptionAr,
      descriptionEn: item.descriptionEn,
      imageUrl: item.imageUrl || '',
      category: item.category,
      completionDate: item.completionDate ? new Date(item.completionDate) : undefined,
      featured: item.featured,
    });
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setIsCreating(false);
    setProject(emptyProject);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Manage Projects</h2>
          <p className="text-muted-foreground">
            Showcase your completed electrical projects and installations.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingProject}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {(isCreating || editingProject) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="english">
                <TabsList>
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="arabic">Arabic</TabsTrigger>
                </TabsList>

                <TabsContent value="english" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title (English)</Label>
                      <Input
                        value={project.titleEn}
                        onChange={(e) => setProject({ ...project, titleEn: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select
                        className="w-full p-2 border rounded"
                        value={project.category}
                        onChange={(e) => setProject({ ...project, category: e.target.value })}
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description (English)</Label>
                    <Textarea
                      value={project.descriptionEn}
                      onChange={(e) => setProject({ ...project, descriptionEn: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="arabic" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>العنوان (عربي)</Label>
                      <Input
                        dir="rtl"
                        value={project.titleAr}
                        onChange={(e) => setProject({ ...project, titleAr: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>تاريخ الإنجاز</Label>
                      <Input
                        type="date"
                        value={project.completionDate ? project.completionDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => setProject({ ...project, completionDate: e.target.value ? new Date(e.target.value) : undefined })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>الوصف (عربي)</Label>
                    <Textarea
                      dir="rtl"
                      value={project.descriptionAr}
                      onChange={(e) => setProject({ ...project, descriptionAr: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={project.imageUrl}
                    onChange={(e) => setProject({ ...project, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="project-featured"
                    checked={project.featured}
                    onChange={(e) => setProject({ ...project, featured: e.target.checked })}
                  />
                  <Label htmlFor="project-featured">Featured Project</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          </div>
        ) : projects && projects.length > 0 ? (
          projects.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{language === 'ar' ? item.titleAr : item.titleEn}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-secondary px-2 py-1 rounded">{item.category}</span>
                      {item.featured && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Featured</span>}
                      {item.completionDate && (
                        <span className="text-xs text-muted-foreground">
                          Completed: {new Date(item.completionDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this project?')) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No projects found. Add your first project to showcase your work.
          </div>
        )}
      </div>
    </div>
  );
}

function ServicesManager({ language, t }: { language: Language; t: typeof translations['en'] }) {
  const { toast } = useToast();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [service, setService] = useState<InsertService>(emptyService);

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertService) => apiRequest("/api/services", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Success", description: "Service created successfully" });
      setIsCreating(false);
      setService(emptyService);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertService> }) =>
      apiRequest(`/api/services/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Success", description: "Service updated successfully" });
      setEditingService(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/services/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Success", description: "Service deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: service });
    } else {
      createMutation.mutate(service);
    }
  };

  const startEdit = (item: Service) => {
    setEditingService(item);
    setService({
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      descriptionAr: item.descriptionAr,
      descriptionEn: item.descriptionEn,
      icon: item.icon || '',
      featured: item.featured,
    });
  };

  const cancelEdit = () => {
    setEditingService(null);
    setIsCreating(false);
    setService(emptyService);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Manage Services</h2>
          <p className="text-muted-foreground">
            Define the electrical services you offer to your customers.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingService}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {(isCreating || editingService) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingService ? 'Edit Service' : 'Add New Service'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="english">
                <TabsList>
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="arabic">Arabic</TabsTrigger>
                </TabsList>

                <TabsContent value="english" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title (English)</Label>
                      <Input
                        value={service.titleEn}
                        onChange={(e) => setService({ ...service, titleEn: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Input
                        value={service.icon}
                        onChange={(e) => setService({ ...service, icon: e.target.value })}
                        placeholder="e.g., Zap, Wrench, Lightbulb"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description (English)</Label>
                    <Textarea
                      value={service.descriptionEn}
                      onChange={(e) => setService({ ...service, descriptionEn: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="arabic" className="space-y-4">
                  <div className="space-y-2">
                    <Label>العنوان (عربي)</Label>
                    <Input
                      dir="rtl"
                      value={service.titleAr}
                      onChange={(e) => setService({ ...service, titleAr: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الوصف (عربي)</Label>
                    <Textarea
                      dir="rtl"
                      value={service.descriptionAr}
                      onChange={(e) => setService({ ...service, descriptionAr: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="service-featured"
                      checked={service.featured}
                      onChange={(e) => setService({ ...service, featured: e.target.checked })}
                    />
                    <Label htmlFor="service-featured">خدمة مميزة (Featured Service)</Label>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingService ? 'Update Service' : 'Create Service'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          </div>
        ) : services && services.length > 0 ? (
          services.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{language === 'ar' ? item.titleAr : item.titleEn}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {item.icon && <span className="text-xs bg-secondary px-2 py-1 rounded">{item.icon}</span>}
                      {item.featured && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Featured</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this service?')) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No services found. Add your first service to showcase what you offer.
          </div>
        )}
      </div>
    </div>
  );
}

// Settings Manager Component
function SettingsManager({ language, t }: { language: Language; t: typeof translations['en'] }) {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/settings"],
  });

  const upsertMutation = useMutation({
    mutationFn: (data: InsertSiteSetting) => apiRequest("/api/settings", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Success", description: "Settings updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update settings", 
        variant: "destructive" 
      });
    }
  });

  const [fbPixelId, setFbPixelId] = useState('');
  const [gaMeasurementId, setGaMeasurementId] = useState('');

  useEffect(() => {
    if (settings) {
      const fbSetting = settings.find(s => s.settingKey === 'fb_pixel_id');
      const gaSetting = settings.find(s => s.settingKey === 'ga_measurement_id');
      setFbPixelId(fbSetting?.settingValue || '');
      setGaMeasurementId(gaSetting?.settingValue || '');
    }
  }, [settings]);

  const handleSave = (key: string, value: string, description: string) => {
    upsertMutation.mutate({ settingKey: key, settingValue: value, description });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Site Settings</h2>
        <p className="text-muted-foreground">
          Configure tracking pixels and analytics for your website.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Facebook Pixel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Facebook Pixel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fb-pixel">Facebook Pixel ID</Label>
                <Input
                  id="fb-pixel"
                  value={fbPixelId}
                  onChange={(e) => setFbPixelId(e.target.value)}
                  placeholder="Enter your Facebook Pixel ID"
                />
                <p className="text-sm text-muted-foreground">
                  Find your Pixel ID in Meta Events Manager. Leave blank to disable tracking.
                </p>
              </div>
              <Button
                onClick={() => handleSave('fb_pixel_id', fbPixelId, 'Facebook Pixel ID for tracking website events')}
                disabled={upsertMutation.isPending}
              >
                {upsertMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Facebook Pixel
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Google Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Google Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ga-id">Google Analytics Measurement ID</Label>
                <Input
                  id="ga-id"
                  value={gaMeasurementId}
                  onChange={(e) => setGaMeasurementId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-sm text-muted-foreground">
                  Your GA4 Measurement ID (starts with G-).
                </p>
              </div>
              <Button
                onClick={() => handleSave('ga_measurement_id', gaMeasurementId, 'Google Analytics Measurement ID')}
                disabled={upsertMutation.isPending}
              >
                {upsertMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Google Analytics
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Reload Instructions */}
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="pt-6">
              <p className="text-sm">
                <strong>Note:</strong> After updating tracking IDs, reload the page for changes to take effect.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const { toast } = useToast();
  // Hardcoded admin login state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language | null;
    return stored === 'ar' ? 'ar' : 'en';
  });
  
  const t = translations[language];
  const dir = getDirection(language);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language, dir]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  // Local login state
  const [loginForm, setLoginForm] = useState({ email: 'bishoy@aseskahraba.com', password: '' });

  const handleLocalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);
    // Hardcoded password check
    if (loginForm.email === 'bishoy@aseskahraba.com' && loginForm.password === 'admin123') {
      setIsAuthenticated(true);
      setAuthLoading(false);
    } else {
      setError('Invalid email or password');
      setAuthLoading(false);
    }
  };

  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" dir={dir}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">{t.admin.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="local" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="local">Admin Login</TabsTrigger>
                <TabsTrigger value="google">Google Login</TabsTrigger>
              </TabsList>

              <TabsContent value="local" className="space-y-4">
                <div className="text-center text-muted-foreground text-sm">
                  Enter your admin credentials
                </div>
                <form onSubmit={handleLocalLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="bishoy@aseskahraba.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  {error && <div className="text-destructive text-sm mt-2">{error}</div>}
                </form>
              </TabsContent>

              {/* Google login removed for static-only site */}
            </Tabs>

            <div className="text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                <BackArrow className="inline mr-1 h-3 w-3" />
{t.nav.home}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link href="/">
              <img 
                src={logoUrl} 
                alt="Ases Kahraba" 
                className="h-10 w-auto cursor-pointer rounded-md bg-[#f9f7f3] dark:brightness-110"
                data-testid="img-logo"
              />
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <LanguageToggle language={language} onToggle={toggleLanguage} />
              <ThemeToggle />
              {/* No logout for static-only admin */}
            </div>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back-home">
                <BackArrow className="w-4 h-4 me-2" />
{t.nav.home}
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-md bg-primary/20 flex items-center justify-center">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-admin-title">
              {t.admin.title}
            </h1>
          </div>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="content" data-testid="tab-content">Site Content</TabsTrigger>
              <TabsTrigger value="projects" data-testid="tab-projects">Projects</TabsTrigger>
              <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Edit Website Content</h2>
                <p className="text-muted-foreground mb-6">
                  Edit the text content for each section. Changes are saved to the database.
                </p>
              </div>
              <HeroEditor />
              <AboutEditor />
              <ContactEditor />
            </TabsContent>

            {/* Store tab and content removed */}

            <TabsContent value="projects">
              <ProjectsManager language={language} t={t} />
            </TabsContent>

            <TabsContent value="services">
              <ServicesManager language={language} t={t} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsManager language={language} t={t} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
