import { useEffect } from 'react';

/**
 * Breadcrumb item interface for structured data
 */
interface BreadcrumbItem {
  /** Display name of the breadcrumb item */
  name: string;
  /** Optional URL for the breadcrumb item */
  url?: string;
}

/**
 * Hook to add breadcrumb structured data to the page for better SEO
 * Implements JSON-LD BreadcrumbList schema for search engines
 *
 * @param breadcrumbs - Array of breadcrumb items with name and optional URL
 *
 * @example
 * ```tsx
 * useBreadcrumbStructuredData([
 *   { name: 'Home', url: 'https://example.com' },
 *   { name: 'Blog', url: 'https://example.com/blog' },
 *   { name: 'Article Title' }
 * ]);
 * ```
 */
export function useBreadcrumbStructuredData(breadcrumbs: BreadcrumbItem[]) {
  useEffect(() => {
    // Remove existing breadcrumb structured data to prevent duplicates
    const existingScript = document.querySelector('script[data-breadcrumb="true"]');
    if (existingScript) {
      document.head.removeChild(existingScript);
    }

    // Create new script element for breadcrumb structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb', 'true');

    // Generate BreadcrumbList structured data
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        ...(crumb.url && { "item": crumb.url })
      }))
    };

    script.textContent = JSON.stringify(breadcrumbList);
    document.head.appendChild(script);

    // Cleanup function to remove script on unmount
    return () => {
      const scriptToRemove = document.querySelector('script[data-breadcrumb="true"]');
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [breadcrumbs]);
}