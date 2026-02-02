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
