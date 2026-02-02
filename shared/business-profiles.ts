/**
 * Business Type Intelligence Profiles
 * 
 * Defines optimal section combinations, visual treatments, and content strategies
 * for different business types. This drives intelligent website generation.
 */

export type BusinessType = 
  | "saas"
  | "local_service"
  | "ecommerce"
  | "agency"
  | "creator"
  | "restaurant"
  | "healthcare"
  | "consulting"
  | "fitness"
  | "real_estate"
  | "nonprofit"
  | "portfolio"
  | "default";

export type HeroArchetype = "editorial" | "split" | "immersive" | "cinematic" | "bold" | "minimal";
export type VisualTreatment = "gradient" | "textured" | "minimal" | "animated" | "layered" | "glassmorphism";
export type SectionType = 
  | "hero"
  | "features"
  | "services"
  | "process"
  | "benefits"
  | "case_studies"
  | "testimonials"
  | "trust_signals"
  | "comparison"
  | "pricing"
  | "team"
  | "stats"
  | "faq"
  | "story"
  | "gallery"
  | "cta"
  | "contact"
  | "text";

export interface SectionConfig {
  type: SectionType;
  priority: number; // 1-10, higher = more important
  optional: boolean;
  visualTreatment?: VisualTreatment;
  contentDepth?: "brief" | "standard" | "detailed";
}

export interface BusinessProfile {
  type: BusinessType;
  name: string;
  description: string;
  
  // Hero configuration
  preferredHeroArchetypes: HeroArchetype[];
  heroContentFocus: string;
  
  // Section strategy
  coreSections: SectionConfig[]; // Always include
  recommendedSections: SectionConfig[]; // Include if relevant
  optionalSections: SectionConfig[]; // Include for depth
  
  // Visual strategy
  visualTreatments: VisualTreatment[];
  backgroundStyle: "solid" | "gradient" | "textured" | "animated";
  animationIntensity: "subtle" | "moderate" | "dynamic";
  
  // Content strategy
  toneGuidelines: string;
  keyMessaging: string[];
  socialProofType: "testimonials" | "case_studies" | "logos" | "stats" | "mixed";
  
  // Typography
  typographyScale: "compact" | "standard" | "generous" | "dramatic";
  
  // Industry context for AI
  industryContext: string;
}

