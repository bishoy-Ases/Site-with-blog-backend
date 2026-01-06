import { useEffect } from 'react';

/**
 * SEO configuration interface for dynamic meta tag management
 */
interface SEOProps {
  /** Page title - will be appended to base title */
  title?: string;
  /** Meta description for search engines and social sharing */
  description?: string;
  /** Canonical URL to prevent duplicate content issues */
  canonical?: string;
  /** Open Graph image URL for social media sharing */
  ogImage?: string;
  /** Open Graph type (website, article, etc.) */
  ogType?: string;
  /** Whether to add noindex meta tag */
  noIndex?: boolean;
}

/**
 * Custom hook for managing SEO meta tags dynamically
 * Updates document head with appropriate meta tags for better search engine optimization
 *
 * @param props - SEO configuration object
 */
export function useSEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  noIndex = false
}: SEOProps) {
  useEffect(() => {
    // Set base title for Ases Kahraba
    const baseTitle = 'أسس كهربا | Ases Kahraba';

    // Update document title
    if (title) {
      document.title = `${title} | ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }

    /**
     * Helper function to set or update meta tags
     * @param name - Meta tag name or property
     * @param content - Meta tag content
     * @param property - Whether to use 'property' instead of 'name' attribute
     */
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Set meta description and Open Graph description
    if (description) {
      setMeta('description', description);
      setMeta('og:description', description, true);
      setMeta('twitter:description', description);
    }

    // Set canonical URL and related Open Graph/Twitter URLs
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
      setMeta('og:url', canonical, true);
      setMeta('twitter:url', canonical);
    }

    // Set Open Graph image and Twitter image
    if (ogImage) {
      setMeta('og:image', ogImage, true);
      setMeta('twitter:image', ogImage);
    }

    // Set Open Graph type
    setMeta('og:type', ogType, true);

    // Set Open Graph and Twitter titles if custom title provided
    if (title) {
      setMeta('og:title', `${title} | ${baseTitle}`, true);
      setMeta('twitter:title', `${title} | ${baseTitle}`);
    }

    // Set robots meta tag for noindex if specified
    if (noIndex) {
      setMeta('robots', 'noindex, nofollow');
    }
  }, [title, description, canonical, ogImage, ogType, noIndex]);
}
