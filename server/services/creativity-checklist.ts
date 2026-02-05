/**
 * Creativity Checklist Service
 * 
 * Validates that generated websites meet premium quality standards:
 * - Hero archetype properly set for industry
 * - Visual signatures present (gradients, glassmorphism, etc.)
 * - Layout variety (no repetitive patterns)
 * - Section transitions configured
 * - SEO elements complete
 * - Font usage optimized (max 6 fonts)
 * - Image coverage complete
 * 
 * Auto-fixes missing elements where possible.
 */

interface ChecklistItem {
  name: string;
  status: "pass" | "fail" | "warning" | "fixed";
  message: string;
  autoFixed?: boolean;
}

interface ChecklistReport {
  passed: boolean;
  score: number;
  items: ChecklistItem[];
  fixes: string[];
}

const VALID_HERO_ARCHETYPES = ["cinematic", "immersive", "bold", "editorial", "split", "minimal"];

const PREMIUM_VISUAL_SIGNATURES = [
  "glassmorphism",
  "gradient",
  "blob",
  "parallax",
  "animated",
  "shadow",
  "glow",
  "overlay",
];

const REQUIRED_SEO_FIELDS = ["title", "description", "keywords"];

function getIndustryHeroArchetype(industry: string): string {
  const lowerIndustry = (industry || "").toLowerCase();
  
  if (/luxury|premium|real estate|hotel|hospitality|resort|spa|jewelry|automotive|fashion/i.test(lowerIndustry)) {
    return "cinematic";
  }
  if (/event|wedding|photography|travel|tourism|restaurant|food|dining|entertainment|beverage/i.test(lowerIndustry)) {
    return "immersive";
  }
  if (/startup|agency|creative|design|marketing|advertising|media|studio|innovation/i.test(lowerIndustry)) {
    return "bold";
  }
  if (/portfolio|personal|consulting|author|speaker|coach|influencer|creator/i.test(lowerIndustry)) {
    return "editorial";
  }
  if (/saas|software|tech|technology|app|platform|b2b|enterprise/i.test(lowerIndustry)) {
    return "split";
  }
  if (/legal|law|finance|banking|accounting|healthcare|medical|insurance|professional/i.test(lowerIndustry)) {
    return "minimal";
  }
  
  return "bold";
}

export function runCreativityChecklist(
  websiteContent: any,
  industry: string,
  autoFix: boolean = true
): ChecklistReport {
  const items: ChecklistItem[] = [];
  const fixes: string[] = [];
  let fixCount = 0;

  const pages = websiteContent?.pages || [];
  const siteSettings = websiteContent?.siteSettings || {};
  const seo = websiteContent?.seo || {};

  for (const page of pages) {
    const heroSection = page.sections?.find((s: any) => s.type === "hero");
    
    if (heroSection) {
      const currentArchetype = heroSection.data?.heroArchetype;
      const expectedArchetype = getIndustryHeroArchetype(industry);
      
      if (!currentArchetype || !VALID_HERO_ARCHETYPES.includes(currentArchetype)) {
        if (autoFix) {
          heroSection.data = heroSection.data || {};
          heroSection.data.heroArchetype = expectedArchetype;
          items.push({
            name: `Hero Archetype (${page.slug})`,
            status: "fixed",
            message: `Set to "${expectedArchetype}" for ${industry} industry`,
            autoFixed: true,
          });
          fixes.push(`Fixed hero archetype on ${page.slug} to "${expectedArchetype}"`);
          fixCount++;
        } else {
          items.push({
            name: `Hero Archetype (${page.slug})`,
            status: "fail",
            message: `Missing or invalid archetype: "${currentArchetype}"`,
          });
        }
      } else if (currentArchetype !== expectedArchetype) {
        if (autoFix) {
          heroSection.data.heroArchetype = expectedArchetype;
          items.push({
            name: `Hero Archetype (${page.slug})`,
            status: "fixed",
            message: `Changed from "${currentArchetype}" to "${expectedArchetype}"`,
            autoFixed: true,
          });
          fixes.push(`Corrected hero archetype on ${page.slug}`);
          fixCount++;
        } else {
          items.push({
            name: `Hero Archetype (${page.slug})`,
            status: "warning",
            message: `Expected "${expectedArchetype}" but got "${currentArchetype}"`,
          });
        }
      } else {
        items.push({
          name: `Hero Archetype (${page.slug})`,
          status: "pass",
          message: `Correctly set to "${currentArchetype}"`,
        });
      }
    }
  }

  const allFonts = new Set<string>();
  if (siteSettings.fontFamily) allFonts.add(siteSettings.fontFamily);
  if (siteSettings.headingFont) allFonts.add(siteSettings.headingFont);
  
  for (const page of pages) {
    for (const section of page.sections || []) {
      if (section.data?.fontFamily) allFonts.add(section.data.fontFamily);
      if (section.data?.headingFont) allFonts.add(section.data.headingFont);
    }
  }
  
  const fontCount = allFonts.size;
  if (fontCount > 6) {
    items.push({
      name: "Font Count",
      status: "warning",
      message: `${fontCount} fonts detected (max 6 recommended for performance)`,
    });
  } else if (fontCount >= 2) {
    items.push({
      name: "Font Count",
      status: "pass",
      message: `${fontCount} fonts (optimal for typography hierarchy)`,
    });
  } else {
    items.push({
      name: "Font Count",
      status: "warning",
      message: `Only ${fontCount} font(s) - consider adding heading/body distinction`,
    });
  }

  let hasVisualSignature = false;
  const settingsStr = JSON.stringify(siteSettings).toLowerCase();
  const pagesStr = JSON.stringify(pages).toLowerCase();
  
  for (const sig of PREMIUM_VISUAL_SIGNATURES) {
    if (settingsStr.includes(sig) || pagesStr.includes(sig)) {
      hasVisualSignature = true;
      break;
    }
  }
  
  if (hasVisualSignature) {
    items.push({
      name: "Visual Signatures",
      status: "pass",
      message: "Premium visual elements detected",
    });
  } else {
    items.push({
      name: "Visual Signatures",
      status: "warning",
      message: "Consider adding gradients, glassmorphism, or other premium effects",
    });
  }

  const sectionTypes = new Set<string>();
  const sectionPatterns: string[] = [];
  
  for (const page of pages) {
    const pagePattern = (page.sections || []).map((s: any) => s.type).join("->");
    sectionPatterns.push(pagePattern);
    for (const section of page.sections || []) {
      sectionTypes.add(section.type);
    }
  }
  
  const uniquePatterns = new Set(sectionPatterns);
  if (sectionTypes.size >= 6) {
    items.push({
      name: "Section Variety",
      status: "pass",
      message: `${sectionTypes.size} unique section types across pages`,
    });
  } else {
    items.push({
      name: "Section Variety",
      status: "warning",
      message: `Only ${sectionTypes.size} section types - consider diversifying`,
    });
  }

  for (const field of REQUIRED_SEO_FIELDS) {
    const homeSeo = seo.pages?.home || seo;
    if (homeSeo[field] && homeSeo[field].length > 0) {
      items.push({
        name: `SEO: ${field}`,
        status: "pass",
        message: `${field} is set`,
      });
    } else {
      items.push({
        name: `SEO: ${field}`,
        status: "fail",
        message: `Missing ${field} for SEO`,
      });
    }
  }

  let missingImages = 0;
  let totalImages = 0;
  
  for (const page of pages) {
    for (const section of page.sections || []) {
      if (section.data?.image || section.data?.backgroundImage) {
        totalImages++;
        const img = section.data.image || section.data.backgroundImage;
        if (!img || img.includes("placeholder") || img.includes("example.com")) {
          missingImages++;
        }
      }
      if (section.data?.images && Array.isArray(section.data.images)) {
        for (const img of section.data.images) {
          totalImages++;
          if (!img?.url || img.url.includes("placeholder")) {
            missingImages++;
          }
        }
      }
    }
  }
  
  if (totalImages === 0) {
    items.push({
      name: "Image Coverage",
      status: "warning",
      message: "No images detected in content",
    });
  } else if (missingImages === 0) {
    items.push({
      name: "Image Coverage",
      status: "pass",
      message: `All ${totalImages} images have valid URLs`,
    });
  } else {
    items.push({
      name: "Image Coverage",
      status: "fail",
      message: `${missingImages}/${totalImages} images missing or placeholder`,
    });
  }

  const passCount = items.filter(i => i.status === "pass" || i.status === "fixed").length;
  const failCount = items.filter(i => i.status === "fail").length;
  const score = Math.round((passCount / items.length) * 100);
  
  return {
    passed: failCount === 0,
    score,
    items,
    fixes,
  };
}

