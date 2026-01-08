import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";
import { translations, getDirection } from "@/lib/i18n";
import { useSEO } from "@/hooks/use-seo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function Blog() {
  const currentLang = localStorage.getItem("language") || "ar";
  const t = translations[currentLang];
  const direction = getDirection(currentLang);

  // SEO metadata
  useSEO({
    title: t.blog.title,
    description: t.blog.description || t.blog.title,
    keywords: "مدونة كهرباء, electrical blog, electrical tips, نصائح كهربائية",
  });

  // Fetch published blog posts
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir={direction}>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">{t.common.loading}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background" dir={direction}>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-red-500">
            <p>{t.common.error || "Error loading blog posts"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      {/* Hero Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t.blog.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t.blog.description || "Insights, tips, and updates from our electrical experts"}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {!posts || posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {currentLang === "ar" 
                  ? "لا توجد مقالات حالياً. تابعونا قريباً للمزيد!" 
                  : "No blog posts yet. Stay tuned for updates!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <a className="block h-full">
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                      {post.imageUrl && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={post.imageUrl}
                            alt={currentLang === "ar" ? post.titleAr : post.titleEn}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader className="flex-1">
                        <CardTitle className="line-clamp-2">
                          {currentLang === "ar" ? post.titleAr : post.titleEn}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 mt-2">
                          {currentLang === "ar" ? post.excerptAr : post.excerptEn}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={post.createdAt?.toISOString()}>
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString(
                                  currentLang === "ar" ? "ar-EG" : "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : ""}
                          </time>
                        </div>
                        <Badge variant="secondary">
                          {t.blog.readMore || (currentLang === "ar" ? "اقرأ المزيد" : "Read More")}
                        </Badge>
                      </CardFooter>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
