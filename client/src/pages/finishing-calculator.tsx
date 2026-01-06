import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  Lightbulb,
  CheckCircle
} from "lucide-react";

/**
 * Finishing Calculator page component
 * Calculates pricing for electrical finishing services
 */
export default function FinishingCalculator() {
  // Language state management with localStorage persistence
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language | null;
    return stored === 'en' ? 'en' : 'ar';
  });

  const t = translations[language];
  const dir = getDirection(language);

  // Calculator state
  const [area, setArea] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Available finishing services with prices
  const services = [
    { id: "outlets", labelAr: "مآخذ كهربائية", labelEn: "Electrical outlets", price: 150 },
    { id: "switches", labelAr: "مفاتيح إضاءة", labelEn: "Light switches", price: 100 },
    { id: "lighting", labelAr: "تركيب الإضاءة", labelEn: "Lighting installation", price: 200 },
    { id: "ceiling-fans", labelAr: "مراوح سقف", labelEn: "Ceiling fans", price: 300 },
    { id: "ac-outlets", labelAr: "مآخذ تكييف", labelEn: "AC outlets", price: 250 },
    { id: "internet", labelAr: "تمديدات الإنترنت", labelEn: "Internet wiring", price: 180 },
    { id: "tv", labelAr: "تمديدات التلفزيون", labelEn: "TV wiring", price: 120 },
    { id: "smoke-detectors", labelAr: "كاشفات الدخان", labelEn: "Smoke detectors", price: 80 }
  ];

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

  // Handle service selection
  const handleServiceChange = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    }
  };

  // Calculate price based on inputs
  useEffect(() => {
    if (area && roomType && selectedServices.length > 0) {
      const areaNum = parseFloat(area);
      let roomMultiplier = 1;

      // Room type multipliers
      switch (roomType) {
        case "living-room":
          roomMultiplier = 1.2;
          break;
        case "bedroom":
          roomMultiplier = 1.0;
          break;
        case "kitchen":
          roomMultiplier = 1.5;
          break;
        case "bathroom":
          roomMultiplier = 1.3;
          break;
        case "office":
          roomMultiplier = 1.1;
          break;
        default:
          roomMultiplier = 1.0;
      }

      // Calculate service costs
      const serviceCost = selectedServices.reduce((total, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return total + (service ? service.price : 0);
      }, 0);

      // Base installation cost per square meter
      const baseCostPerSqm = 50;
      const installationCost = areaNum * baseCostPerSqm * roomMultiplier;

      const calculatedPrice = installationCost + serviceCost;
      setTotalPrice(Math.round(calculatedPrice));
      
      // Track calculator usage with Facebook Pixel
      trackFBEvent('ViewContent', {
        content_name: 'Finishing Calculator',
        content_category: 'Calculator',
        value: Math.round(calculatedPrice),
        currency: 'EGP'
      });
    } else {
      setTotalPrice(0);
    }
  }, [area, roomType, selectedServices]);

  // SEO setup
  useSEO({
    title: language === 'ar' ? "حاسبة تسعيرة التشطيبات الكهربائية" : "Finishing Price Calculator",
    description: language === 'ar' ? "احسب تكلفة التشطيبات الكهربائية بدقة" : "Calculate electrical finishing costs accurately",
    keywords: language === 'ar' ? "حاسبة, تسعيرة, تشطيبات كهربائية, أسيس كهرابا" : "calculator, pricing, electrical finishing, Ases Kahraba"
  });

  // Breadcrumb structured data
  useBreadcrumbStructuredData([
    { name: language === 'ar' ? "الرئيسية" : "Home", url: "/" },
    { name: language === 'ar' ? "حاسبة التشطيبات" : "Finishing Calculator", url: "/calculator/finishing" }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800" dir={dir}>
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
                <Calculator className="h-6 w-6 text-green-600" />
                {language === 'ar' ? "حاسبة تسعيرة التشطيبات الكهربائية" : "Electrical Finishing Price Calculator"}
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

              {/* Room Type */}
              <div className="space-y-2">
                <Label htmlFor="room-type">
                  {language === 'ar' ? "نوع الغرفة" : "Room Type"}
                </Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? "اختر نوع الغرفة" : "Select room type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="living-room">{language === 'ar' ? "غرفة معيشة" : "Living Room"}</SelectItem>
                    <SelectItem value="bedroom">{language === 'ar' ? "غرفة نوم" : "Bedroom"}</SelectItem>
                    <SelectItem value="kitchen">{language === 'ar' ? "مطبخ" : "Kitchen"}</SelectItem>
                    <SelectItem value="bathroom">{language === 'ar' ? "حمام" : "Bathroom"}</SelectItem>
                    <SelectItem value="office">{language === 'ar' ? "مكتب" : "Office"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Services Selection */}
              <div className="space-y-4">
                <Label>
                  {language === 'ar' ? "الخدمات المطلوبة" : "Required Services"}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => handleServiceChange(service.id, checked as boolean)}
                      />
                      <Label htmlFor={service.id} className="text-sm font-normal cursor-pointer">
                        {language === 'ar' ? service.labelAr : service.labelEn} - {service.price} {language === 'ar' ? "جنيه" : "EGP"}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result */}
              {totalPrice > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-lg">
                      {language === 'ar' ? "التكلفة التقديرية" : "Estimated Cost"}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {totalPrice.toLocaleString()} {language === 'ar' ? "جنيه مصري" : "EGP"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {language === 'ar' ? "* هذا تقدير تقريبي وقد يختلف حسب الظروف الميدانية والمواد المستخدمة" : "* This is an approximate estimate and may vary based on site conditions and materials used"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {language === 'ar' ? "ما يشمل العرض" : "What's Included"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {language === 'ar' ? "تركيب جميع الأجهزة الكهربائية المختارة" : "Installation of all selected electrical devices"}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {language === 'ar' ? "تمديد الكابلات والأسلاك" : "Cable and wire installation"}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {language === 'ar' ? "اختبار السلامة الكهربائية" : "Electrical safety testing"}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {language === 'ar' ? "العمالة والمواد الأساسية" : "Labor and basic materials"}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {language === 'ar' ? "ضمان على الأعمال" : "Work warranty"}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}