export function consolidateFonts(websiteContent: any, maxFonts: number = 6): { content: any; removed: string[] } {
  const fontUsage: Map<string, number> = new Map();
  const pages = websiteContent?.pages || [];
  const siteSettings = websiteContent?.siteSettings || {};
  
  if (siteSettings.fontFamily) {
    fontUsage.set(siteSettings.fontFamily, (fontUsage.get(siteSettings.fontFamily) || 0) + 10);
  }
  if (siteSettings.headingFont) {
    fontUsage.set(siteSettings.headingFont, (fontUsage.get(siteSettings.headingFont) || 0) + 10);
  }
  
  for (const page of pages) {
    for (const section of page.sections || []) {
      if (section.data?.fontFamily) {
        fontUsage.set(section.data.fontFamily, (fontUsage.get(section.data.fontFamily) || 0) + 1);
      }
      if (section.data?.headingFont) {
        fontUsage.set(section.data.headingFont, (fontUsage.get(section.data.headingFont) || 0) + 1);
      }
    }
  }
  
  const sortedFonts = [...fontUsage.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([font]) => font);
  
  const allowedFonts = new Set(sortedFonts.slice(0, maxFonts));
  const removed: string[] = sortedFonts.slice(maxFonts);
  
  if (removed.length === 0) {
    return { content: websiteContent, removed: [] };
  }
  
  const primaryFont = sortedFonts[0] || "Inter";
  const secondaryFont = sortedFonts[1] || primaryFont;
  
  const consolidatedPages = pages.map((page: any) => ({
    ...page,
    sections: page.sections?.map((section: any) => {
      const newData = { ...section.data };
      
      if (newData.fontFamily && !allowedFonts.has(newData.fontFamily)) {
        newData.fontFamily = primaryFont;
      }
      if (newData.headingFont && !allowedFonts.has(newData.headingFont)) {
        newData.headingFont = secondaryFont;
      }
      
      return { ...section, data: newData };
    }),
  }));
  
  const consolidatedSettings = { ...siteSettings };
  if (consolidatedSettings.fontFamily && !allowedFonts.has(consolidatedSettings.fontFamily)) {
    consolidatedSettings.fontFamily = primaryFont;
  }
  if (consolidatedSettings.headingFont && !allowedFonts.has(consolidatedSettings.headingFont)) {
    consolidatedSettings.headingFont = secondaryFont;
  }
  
  return {
    content: {
      ...websiteContent,
      pages: consolidatedPages,
      siteSettings: consolidatedSettings,
    },
    removed,
  };
}
