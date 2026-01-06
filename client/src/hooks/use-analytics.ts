import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView, trackFBPageView } from '../lib/analytics';

export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (prevLocationRef.current === null || location !== prevLocationRef.current) {
      trackPageView(location);
      trackFBPageView();
      prevLocationRef.current = location;
    }
  }, [location]);
};
