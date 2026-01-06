import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/i18n";

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="gap-2"
      data-testid="button-language-toggle"
    >
      <Globe className="h-4 w-4" />
      <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
    </Button>
  );
}