export const BUSINESS_PROFILES: Record<BusinessType, BusinessProfile> = {
  saas: {
    type: "saas",
    name: "SaaS / Software",
    description: "Software as a Service products focused on productivity and efficiency",
    
    preferredHeroArchetypes: ["split", "bold", "minimal"],
    heroContentFocus: "Value proposition with product visualization or demo",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "gradient" },
      { type: "features", priority: 9, optional: false, contentDepth: "detailed" },
      { type: "pricing", priority: 8, optional: false },
      { type: "testimonials", priority: 7, optional: false },
      { type: "cta", priority: 9, optional: false },
    ],
    recommendedSections: [
      { type: "process", priority: 6, optional: true, contentDepth: "standard" },
      { type: "stats", priority: 5, optional: true },
      { type: "comparison", priority: 5, optional: true },
      { type: "faq", priority: 4, optional: true },
    ],
    optionalSections: [
      { type: "trust_signals", priority: 4, optional: true },
      { type: "case_studies", priority: 6, optional: true, contentDepth: "detailed" },
      { type: "team", priority: 3, optional: true },
    ],
    
    visualTreatments: ["gradient", "glassmorphism", "animated"],
    backgroundStyle: "gradient",
    animationIntensity: "moderate",
    
    toneGuidelines: "Professional yet approachable. Focus on productivity gains and ease of use.",
    keyMessaging: ["Free trial", "Easy setup", "Integrations", "Scale with you"],
    socialProofType: "mixed",
    
    typographyScale: "standard",
    industryContext: "Focus on productivity gains, ease of use, and seamless integration. Emphasize free trials, quick onboarding, and customer success stories."
  },
  
  local_service: {
    type: "local_service",
    name: "Local Service Business",
    description: "Local businesses serving their community (plumbers, cleaners, contractors)",
    
    preferredHeroArchetypes: ["split", "minimal", "immersive"],
    heroContentFocus: "Trust and immediate contact options",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "gradient" },
      { type: "services", priority: 9, optional: false, contentDepth: "detailed" },
      { type: "testimonials", priority: 8, optional: false },
      { type: "contact", priority: 9, optional: false },
    ],
    recommendedSections: [
      { type: "process", priority: 6, optional: true },
      { type: "trust_signals", priority: 7, optional: true },
      { type: "stats", priority: 5, optional: true },
      { type: "faq", priority: 5, optional: true },
    ],
    optionalSections: [
      { type: "gallery", priority: 4, optional: true },
      { type: "team", priority: 4, optional: true },
      { type: "story", priority: 3, optional: true },
    ],
    
    visualTreatments: ["textured", "gradient", "minimal"],
    backgroundStyle: "textured",
    animationIntensity: "subtle",
    
    toneGuidelines: "Friendly, trustworthy, and local. Emphasize community ties and reliability.",
    keyMessaging: ["Free estimates", "Licensed & insured", "Same-day service", "Local family business"],
    socialProofType: "testimonials",
    
    typographyScale: "standard",
    industryContext: "Emphasize trust, reliability, and local presence. Include clear contact info and service area. Highlight certifications and guarantees."
  },
  
  ecommerce: {
    type: "ecommerce",
    name: "E-commerce / Online Store",
    description: "Online retail and product-focused businesses",
    
    preferredHeroArchetypes: ["immersive", "cinematic", "bold"],
    heroContentFocus: "Product showcase with strong visual impact",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "animated" },
      { type: "features", priority: 8, optional: false, contentDepth: "standard" },
      { type: "gallery", priority: 9, optional: false },
      { type: "testimonials", priority: 7, optional: false },
      { type: "trust_signals", priority: 8, optional: false },
      { type: "cta", priority: 9, optional: false },
    ],
    recommendedSections: [
      { type: "benefits", priority: 6, optional: true },
      { type: "process", priority: 5, optional: true },
      { type: "faq", priority: 5, optional: true },
    ],
    optionalSections: [
      { type: "story", priority: 4, optional: true },
      { type: "stats", priority: 4, optional: true },
    ],
    
    visualTreatments: ["animated", "layered", "gradient"],
    backgroundStyle: "animated",
    animationIntensity: "dynamic",
    
    toneGuidelines: "Aspirational and product-focused. Create desire and urgency.",
    keyMessaging: ["Free shipping", "Easy returns", "Secure checkout", "Quality guarantee"],
    socialProofType: "mixed",
    
    typographyScale: "generous",
    industryContext: "Focus on product quality, fast shipping, and customer satisfaction. Use trust signals prominently. Create visual desire for products."
  },
  
  agency: {
    type: "agency",
    name: "Creative / Digital Agency",
    description: "Creative agencies, design studios, and marketing firms",
    
    preferredHeroArchetypes: ["editorial", "cinematic", "bold"],
    heroContentFocus: "Portfolio showcase and creative excellence",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "animated" },
      { type: "services", priority: 8, optional: false, contentDepth: "detailed" },
      { type: "case_studies", priority: 9, optional: false, contentDepth: "detailed" },
      { type: "team", priority: 7, optional: false },
      { type: "contact", priority: 8, optional: false },
    ],
    recommendedSections: [
      { type: "process", priority: 6, optional: true, contentDepth: "standard" },
      { type: "testimonials", priority: 6, optional: true },
      { type: "stats", priority: 5, optional: true },
    ],
    optionalSections: [
      { type: "story", priority: 5, optional: true },
      { type: "faq", priority: 3, optional: true },
      { type: "gallery", priority: 5, optional: true },
    ],
    
    visualTreatments: ["animated", "glassmorphism", "layered"],
    backgroundStyle: "animated",
    animationIntensity: "dynamic",
    
    toneGuidelines: "Creative, confident, and innovative. Show, don't tell.",
    keyMessaging: ["Award-winning work", "Strategic approach", "Results-driven", "Creative excellence"],
    socialProofType: "case_studies",
    
    typographyScale: "dramatic",
    industryContext: "Showcase creative excellence and results. Use portfolio work as primary proof. Emphasize strategic thinking and measurable outcomes."
  },
  
  creator: {
    type: "creator",
    name: "Creator / Personal Brand",
    description: "Content creators, influencers, and personal brands",
    
    preferredHeroArchetypes: ["editorial", "immersive", "cinematic"],
    heroContentFocus: "Personal connection and brand story",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "gradient" },
      { type: "story", priority: 9, optional: false, contentDepth: "detailed" },
      { type: "services", priority: 7, optional: false },
      { type: "testimonials", priority: 7, optional: false },
      { type: "cta", priority: 8, optional: false },
    ],
    recommendedSections: [
      { type: "gallery", priority: 6, optional: true },
      { type: "stats", priority: 5, optional: true },
      { type: "faq", priority: 4, optional: true },
    ],
    optionalSections: [
      { type: "features", priority: 4, optional: true },
      { type: "contact", priority: 5, optional: true },
    ],
    
    visualTreatments: ["gradient", "animated", "layered"],
    backgroundStyle: "gradient",
    animationIntensity: "moderate",
    
    toneGuidelines: "Authentic, personal, and engaging. Let personality shine through.",
    keyMessaging: ["Authentic connection", "Proven results", "Join the community", "Transform your journey"],
    socialProofType: "testimonials",
    
    typographyScale: "generous",
    industryContext: "Build personal connection and trust. Share authentic story and journey. Emphasize community and transformation."
  },
  
  restaurant: {
    type: "restaurant",
    name: "Restaurant / Food Service",
    description: "Restaurants, cafes, and food service businesses",
    
    preferredHeroArchetypes: ["immersive", "cinematic", "editorial"],
    heroContentFocus: "Appetizing visuals and atmosphere",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "animated" },
      { type: "features", priority: 8, optional: false, contentDepth: "standard" },
      { type: "gallery", priority: 9, optional: false },
      { type: "testimonials", priority: 7, optional: false },
      { type: "contact", priority: 9, optional: false },
    ],
    recommendedSections: [
      { type: "story", priority: 6, optional: true },
      { type: "team", priority: 5, optional: true },
    ],
    optionalSections: [
      { type: "faq", priority: 3, optional: true },
      { type: "stats", priority: 3, optional: true },
    ],
    
    visualTreatments: ["layered", "textured", "animated"],
    backgroundStyle: "textured",
    animationIntensity: "subtle",
    
    toneGuidelines: "Warm, inviting, and appetizing. Appeal to senses and experiences.",
    keyMessaging: ["Fresh ingredients", "Award-winning chef", "Memorable experiences", "Local favorite"],
    socialProofType: "testimonials",
    
    typographyScale: "generous",
    industryContext: "Appeal to senses and experiences. Use vivid, appetizing descriptions. Emphasize quality ingredients and atmosphere."
  },
  
  healthcare: {
    type: "healthcare",
    name: "Healthcare / Medical",
    description: "Medical practices, clinics, and healthcare providers",
    
    preferredHeroArchetypes: ["split", "minimal", "editorial"],
    heroContentFocus: "Trust, expertise, and patient care",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "minimal" },
      { type: "services", priority: 9, optional: false, contentDepth: "detailed" },
      { type: "team", priority: 8, optional: false },
      { type: "testimonials", priority: 7, optional: false },
      { type: "contact", priority: 9, optional: false },
    ],
    recommendedSections: [
      { type: "trust_signals", priority: 8, optional: true },
      { type: "process", priority: 6, optional: true },
      { type: "faq", priority: 6, optional: true },
    ],
    optionalSections: [
      { type: "stats", priority: 4, optional: true },
      { type: "story", priority: 4, optional: true },
    ],
    
    visualTreatments: ["minimal", "gradient", "textured"],
    backgroundStyle: "gradient",
    animationIntensity: "subtle",
    
    toneGuidelines: "Empathetic, professional, and reassuring. Prioritize trust and care.",
    keyMessaging: ["Board certified", "Patient-centered care", "Compassionate staff", "Modern facilities"],
    socialProofType: "testimonials",
    
    typographyScale: "standard",
    industryContext: "Prioritize trust, safety, and patient outcomes. Use empathetic language. Emphasize certifications and experience."
  },
  
  consulting: {
    type: "consulting",
    name: "Consulting / Professional Services",
    description: "Business consultants and professional service firms",
    
    preferredHeroArchetypes: ["editorial", "split", "minimal"],
    heroContentFocus: "Expertise and measurable results",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "gradient" },
      { type: "services", priority: 9, optional: false, contentDepth: "detailed" },
      { type: "case_studies", priority: 8, optional: false, contentDepth: "detailed" },
      { type: "team", priority: 7, optional: false },
      { type: "contact", priority: 8, optional: false },
    ],
    recommendedSections: [
      { type: "process", priority: 7, optional: true, contentDepth: "detailed" },
      { type: "testimonials", priority: 6, optional: true },
      { type: "stats", priority: 6, optional: true },
    ],
    optionalSections: [
      { type: "faq", priority: 4, optional: true },
      { type: "story", priority: 4, optional: true },
    ],
    
    visualTreatments: ["gradient", "minimal", "glassmorphism"],
    backgroundStyle: "gradient",
    animationIntensity: "subtle",
    
    toneGuidelines: "Authoritative, strategic, and results-oriented. Demonstrate thought leadership.",
    keyMessaging: ["Proven methodology", "Measurable results", "Industry expertise", "Strategic partner"],
    socialProofType: "case_studies",
    
    typographyScale: "standard",
    industryContext: "Convey expertise, results, and strategic thinking. Use authoritative language. Emphasize case studies and measurable outcomes."
  },
  
  fitness: {
    type: "fitness",
    name: "Fitness / Wellness",
    description: "Gyms, fitness studios, and wellness businesses",
    
    preferredHeroArchetypes: ["immersive", "bold", "cinematic"],
    heroContentFocus: "Transformation and motivation",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "animated" },
      { type: "services", priority: 8, optional: false, contentDepth: "standard" },
      { type: "testimonials", priority: 9, optional: false },
      { type: "team", priority: 7, optional: false },
      { type: "pricing", priority: 7, optional: false },
      { type: "contact", priority: 8, optional: false },
    ],
    recommendedSections: [
      { type: "process", priority: 5, optional: true },
      { type: "stats", priority: 6, optional: true },
      { type: "gallery", priority: 5, optional: true },
    ],
    optionalSections: [
      { type: "faq", priority: 4, optional: true },
      { type: "story", priority: 4, optional: true },
    ],
    
    visualTreatments: ["animated", "layered", "gradient"],
    backgroundStyle: "animated",
    animationIntensity: "dynamic",
    
    toneGuidelines: "Motivational, energetic, and empowering. Inspire action and transformation.",
    keyMessaging: ["Transform your life", "Expert trainers", "Community support", "Results guaranteed"],
    socialProofType: "testimonials",
    
    typographyScale: "dramatic",
    industryContext: "Inspire action and transformation. Use motivational language. Emphasize results, expertise, and community."
  },
  
  real_estate: {
    type: "real_estate",
    name: "Real Estate",
    description: "Real estate agents, brokers, and property services",
    
    preferredHeroArchetypes: ["immersive", "split", "cinematic"],
    heroContentFocus: "Dream homes and local expertise",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "animated" },
      { type: "services", priority: 8, optional: false, contentDepth: "detailed" },
      { type: "testimonials", priority: 8, optional: false },
      { type: "stats", priority: 7, optional: false },
      { type: "contact", priority: 9, optional: false },
    ],
    recommendedSections: [
      { type: "gallery", priority: 7, optional: true },
      { type: "process", priority: 6, optional: true },
      { type: "team", priority: 5, optional: true },
    ],
    optionalSections: [
      { type: "faq", priority: 4, optional: true },
      { type: "story", priority: 4, optional: true },
    ],
    
    visualTreatments: ["layered", "animated", "gradient"],
    backgroundStyle: "animated",
    animationIntensity: "moderate",
    
    toneGuidelines: "Aspirational, trustworthy, and expert. Focus on dreams and investment potential.",
    keyMessaging: ["Local market expert", "Top producer", "Dream home awaits", "Investment guidance"],
    socialProofType: "testimonials",
    
    typographyScale: "generous",
    industryContext: "Focus on dreams, investment potential, and local expertise. Use aspirational language. Emphasize market knowledge and client success."
  },
  
  nonprofit: {
    type: "nonprofit",
    name: "Nonprofit / Charity",
    description: "Nonprofit organizations and charitable causes",
    
    preferredHeroArchetypes: ["immersive", "editorial", "cinematic"],
    heroContentFocus: "Mission impact and emotional connection",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "animated" },
      { type: "story", priority: 9, optional: false, contentDepth: "detailed" },
      { type: "stats", priority: 8, optional: false },
      { type: "testimonials", priority: 7, optional: false },
      { type: "cta", priority: 9, optional: false },
    ],
    recommendedSections: [
      { type: "team", priority: 6, optional: true },
      { type: "gallery", priority: 6, optional: true },
      { type: "process", priority: 5, optional: true },
    ],
    optionalSections: [
      { type: "faq", priority: 4, optional: true },
      { type: "contact", priority: 5, optional: true },
    ],
    
    visualTreatments: ["gradient", "layered", "textured"],
    backgroundStyle: "gradient",
    animationIntensity: "moderate",
    
    toneGuidelines: "Inspiring, hopeful, and authentic. Create emotional connection to the cause.",
    keyMessaging: ["Make a difference", "100% goes to cause", "Join our mission", "See your impact"],
    socialProofType: "stats",
    
    typographyScale: "generous",
    industryContext: "Create emotional connection to the mission. Share impact stories and statistics. Make donation process clear and compelling."
  },
  
  portfolio: {
    type: "portfolio",
    name: "Portfolio / Freelancer",
    description: "Personal portfolios for designers, developers, and creatives",
    
    preferredHeroArchetypes: ["editorial", "minimal", "bold"],
    heroContentFocus: "Work showcase and personal brand",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "gradient" },
      { type: "gallery", priority: 9, optional: false },
      { type: "services", priority: 7, optional: false },
      { type: "testimonials", priority: 6, optional: false },
      { type: "contact", priority: 8, optional: false },
    ],
    recommendedSections: [
      { type: "story", priority: 6, optional: true },
      { type: "process", priority: 5, optional: true },
    ],
    optionalSections: [
      { type: "stats", priority: 4, optional: true },
      { type: "faq", priority: 3, optional: true },
    ],
    
    visualTreatments: ["animated", "minimal", "glassmorphism"],
    backgroundStyle: "gradient",
    animationIntensity: "moderate",
    
    toneGuidelines: "Creative, professional, and personable. Let the work speak loudly.",
    keyMessaging: ["Award-winning work", "Available for hire", "Let's create together", "Quality craftsmanship"],
    socialProofType: "testimonials",
    
    typographyScale: "dramatic",
    industryContext: "Showcase best work prominently. Build personal connection. Make hiring process simple and clear."
  },
  
  default: {
    type: "default",
    name: "General Business",
    description: "Default profile for unclassified business types",
    
    preferredHeroArchetypes: ["split", "minimal", "editorial"],
    heroContentFocus: "Clear value proposition",
    
    coreSections: [
      { type: "hero", priority: 10, optional: false, visualTreatment: "gradient" },
      { type: "features", priority: 8, optional: false },
      { type: "services", priority: 7, optional: false },
      { type: "testimonials", priority: 7, optional: false },
      { type: "cta", priority: 8, optional: false },
      { type: "contact", priority: 7, optional: false },
    ],
    recommendedSections: [
      { type: "process", priority: 5, optional: true },
      { type: "stats", priority: 5, optional: true },
      { type: "faq", priority: 4, optional: true },
    ],
    optionalSections: [
      { type: "team", priority: 4, optional: true },
      { type: "story", priority: 4, optional: true },
      { type: "gallery", priority: 4, optional: true },
    ],
    
    visualTreatments: ["gradient", "minimal", "textured"],
    backgroundStyle: "gradient",
    animationIntensity: "moderate",
    
    toneGuidelines: "Professional, clear, and customer-focused. Emphasize value and reliability.",
    keyMessaging: ["Quality service", "Expert team", "Customer first", "Proven results"],
    socialProofType: "testimonials",
    
    typographyScale: "standard",
    industryContext: "Focus on professionalism, quality, and customer satisfaction. Use clear, benefit-driven language."
  }
};

