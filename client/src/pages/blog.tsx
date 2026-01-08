import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { translations, getDirection, type Language } from "@/lib/i18n";
import { useSEO } from "@/hooks/use-seo";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Calendar, FileText } from "lucide-react";
import logoUrl from "@assets/⬇️_Download_1766924051122.png";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
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

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  useSEO({
    title: language === 'ar' ? 'المدونة' : 'Blog',
    description: language === 'ar'
      ? 'اقرأ أحدث مقالاتنا حول الأعمال الكهربائية ونصائح السلامة وتحديثات المشاريع'
      : 'Read our latest articles on electrical work, safety tips, and project updates',
  });

  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link href="/">
              <img 
                src={logoUrl} 
                alt="Ases Kahraba" 
                className="h-10 w-auto cursor-pointer rounded-md bg-[#f9f7f3] dark:brightness-110"
              />
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <LanguageToggle language={language} onToggle={toggleLanguage} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Back to Home */}
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <BackArrow className="w-4 h-4 me-2" />
              {t.nav.home}
            </Button>
          </Link>

          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {language === 'ar' ? 'المدونة' : 'Blog'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'اقرأ أحدث مقالاتنا حول الأعمال الكهربائية ونصائح السلامة'
                : 'Read our latest articles on electrical work and safety tips'}
            </p>
          </div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    {post.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img 
                          src={post.imageUrl} 
                          alt={language === 'ar' ? post.titleAr : post.titleEn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        {language === 'ar' ? post.titleAr : post.titleEn}
                      </CardTitle>
                      {post.createdAt && (
                        <div className="flex items-center text-sm text-muted-foreground mt-2">
                          <Calendar className="w-4 h-4 me-2" />
                          {new Date(post.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">
                        {language === 'ar' ? post.excerptAr : post.excerptEn}
                      </p>
                      <Button variant="ghost" className="mt-4 p-0">
                        {language === 'ar' ? 'اقرأ المزيد' : 'Read more'} →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                {language === 'ar' ? 'لا توجد مقالات بعد' : 'No blog posts yet'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'تحقق مرة أخرى قريباً للحصول على مقالات جديدة'
                  : 'Check back soon for new articles'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
