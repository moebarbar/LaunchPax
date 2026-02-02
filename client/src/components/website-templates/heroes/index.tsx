import type { SectionContent } from "@shared/schema";
import type { HeroArchetype } from "@/lib/design-tokens";
import HeroEditorial from "./hero-editorial";
import HeroSplit from "./hero-split";
import HeroImmersive from "./hero-immersive";
import HeroCinematic from "./hero-cinematic";
import HeroBold from "./hero-bold";
import HeroMinimal from "./hero-minimal";

interface HeroSelectorProps {
  section: SectionContent;
  siteName?: string;
  archetype?: HeroArchetype;
}

export default function HeroSelector({ section, siteName, archetype = "editorial" }: HeroSelectorProps) {
  const effectiveArchetype = (section.data as any)?.heroArchetype || archetype;
  
  switch (effectiveArchetype) {
    case "editorial":
      return <HeroEditorial section={section} siteName={siteName} />;
    case "split":
      return <HeroSplit section={section} siteName={siteName} />;
    case "immersive":
      return <HeroImmersive section={section} siteName={siteName} />;
    case "cinematic":
      return <HeroCinematic section={section} siteName={siteName} />;
    case "bold":
      return <HeroBold section={section} siteName={siteName} />;
    case "minimal":
      return <HeroMinimal section={section} siteName={siteName} />;
    default:
      return <HeroEditorial section={section} siteName={siteName} />;
  }
}

export {
  HeroEditorial,
  HeroSplit,
  HeroImmersive,
  HeroCinematic,
  HeroBold,
  HeroMinimal,
};
