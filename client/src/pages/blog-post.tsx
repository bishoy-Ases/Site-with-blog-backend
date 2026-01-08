import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { translations, getDirection, type Language } from "@/lib/i18n";
import { useSEO } from "@/hooks/use-seo";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import logoUrl from "@assets/⬇️_Download_1766924051122.png";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
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

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blog/slug/${slug}`],
    enabled: !!slug,
  });

  useSEO({
    title: post
      ? language === 'ar' ? post.titleAr : post.titleEn
      : language === 'ar' ? 'مقال' : 'Blog Post',
    description: post
      ? language === 'ar' ? post.excerptAr : post.excerptEn
      : language === 'ar' ? 'اقرأ أحدث مقالاتنا' : 'Read our latest blog post',
    ogImage: post?.imageUrl ? post.imageUrl : undefined,
    ogType: 'article',
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
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back to Blog */}
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-6">
              <BackArrow className="w-4 h-4 me-2" />
              {language === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
            </Button>
          </Link>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : post ? (
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {/* Post Header */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {language === 'ar' ? post.titleAr : post.titleEn}
                </h1>
                
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  {post.createdAt && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 me-2" />
                      {new Date(post.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                  <div className="flex items-center">
                    <User className="w-4 h-4 me-2" />
                    {language === 'ar' ? 'أسس كهربا' : 'Ases Kahraba'}
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {post.imageUrl && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={language === 'ar' ? post.titleAr : post.titleEn}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {language === 'ar' ? post.contentAr : post.contentEn}
              </div>

              {/* Call to Action */}
              <div className="mt-12 p-6 bg-muted rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-2">
                  {language === 'ar' ? 'هل تحتاج إلى مساعدة؟' : 'Need Help?'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'ar' 
                    ? 'تواصل معنا للحصول على استشارة مجانية'
                    : 'Contact us for a free consultation'}
                </p>
                <Link href="/#contact">
                  <Button size="lg">
                    {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                  </Button>
                </Link>
              </div>
            </article>
          ) : (
            <div className="text-center py-24">
              <h1 className="text-3xl font-bold mb-4">
                {language === 'ar' ? 'المقال غير موجود' : 'Post Not Found'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {language === 'ar' 
                  ? 'عذراً، لم نتمكن من العثور على هذا المقال'
                  : 'Sorry, we couldn\'t find this blog post'}
              </p>
              <Link href="/blog">
                <Button>
                  <BackArrow className="w-4 h-4 me-2" />
                  {language === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
