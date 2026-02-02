import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb,
  Layout,
  Star,
  Palette,
  Type,
  TrendingUp
} from "lucide-react";
import { BUSINESS_PROFILES, type BusinessProfile, type BusinessType, type SectionConfig } from "@shared/business-profiles";

interface IndustryRecommendation {
  industry: string;
  coreSections: string[];
  recommendedSections: string[];
  heroStyle: string;
  visualStyle: string;
  toneGuidelines: string;
  keyMessaging: string[];
}

const INDUSTRY_TO_BUSINESS_TYPE: Record<string, BusinessType> = {
  "Technology / SaaS": "saas",
  "Technology": "saas",
  "SaaS": "saas",
  "E-commerce": "ecommerce",
  "Healthcare / Wellness": "healthcare",
  "Healthcare": "healthcare",
  "Wellness": "healthcare",
  "Finance / Insurance": "consulting",
  "Finance": "consulting",
  "Education": "consulting",
  "Food & Beverage": "restaurant",
  "Restaurant": "restaurant",
  "Real Estate": "real_estate",
  "Entertainment": "creator",
  "Travel / Hospitality": "restaurant",
  "Fashion / Beauty": "ecommerce",
  "Fitness / Sports": "fitness",
  "Fitness": "fitness",
  "Consulting / Professional Services": "consulting",
  "Consulting": "consulting",
  "Creative / Agency": "agency",
  "Agency": "agency",
  "Non-Profit": "nonprofit",
  "Portfolio": "portfolio",
};

function formatSectionName(type: string): string {
  const names: Record<string, string> = {
    hero: "Hero",
    features: "Features",
    services: "Services",
    process: "How It Works",
    benefits: "Benefits",
    case_studies: "Case Studies",
    testimonials: "Testimonials",
    trust_signals: "Trust Signals",
    comparison: "Comparison",
    pricing: "Pricing",
    team: "Team",
    stats: "Stats",
    faq: "FAQ",
    story: "Story",
    gallery: "Gallery",
    cta: "CTA",
    contact: "Contact",
    text: "Text",
  };
  return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

function formatHeroArchetypes(archetypes: string[]): string {
  const descriptions: Record<string, string> = {
    editorial: "Editorial - Bold asymmetric layout",
    split: "Split - 50/50 with product demo",
    immersive: "Immersive - Full-screen imagery",
    cinematic: "Cinematic - Dramatic film-like",
    bold: "Bold - Extra-large typography",
    minimal: "Minimal - Clean and focused",
  };
  
  const formatted = archetypes.slice(0, 2).map(a => descriptions[a] || a);
  return formatted.join(" or ");
}

function formatVisualTreatments(treatments: string[]): string {
  const descriptions: Record<string, string> = {
    gradient: "Modern gradients",
    textured: "Textured backgrounds",
    minimal: "Clean and minimal",
    animated: "Subtle animations",
    layered: "Layered depth effects",
    glassmorphism: "Glassmorphism effects",
  };
  
  return treatments.slice(0, 3).map(t => descriptions[t] || t).join(", ");
}

function buildRecommendation(profile: BusinessProfile): IndustryRecommendation {
  return {
    industry: profile.name,
    coreSections: profile.coreSections.map(s => formatSectionName(s.type)),
    recommendedSections: profile.recommendedSections.map(s => formatSectionName(s.type)),
    heroStyle: formatHeroArchetypes(profile.preferredHeroArchetypes),
    visualStyle: formatVisualTreatments(profile.visualTreatments),
    toneGuidelines: profile.toneGuidelines,
    keyMessaging: profile.keyMessaging,
  };
}

function getRecommendationForIndustry(industry: string | null): IndustryRecommendation {
  if (!industry) {
    return buildRecommendation(BUSINESS_PROFILES.default);
  }
  
  const businessType = INDUSTRY_TO_BUSINESS_TYPE[industry];
  if (businessType && BUSINESS_PROFILES[businessType]) {
    return buildRecommendation(BUSINESS_PROFILES[businessType]);
  }
  
  return buildRecommendation(BUSINESS_PROFILES.default);
}

interface IndustryRecommendationsProps {
  industry?: string | null;
  compact?: boolean;
}

export function IndustryRecommendations({ industry, compact = false }: IndustryRecommendationsProps) {
  const recommendation = getRecommendationForIndustry(industry || null);

  if (compact) {
    return (
      <div className="space-y-2" data-testid="industry-recommendations-compact">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lightbulb className="w-4 h-4" />
          <span>Recommended for {recommendation.industry}:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {recommendation.coreSections.map((section) => (
            <Badge key={section} variant="secondary" className="text-xs">
              {section}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card data-testid="industry-recommendations-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg" data-testid="text-industry-name">
          <Lightbulb className="w-5 h-5 text-primary" />
          Recommended for {recommendation.industry}
        </CardTitle>
        <CardDescription>
          Based on what works best for businesses like yours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2 text-sm">
            <Layout className="w-4 h-4" />
            Essential Sections
          </h4>
          <div className="flex flex-wrap gap-2" data-testid="essential-sections">
            {recommendation.coreSections.map((section) => (
              <Badge key={section} variant="default">
                {section}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2 text-sm">
            <Star className="w-4 h-4" />
            Recommended Add-ons
          </h4>
          <div className="flex flex-wrap gap-2" data-testid="recommended-sections">
            {recommendation.recommendedSections.map((section) => (
              <Badge key={section} variant="outline">
                {section}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2 text-sm">
              <Palette className="w-4 h-4" />
              Hero Style
            </h4>
            <p className="text-sm text-muted-foreground" data-testid="text-hero-style">
              {recommendation.heroStyle}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2 text-sm">
              <Type className="w-4 h-4" />
              Visual Style
            </h4>
            <p className="text-sm text-muted-foreground" data-testid="text-visual-style">
              {recommendation.visualStyle}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            Key Messages That Convert
          </h4>
          <div className="flex flex-wrap gap-2" data-testid="key-messaging">
            {recommendation.keyMessaging.map((message) => (
              <Badge key={message} variant="secondary" className="text-xs">
                "{message}"
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm italic" data-testid="text-tone-guidelines">
            "{recommendation.toneGuidelines}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function getRecommendationsForIndustry(industry: string): IndustryRecommendation {
  return getRecommendationForIndustry(industry);
}
