import type { SectionContent } from "@shared/schema";
import HeroSelector from "./heroes";
import type { HeroArchetype } from "@/lib/design-tokens";

interface HeroData {
  headline?: string;
  subheadline?: string;
  statement?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  backgroundImageB64?: string;
  image?: string;
  imageB64?: string;
  badge?: string;
  heroArchetype?: HeroArchetype;
  features?: string[];
}

interface SectionHeroProps {
  section: SectionContent;
  siteName?: string;
}

export default function SectionHero({ section, siteName }: SectionHeroProps) {
  const data = (section.data || {}) as HeroData;
  
  const normalizedSection = {
    ...section,
    data: {
      ...data,
      image: data.image || data.backgroundImage,
      imageB64: data.imageB64 || data.backgroundImageB64,
    }
  };
  
  const archetype = data.heroArchetype || "editorial";
  
  return <HeroSelector section={normalizedSection} siteName={siteName} archetype={archetype} />;
}
