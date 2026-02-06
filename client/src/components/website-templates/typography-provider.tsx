import { useEffect } from "react";
import { fontPairings, type BrandPersonality } from "@/lib/design-tokens";

interface TypographyProviderProps {
  children: React.ReactNode;
  personality?: BrandPersonality;
  customFonts?: {
    heading?: string;
    body?: string;
  };
}

const googleFontsMap: Record<string, string> = {
  "Space Grotesk": "Space+Grotesk:wght@300;400;500;600;700",
  "Inter": "Inter:wght@300;400;500;600;700",
  "Cormorant Garamond": "Cormorant+Garamond:wght@300;400;500;600;700",
  "Lora": "Lora:wght@400;500;600;700",
  "Cormorant": "Cormorant:wght@300;400;500;600;700",
  "Poppins": "Poppins:wght@300;400;500;600;700;800",
  "Nunito": "Nunito:wght@300;400;500;600;700;800",
  "DM Sans": "DM+Sans:wght@300;400;500;600;700",
  "JetBrains Mono": "JetBrains+Mono:wght@400;500;600;700",
  "Playfair Display": "Playfair+Display:wght@400;500;600;700",
  "Source Serif 4": "Source+Serif+4:wght@300;400;500;600;700",
  "Syne": "Syne:wght@400;500;600;700;800",
  "Work Sans": "Work+Sans:wght@300;400;500;600;700",
  "Montserrat": "Montserrat:wght@300;400;500;600;700;800",
  "Source Sans 3": "Source+Sans+3:wght@300;400;500;600;700",
  "Oswald": "Oswald:wght@400;500;600;700",
  "Bebas Neue": "Bebas+Neue:wght@400",
  "Fredoka": "Fredoka:wght@300;400;500;600;700",
  "Merriweather": "Merriweather:wght@300;400;700",
  "Open Sans": "Open+Sans:wght@300;400;500;600;700",
  "Fraunces": "Fraunces:wght@400;500;600;700;800",
  "Outfit": "Outfit:wght@300;400;500;600;700",
  "Caveat": "Caveat:wght@400;500;600;700",
  "Libre Baskerville": "Libre+Baskerville:wght@400;700",
  "Lato": "Lato:wght@300;400;700",
  "Satisfy": "Satisfy:wght@400",
  "IBM Plex Sans": "IBM+Plex+Sans:wght@300;400;500;600;700",
  "IBM Plex Mono": "IBM+Plex+Mono:wght@400;500;600;700",
  "Space Mono": "Space+Mono:wght@400;700",
  "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@300;400;500;600;700;800",
  "Fira Code": "Fira+Code:wght@400;500;600;700",
  "Cinzel": "Cinzel:wght@400;500;600;700;800",
  "Source Sans Pro": "Source+Sans+Pro:wght@300;400;600;700",
  "Azeret Mono": "Azeret+Mono:wght@400;500;600;700",
  "Orbitron": "Orbitron:wght@400;500;600;700;800",
  "Press Start 2P": "Press+Start+2P:wght@400",
  "Newsreader": "Newsreader:wght@300;400;500;600;700",
  "Libre Franklin": "Libre+Franklin:wght@300;400;500;600;700",
  "DM Mono": "DM+Mono:wght@400;500",
  "Proza Libre": "Proza+Libre:wght@400;500;600;700",
  "Raleway": "Raleway:wght@300;400;500;600;700;800",
  "Rubik": "Rubik:wght@300;400;500;600;700",
  "Manrope": "Manrope:wght@300;400;500;600;700;800",
  "Bricolage Grotesque": "Bricolage+Grotesque:wght@400;500;600;700;800",
  "Instrument Serif": "Instrument+Serif:wght@400",
  "Archivo": "Archivo:wght@300;400;500;600;700;800",
  "Hanken Grotesk": "Hanken+Grotesk:wght@300;400;500;600;700",
  "Figtree": "Figtree:wght@300;400;500;600;700",
  "Lexend": "Lexend:wght@300;400;500;600;700",
  "Red Hat Display": "Red+Hat+Display:wght@400;500;600;700;800",
  "Onest": "Onest:wght@300;400;500;600;700",
  // Self-hosted/variable fonts - mapped to Google Fonts fallbacks
  "Satoshi": "DM+Sans:wght@300;400;500;600;700",
  "Clash Display": "Space+Grotesk:wght@300;400;500;600;700",
  "Cabinet Grotesk": "DM+Sans:wght@300;400;500;600;700",
  "General Sans": "DM+Sans:wght@300;400;500;600;700",
  "Geist": "Inter:wght@300;400;500;600;700",
  "Geist Mono": "JetBrains+Mono:wght@400;500;600;700",
};

function loadGoogleFonts(fonts: string[]) {
  const uniqueFonts = Array.from(new Set(fonts));
  const fontString = uniqueFonts
    .map(font => googleFontsMap[font])
    .filter(Boolean)
    .join("&family=");
  
  if (!fontString) return;
  
  const existingLink = document.querySelector('link[data-typography-provider]');
  if (existingLink) {
    existingLink.remove();
  }
  
  const link = document.createElement("link");
  link.setAttribute("data-typography-provider", "true");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontString}&display=swap`;
  document.head.appendChild(link);
}

export default function TypographyProvider({ 
  children, 
  personality = "professional",
  customFonts 
}: TypographyProviderProps) {
  const fonts = customFonts || fontPairings[personality];
  
  useEffect(() => {
    const fontsToLoad = [
      customFonts?.heading || fonts.heading,
      customFonts?.body || fonts.body,
    ].filter(Boolean) as string[];
    
    loadGoogleFonts(fontsToLoad);
    
    const root = document.documentElement;
    root.style.setProperty("--font-heading", `"${customFonts?.heading || fonts.heading}", sans-serif`);
    root.style.setProperty("--font-body", `"${customFonts?.body || fonts.body}", sans-serif`);
    
    return () => {
      root.style.removeProperty("--font-heading");
      root.style.removeProperty("--font-body");
    };
  }, [fonts, customFonts]);
  
  return <>{children}</>;
}

export function useTypography(personality: BrandPersonality = "professional") {
  return fontPairings[personality];
}
