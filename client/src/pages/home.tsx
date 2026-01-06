import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { translations, getDirection, type Language } from "@/lib/i18n";
import logoUrl from "@assets/⬇️_Download_1766924051122.png";
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Menu,
  X,
  Lightbulb,
  Settings,
  Cpu,
  ClipboardCheck,
  Network,
  Home as HomeIcon,
  ArrowRight,
  Plug,
  Calculator
} from "lucide-react";
import type { SiteContent } from "@shared/schema";

interface HeroContent {
  tagline: string;
  subtitle: string;
  cta: string;
  ctaSecondary: string;
}

interface AboutContent {
  title: string;
  content: string;
  experience: string;
  experienceValue: string;
}

interface ContactContent {
  title: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  cta: string;
}

const serviceIcons = [Zap, Settings, Shield, Network, Cpu, ClipboardCheck, Plug];

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language | null;
    return stored === 'ar' ? 'ar' : 'en';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];
  const dir = getDirection(language);

  const { data: siteContentList } = useQuery<SiteContent[]>({
    queryKey: ['/api/content'],
  });

  function getContent<T>(sectionKey: string, requiredFields: string[]): T | null {
    const content = siteContentList?.find(c => c.sectionKey === sectionKey);
    if (!content) return null;
    try {
      const parsed = language === 'ar' 
        ? JSON.parse(content.contentAr) 
        : JSON.parse(content.contentEn);
      const hasRequiredFields = requiredFields.every(
        field => parsed[field] && typeof parsed[field] === 'string' && parsed[field].trim() !== ''
      );
      if (!hasRequiredFields) return null;
      return parsed as T;
    } catch {
      return null;
    }
  }

  const heroContent = getContent<HeroContent>('hero', ['tagline', 'subtitle']);
  const aboutContent = getContent<AboutContent>('about', ['title', 'content']);
  const contactContent = getContent<ContactContent>('contact', ['title', 'phone']);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language, dir]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'services', label: t.nav.services },
    { id: 'why-us', label: t.nav.whyUs },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoUrl} 
                alt="Ases Kahraba" 
                className="h-10 w-auto rounded-md bg-[#f9f7f3] dark:brightness-110"
                data-testid="img-logo"
              />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 flex-wrap">
              {navItems.map((item) => {
                if (item.href) {
                  // External link
                  return (
                    <Link key={item.id} href={item.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`nav-${item.id}`}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  );
                } else {
                  // Scroll to section
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => scrollToSection(item.id)}
                      data-testid={`nav-${item.id}`}
                    >
                      {item.label}
                    </Button>
                  );
                }
              })}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageToggle language={language} onToggle={toggleLanguage} />
              <ThemeToggle />
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  if (item.href) {
                    // External link
                    return (
                      <Link key={item.id} href={item.href}>
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          data-testid={`mobile-nav-${item.id}`}
                        >
                          {item.label}
                        </Button>
                      </Link>
                    );
                  } else {
                    // Scroll to section
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => scrollToSection(item.id)}
                        data-testid={`mobile-nav-${item.id}`}
                      >
                        {item.label}
                      </Button>
                    );
                  }
                })}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-8">
              <Lightbulb className="w-10 h-10 text-accent" />
            </div>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              data-testid="text-hero-tagline"
            >
              {heroContent?.tagline || t.hero.tagline}
            </h1>
            <p 
              className="text-xl md:text-2xl text-muted-foreground mb-10"
              data-testid="text-hero-subtitle"
            >
              {heroContent?.subtitle || t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => scrollToSection('contact')}
                data-testid="button-hero-cta"
              >
                <Phone className="w-5 h-5 me-2" />
                {heroContent?.cta || t.hero.cta}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => scrollToSection('contact')}
                data-testid="button-hero-cta-secondary"
              >
                <Mail className="w-5 h-5 me-2" />
                {heroContent?.ctaSecondary || t.hero.ctaSecondary}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-about-title">
              {aboutContent?.title || t.about.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <p className="text-lg leading-relaxed whitespace-pre-line text-muted-foreground" data-testid="text-about-content">
                  {aboutContent?.content || t.about.content}
                </p>
              </div>
              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="text-5xl font-bold text-primary mb-2" data-testid="text-experience-value">
                    {aboutContent?.experienceValue || t.about.experienceValue}
                  </div>
                  <div className="text-muted-foreground" data-testid="text-experience-label">
                    {aboutContent?.experience || t.about.experience}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-services-title">
            {t.services.title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {t.services.items.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <Card key={index} className="hover-elevate">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-md bg-accent/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" data-testid={`text-service-title-${index}`}>
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4" data-testid={`text-service-desc-${index}`}>
                      {service.description}
                    </p>
                    {index === 0 && (
                      <div className="flex flex-col gap-2">
                        <Link href="/calculator/foundation">
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <Calculator className="h-4 w-4" />
                            {language === 'ar' ? 'حاسبة وضع الأساسات' : 'Foundation Calculator'}
                          </Button>
                        </Link>
                        <Link href="/calculator/finishing">
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <Calculator className="h-4 w-4" />
                            {language === 'ar' ? 'حاسبة التشطيبات' : 'Finishing Calculator'}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>


      {/* Why Us Section */}
      <section id="why-us" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-why-title">
            {t.whyUs.title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {t.whyUs.items.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4">
                <CheckCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <span className="text-lg" data-testid={`text-why-item-${index}`}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-contact-title">
              {contactContent?.title || t.contact.title}
            </h2>
            <p className="text-xl opacity-90 mb-10" data-testid="text-contact-desc">
              {contactContent?.description || t.contact.description}
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center gap-2">
                <MapPin className="w-8 h-8" />
                <a 
                  href="https://maps.google.com/?q=19+Mohammed+Shafeek,+Heliopolis,+Cairo,+Egypt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-center"
                  data-testid="link-contact-location"
                >
                  {contactContent?.location || t.contact.location}
                </a>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Phone className="w-8 h-8" />
                <a 
                  href={`tel:${(contactContent?.phone || t.contact.phone).replace(/\s/g, '')}`}
                  className="hover:underline"
                  data-testid="link-contact-phone"
                >
                  {contactContent?.phone || t.contact.phone}
                </a>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Mail className="w-8 h-8" />
                <a 
                  href={`mailto:${contactContent?.email || t.contact.email}`}
                  className="hover:underline"
                  data-testid="link-contact-email"
                >
                  {contactContent?.email || t.contact.email}
                </a>
              </div>
            </div>

            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => window.open(`https://wa.me/${(contactContent?.phone || t.contact.phone).replace(/[^0-9]/g, '')}`, '_blank')}
              data-testid="button-contact-cta"
            >
              <Phone className="w-5 h-5 me-2" />
              {contactContent?.cta || t.contact.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoUrl} 
                alt="Ases Kahraba" 
                className="h-8 w-auto rounded-md bg-[#f9f7f3] dark:brightness-110"
              />
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-footer-rights">
              © {new Date().getFullYear()} {t.footer.company}. {t.footer.rights}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
