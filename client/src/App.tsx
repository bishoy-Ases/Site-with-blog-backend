import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initGA, initFBPixel, loadAnalyticsSettings } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import FoundationCalculator from "@/pages/foundation-calculator";
import FinishingCalculator from "@/pages/finishing-calculator";
import NotFound from "@/pages/not-found";

/**
 * Main router component handling all application routes
 * Uses Wouter for lightweight client-side routing
 */
function Router() {
  // Initialize analytics tracking for user behavior insights
  useAnalytics();

  return (
    <Switch>
      {/* Homepage route - main landing page with all sections */}
      <Route path="/" component={Home} />

      {/* Blog routes - blog listing and individual posts */}
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />

      {/* Calculator pages - pricing calculators for services */}
      <Route path="/calculator/foundation" component={FoundationCalculator} />
      <Route path="/calculator/finishing" component={FinishingCalculator} />

      {/* Admin panel - protected route for content management */}
      <Route path="/admin" component={Admin} />

      {/* 404 page - fallback for unmatched routes */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Root App component - main application entry point
 * Sets up global providers and initializes analytics
 */
function App() {
  useEffect(() => {
    // Load analytics settings from database first
    loadAnalyticsSettings().then(() => {
      // Initialize Google Analytics
      initGA();
      
      // Initialize Facebook Pixel if configured
      initFBPixel();
    });
  }, []);

  return (
    // Query client provider for server state management
    <QueryClientProvider client={queryClient}>
      {/* Tooltip provider for accessible tooltip components */}
      <TooltipProvider>
        {/* Toast notifications provider */}
        <Toaster />
        {/* Main application router */}
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
