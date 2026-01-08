import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { translations, getDirection, type Language } from "@/lib/i18n";
import { useSEO } from "@/hooks/use-seo";
import { useBreadcrumbStructuredData } from "@/hooks/use-breadcrumb-structured-data";
import { trackFBEvent } from "@/lib/analytics";
import logoUrl from "@assets/⬇️_Download_1766924051122.png";
import {
  ArrowLeft,
  Calculator,
  Zap,
  Home as HomeIcon,
  CheckCircle
} from "lucide-react";

/**
 * Foundation Laying Calculator page component
 * Calculates pricing for electrical foundation laying services
 */
export default function FoundationCalculator() {
  // Language state management with localStorage persistence
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language | null;
    return stored === 'en' ? 'en' : 'ar';
  });

  const t = translations[language];
  const dir = getDirection(language);

  // Calculator state
  const [area, setArea] = useState<string>("");
  const [foundationType, setFoundationType] = useState<string>("");
  const [depth, setDepth] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Update document language and direction attributes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language, dir]);

  // Language toggle handler
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  // Calculate price based on inputs
  useEffect(() => {
    if (area && foundationType && depth) {
      const areaNum = parseFloat(area);
      const depthNum = parseFloat(depth);
      let baseRate = 0;

      // Base rates per square meter based on foundation type
      switch (foundationType) {
        case "concrete":
          baseRate = 150; // EGP per sqm
          break;
        case "brick":
          baseRate = 120;
          break;
        case "block":
          baseRate = 130;
          break;
        default:
          baseRate = 140;
      }

      // Adjust for depth (deeper foundations cost more)
      const depthMultiplier = 1 + (depthNum - 0.5) * 0.2; // Base depth 0.5m

      const calculatedPrice = areaNum * baseRate * depthMultiplier;
      setTotalPrice(Math.round(calculatedPrice));
      
      // Track calculator usage with Facebook Pixel
      trackFBEvent('ViewContent', {
        content_name: 'Foundation Calculator',
        content_category: 'Calculator',
        value: Math.round(calculatedPrice),
        currency: 'EGP'
      });
    } else {
      setTotalPrice(0);
    }
  }, [area, foundationType, depth]);

  // SEO setup
  useSEO({
    title: language === 'ar' ? "حاسبة تسعيرة وضع الأساسات الكهربائية" : "Foundation Laying Price Calculator",
    description: language === 'ar' ? "احسب تكلفة وضع الأساسات الكهربائية بدقة" : "Calculate electrical foundation laying costs accurately"
  });

  // Breadcrumb structured data
  useBreadcrumbStructuredData([
    { name: language === 'ar' ? "الرئيسية" : "Home", url: "/" },
    { name: language === 'ar' ? "حاسبة وضع الأساسات" : "Foundation Calculator", url: "/calculator/foundation" }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" dir={dir}>
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <img src={logoUrl} alt="Ases Kahraba" className="h-8 w-8" />
                <span className="font-bold text-xl">Ases Kahraba</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageToggle language={language} onToggle={toggleLanguage} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {language === 'ar' ? "العودة للرئيسية" : "Back to Home"}
              </Button>
            </Link>
          </div>

          {/* Calculator Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calculator className="h-6 w-6 text-blue-600" />
                {language === 'ar' ? "حاسبة تسعيرة وضع الأساسات الكهربائية" : "Foundation Laying Price Calculator"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Area Input */}
              <div className="space-y-2">
                <Label htmlFor="area">
                  {language === 'ar' ? "المساحة (متر مربع)" : "Area (Square Meters)"}
                </Label>
                <Input
                  id="area"
                  type="number"
                  placeholder={language === 'ar' ? "أدخل المساحة" : "Enter area"}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Foundation Type */}
              <div className="space-y-2">
                <Label htmlFor="foundation-type">
                  {language === 'ar' ? "نوع الأساس" : "Foundation Type"}
                </Label>
                <Select value={foundationType} onValueChange={setFoundationType}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? "اختر نوع الأساس" : "Select foundation type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concrete">{language === 'ar' ? "خرسانة" : "Concrete"}</SelectItem>
                    <SelectItem value="brick">{language === 'ar' ? "طوب" : "Brick"}</SelectItem>
                    <SelectItem value="block">{language === 'ar' ? "بلوك" : "Block"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Depth Input */}
              <div className="space-y-2">
                <Label htmlFor="depth">
                  {language === 'ar' ? "العمق (متر)" : "Depth (Meters)"}
                </Label>
                <Input
                  id="depth"
                  type="number"
                  placeholder={language === 'ar' ? "أدخل العمق" : "Enter depth"}
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  min="0.1"
                  step="0.1"
                />
              </div>

              {/* Result */}
              {totalPrice > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">
                      {language === 'ar' ? "التكلفة التقديرية" : "Estimated Cost"}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    {totalPrice.toLocaleString()} {language === 'ar' ? "جنيه مصري" : "EGP"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {language === 'ar' ? "* هذا تقدير تقريبي وقد يختلف حسب الظروف الميدانية" : "* This is an approximate estimate and may vary based on site conditions"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5" />
                {language === 'ar' ? "ما يشمل العرض" : "What's Included"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {language === 'ar' ? "حفر الأساسات" : "Foundation excavation"}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {language === 'ar' ? "وضع الأنابيب الواقية" : "Protective conduit installation"}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {language === 'ar' ? "تمديد الكابلات الأساسية" : "Basic cable laying"}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {language === 'ar' ? "العمالة والمواد" : "Labor and materials"}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}