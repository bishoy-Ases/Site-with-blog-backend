import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import type { BlogPost } from "@shared/schema";
import { translations, getDirection } from "@/lib/i18n";
import { useSEO } from "@/hooks/use-seo";
import { useBreadcrumbStructuredData } from "@/hooks/use-breadcrumb-structured-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const currentLang = localStorage.getItem("language") || "ar";
  const t = translations[currentLang];
  const direction = getDirection(currentLang);

  // Fetch blog post by slug
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });

  // SEO metadata
  useSEO({
    title: post ? (currentLang === "ar" ? post.titleAr : post.titleEn) : t.blog.title,
    description: post ? (currentLang === "ar" ? post.excerptAr : post.excerptEn) : t.blog.description,
    keywords: post ? `${currentLang === "ar" ? post.titleAr : post.titleEn}, كهرباء, electrical` : "blog, electrical",
    image: post?.imageUrl,
  });

  // Breadcrumb structured data
  useBreadcrumbStructuredData([
    { name: currentLang === "ar" ? "الرئيسية" : "Home", url: "https://aseskahraba.com/" },
    { name: t.blog.title, url: "https://aseskahraba.com/blog" },
    { 
      name: post ? (currentLang === "ar" ? post.titleAr : post.titleEn) : "", 
      url: `https://aseskahraba.com/blog/${slug}` 
    },
  ]);

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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background" dir={direction}>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {currentLang === "ar" ? "المقال غير موجود" : "Post Not Found"}
            </h1>
            <Link href="/blog">
              <Button variant="default">
                {currentLang === "ar" ? "العودة للمدونة" : "Back to Blog"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const title = currentLang === "ar" ? post.titleAr : post.titleEn;
  const content = currentLang === "ar" ? post.contentAr : post.contentEn;

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      {/* Back to Blog Button */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              {currentLang === "ar" ? (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {t.blog.backToBlog || "العودة للمدونة"}
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.blog.backToBlog || "Back to Blog"}
                </>
              )}
            </Button>
          </Link>
        </div>
      </section>

      {/* Blog Post Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.imageUrl && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={post.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-muted-foreground mb-8 pb-8 border-b">
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
            </div>

            {/* Content */}
            <Card>
              <CardContent className="prose prose-lg dark:prose-invert max-w-none pt-6">
                <div 
                  className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </CardContent>
            </Card>

            {/* Back to Blog Footer */}
            <div className="mt-12 text-center">
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  {currentLang === "ar" ? (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {t.blog.backToBlog || "العودة للمدونة"}
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t.blog.backToBlog || "Back to Blog"}
                    </>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Structured Data for Blog Post */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            image: post.imageUrl ? [post.imageUrl] : [],
            datePublished: post.createdAt?.toISOString(),
            dateModified: post.createdAt?.toISOString(),
            author: {
              "@type": "Organization",
              name: "Ases Kahraba",
              url: "https://aseskahraba.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Ases Kahraba",
              url: "https://aseskahraba.com",
            },
            description: currentLang === "ar" ? post.excerptAr : post.excerptEn,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://aseskahraba.com/blog/${post.slug}`,
            },
          }),
        }}
      />
    </div>
  );
}
