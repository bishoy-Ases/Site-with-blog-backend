declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
    __GA_INITIALIZED__?: boolean;
    __FB_PIXEL_INITIALIZED__?: boolean;
    __ANALYTICS_SETTINGS__?: {
      fb_pixel_id?: string;
      ga_measurement_id?: string;
    };
  }
}

import { apiUrl } from "@/lib/api";

const GA_MEASUREMENT_ID = 'G-WDRD35B2HV';

/**
 * Load analytics settings from database or use defaults
 * Falls back to hardcoded values if no API backend is available
 */
export async function loadAnalyticsSettings() {
  // Check if API is available
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  
  if (!apiBase) {
    // No backend API, use defaults
    window.__ANALYTICS_SETTINGS__ = {
      ga_measurement_id: GA_MEASUREMENT_ID,
    };
    return;
  }

  try {
    const response = await fetch(apiUrl('/api/settings'), { 
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const settings = await response.json();
    
    window.__ANALYTICS_SETTINGS__ = {
      fb_pixel_id: settings.find((s: any) => s.settingKey === 'fb_pixel_id')?.settingValue || '',
      ga_measurement_id: settings.find((s: any) => s.settingKey === 'ga_measurement_id')?.settingValue || GA_MEASUREMENT_ID,
    };
  } catch (error) {
    console.warn('Analytics API not available, using defaults:', error);
    window.__ANALYTICS_SETTINGS__ = {
      ga_measurement_id: GA_MEASUREMENT_ID,
    };
  }
}

export const initGA = () => {
  if (window.__GA_INITIALIZED__) {
    return;
  }
  window.__GA_INITIALIZED__ = true;

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  `;
  document.head.appendChild(script2);
};

export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url
  });
};

export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/**
 * Initialize Facebook Pixel
 * Uses database setting or falls back to environment variable
 */
export const initFBPixel = () => {
  const FB_PIXEL_ID = window.__ANALYTICS_SETTINGS__?.fb_pixel_id || import.meta.env.VITE_FB_PIXEL_ID;
  
  if (!FB_PIXEL_ID || window.__FB_PIXEL_INITIALIZED__) {
    return;
  }
  window.__FB_PIXEL_INITIALIZED__ = true;

  const script = document.createElement('script');
  script.textContent = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);

  // Add noscript fallback
  const noscript = document.createElement('noscript');
  const img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.src = `https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
};

/**
 * Track Facebook Pixel page view
 */
export const trackFBPageView = () => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'PageView');
};

/**
 * Track Facebook Pixel custom event
 * Common events: ViewContent, Search, AddToCart, InitiateCheckout, Purchase, Lead, Contact
 */
export const trackFBEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', eventName, parameters);
};

/**
 * Track Facebook Pixel custom event (not from standard events)
 */
export const trackFBCustomEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('trackCustom', eventName, parameters);
};