/**
 * Detect business type from industry and business idea
 */
export function detectBusinessType(industry: string, businessIdea?: string): BusinessType {
  const lowerIndustry = industry.toLowerCase();
  const lowerIdea = (businessIdea || "").toLowerCase();
  const combined = `${lowerIndustry} ${lowerIdea}`;
  
  // SaaS / Software
  if (combined.match(/saas|software|app|platform|tool|api|automation|cloud|subscription|dashboard/)) {
    return "saas";
  }
  
  // E-commerce
  if (combined.match(/ecommerce|e-commerce|shop|store|retail|products|sell|merchandise|dropship/)) {
    return "ecommerce";
  }
  
  // Agency
  if (combined.match(/agency|studio|creative|design|marketing|advertising|digital|branding/)) {
    return "agency";
  }
  
  // Creator
  if (combined.match(/creator|influencer|coach|course|mentor|personal brand|youtube|podcast|content/)) {
    return "creator";
  }
  
  // Restaurant
  if (combined.match(/restaurant|cafe|coffee|food|dining|catering|bakery|bar|kitchen/)) {
    return "restaurant";
  }
  
  // Healthcare
  if (combined.match(/health|medical|doctor|clinic|dental|therapy|wellness|mental|nurse|patient/)) {
    return "healthcare";
  }
  
  // Consulting
  if (combined.match(/consult|advisory|strategy|business services|professional services|management/)) {
    return "consulting";
  }
  
  // Fitness
  if (combined.match(/fitness|gym|personal train|yoga|pilates|workout|exercise|sport|athletic/)) {
    return "fitness";
  }
  
  // Real Estate
  if (combined.match(/real estate|realtor|property|housing|homes|apartments|mortgage|broker/)) {
    return "real_estate";
  }
  
  // Nonprofit
  if (combined.match(/nonprofit|non-profit|charity|foundation|cause|donate|volunteer|mission/)) {
    return "nonprofit";
  }
  
  // Portfolio
  if (combined.match(/portfolio|freelance|designer|developer|photographer|artist|creative professional/)) {
    return "portfolio";
  }
  
  // Local Service
  if (combined.match(/plumb|electric|clean|repair|landscap|handyman|contractor|HVAC|roofing|painting|moving|pest|locksmith/)) {
    return "local_service";
  }
  
  return "default";
}

/**
 * Get sections for a business type in priority order
 */
export function getSectionsForBusinessType(
  businessType: BusinessType, 
  includeOptional: boolean = false,
  maxSections?: number
): SectionConfig[] {
  const profile = BUSINESS_PROFILES[businessType] || BUSINESS_PROFILES.default;
  
  let sections: SectionConfig[] = [...profile.coreSections];
  
  if (includeOptional || !maxSections) {
    sections = [...sections, ...profile.recommendedSections];
    if (includeOptional) {
      sections = [...sections, ...profile.optionalSections];
    }
  }
  
  // Sort by priority (highest first)
  sections.sort((a, b) => b.priority - a.priority);
  
  // Limit sections if needed
  if (maxSections && sections.length > maxSections) {
    sections = sections.slice(0, maxSections);
  }
  
  return sections;
}

/**
 * Get the best hero archetype for a business type and brand tone
 */
export function getHeroArchetype(businessType: BusinessType, tone?: string): HeroArchetype {
  const profile = BUSINESS_PROFILES[businessType] || BUSINESS_PROFILES.default;
  const lowerTone = (tone || "").toLowerCase();
  
  // Map tone to preferred archetype
  if (lowerTone.includes("bold") || lowerTone.includes("energetic")) {
    if (profile.preferredHeroArchetypes.includes("bold")) return "bold";
    if (profile.preferredHeroArchetypes.includes("cinematic")) return "cinematic";
  }
  
  if (lowerTone.includes("elegant") || lowerTone.includes("luxury")) {
    if (profile.preferredHeroArchetypes.includes("editorial")) return "editorial";
    if (profile.preferredHeroArchetypes.includes("cinematic")) return "cinematic";
  }
  
  if (lowerTone.includes("minimal") || lowerTone.includes("clean")) {
    if (profile.preferredHeroArchetypes.includes("minimal")) return "minimal";
    if (profile.preferredHeroArchetypes.includes("split")) return "split";
  }
  
  if (lowerTone.includes("playful") || lowerTone.includes("creative")) {
    if (profile.preferredHeroArchetypes.includes("immersive")) return "immersive";
    if (profile.preferredHeroArchetypes.includes("bold")) return "bold";
  }
  
  // Return first preferred archetype as default
  return profile.preferredHeroArchetypes[0] || "split";
}
