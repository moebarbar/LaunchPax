import OpenAI from "openai";
import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

/**
 * OpenAI Connector (LaunchPax Engine)
 * 
 * Provides: name_generation, brand_generation, content_generation, text_generation
 * 
 * Uses GPT-4o for premium quality generation.
 * Requires user-provided OPENAI_API_KEY for cost control.
 */

const MODEL = "gpt-4o";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for OpenAI connector");
  }
  return new OpenAI({ apiKey });
}

interface StyleVariant {
  description: string;
  fonts: { heading: string; body: string };
  radiusStyle: string;
  gradientStyle?: string;
  visualSignatures?: string[];
}

function getStyleVariant(style: string): StyleVariant {
  const variants: Record<string, StyleVariant> = {
    modern: {
      description: "Clean lines, generous whitespace, subtle shadows. Focus on clarity and contemporary aesthetics.",
      fonts: { heading: "Inter", body: "Inter" },
      radiusStyle: "rounded-xl (12px)",
      gradientStyle: "subtle linear gradient from slate-50 to white",
      visualSignatures: ["glassmorphism cards", "soft shadows", "micro-interactions"]
    },
    minimal: {
      description: "Ultra-clean, lots of negative space, monochromatic with single accent. Typography-focused.",
      fonts: { heading: "DM Sans", body: "DM Sans" },
      radiusStyle: "rounded-lg (8px)",
      gradientStyle: "none - pure solid colors",
      visualSignatures: ["oversized typography", "single accent color", "negative space mastery"]
    },
    bold: {
      description: "High contrast, large typography, vibrant colors, dramatic shadows. Makes a strong statement.",
      fonts: { heading: "Oswald", body: "Open Sans" },
      radiusStyle: "rounded-md (6px)",
      gradientStyle: "bold diagonal gradient with vibrant colors",
      visualSignatures: ["oversized headlines", "color blocks", "geometric shapes"]
    },
    corporate: {
      description: "Professional, trustworthy, structured layouts. Emphasizes stability and expertise.",
      fonts: { heading: "Montserrat", body: "Source Sans 3" },
      radiusStyle: "rounded (4px)",
      gradientStyle: "subtle navy to slate gradient",
      visualSignatures: ["structured grids", "trust badges", "formal photography"]
    },
    elegant: {
      description: "Sophisticated, refined typography, subtle gradients. Luxury feel with attention to detail.",
      fonts: { heading: "Playfair Display", body: "Lora" },
      radiusStyle: "rounded-lg (8px)",
      gradientStyle: "warm cream to champagne gradient",
      visualSignatures: ["serif typography", "gold accents", "editorial layouts"]
    },
    creative: {
      description: "Playful, unexpected layouts, creative use of color. Fun and approachable.",
      fonts: { heading: "Poppins", body: "Nunito" },
      radiusStyle: "rounded-2xl (16px)",
      gradientStyle: "multi-color gradient with playful transitions",
      visualSignatures: ["asymmetric layouts", "blob shapes", "animated elements"]
    },
    tech: {
      description: "Futuristic, sharp edges optional, gradient accents. Modern technology feel.",
      fonts: { heading: "Space Grotesk", body: "Work Sans" },
      radiusStyle: "rounded-lg (8px)",
      gradientStyle: "electric blue to purple gradient",
      visualSignatures: ["gradient text", "terminal/code aesthetics", "dark mode optimized"]
    },
    luxe: {
      description: "Premium, exclusive feel with dark backgrounds. High-end hospitality and fashion.",
      fonts: { heading: "Cormorant Garamond", body: "Raleway" },
      radiusStyle: "rounded-md (6px)",
      gradientStyle: "deep charcoal to black with gold accents",
      visualSignatures: ["dark backgrounds", "gold typography", "cinematic imagery"]
    },
    editorial: {
      description: "Magazine-quality layout with dramatic typography. Perfect for storytelling.",
      fonts: { heading: "Libre Baskerville", body: "Source Serif 4" },
      radiusStyle: "rounded-lg (8px)",
      gradientStyle: "paper-like texture with subtle warmth",
      visualSignatures: ["large pull quotes", "asymmetric grids", "dropcaps"]
    },
    startup: {
      description: "Fresh, energetic, forward-thinking. Silicon Valley meets Main Street.",
      fonts: { heading: "Sora", body: "Outfit" },
      radiusStyle: "rounded-xl (12px)",
      gradientStyle: "gradient mesh with startup-friendly colors",
      visualSignatures: ["floating elements", "gradient buttons", "motion graphics"]
    },
    artisan: {
      description: "Handcrafted, authentic, warm. Perfect for local businesses and craftspeople.",
      fonts: { heading: "Josefin Sans", body: "Crimson Pro" },
      radiusStyle: "rounded-lg (8px)",
      gradientStyle: "warm earth tones gradient",
      visualSignatures: ["hand-drawn elements", "warm photography", "natural textures"]
    },
    healthcare: {
      description: "Calming, trustworthy, accessible. Conveys care and expertise.",
      fonts: { heading: "Manrope", body: "Karla" },
      radiusStyle: "rounded-xl (12px)",
      gradientStyle: "calming teal to soft green gradient",
      visualSignatures: ["rounded shapes", "soft colors", "human-centered imagery"]
    }
  };
  
  return variants[style] || variants.modern;
}

interface HeroArchetypeDetail {
  name: string;
  description: string;
  layoutSpec: string;
  subVariations: Array<{ name: string; spec: string }>;
  bestFor: string[];
}

function getDetailedHeroArchetype(archetype: string): HeroArchetypeDetail {
  const archetypes: Record<string, HeroArchetypeDetail> = {
    cinematic: {
      name: "Cinematic Hero",
      description: "Full-screen immersive experience with film-like quality",
      layoutSpec: "100vh height, full-bleed image with dark gradient overlay (60% opacity at bottom), centered content with headline at 4-6rem, subtle parallax scroll effect",
      subVariations: [
        { name: "cinematic-fade", spec: "Content fades in from bottom on scroll, ken-burns effect on image" },
        { name: "cinematic-reveal", spec: "Split curtain reveal animation, content appears with stagger" },
        { name: "cinematic-parallax", spec: "Multi-layer parallax with foreground/background elements" }
      ],
      bestFor: ["luxury", "real estate", "hospitality", "automotive", "fashion"]
    },
    immersive: {
      name: "Immersive Hero",
      description: "Full-screen image with centered text overlay for experiential brands",
      layoutSpec: "100vh height, large background image with centered content block, glassmorphism optional, CTA prominently placed below headline",
      subVariations: [
        { name: "immersive-centered", spec: "Content perfectly centered with soft vignette around edges" },
        { name: "immersive-bottom", spec: "Content anchored to bottom third with gradient fade up" },
        { name: "immersive-floating", spec: "Content in floating glassmorphism card over image" }
      ],
      bestFor: ["restaurants", "travel", "events", "photography", "wellness"]
    },
    bold: {
      name: "Bold Statement Hero",
      description: "Typography-forward with massive headlines and gradient backgrounds",
      layoutSpec: "90vh minimum, gradient or solid color background, headline at 5-8rem with gradient text effect optional, supporting text with high contrast",
      subVariations: [
        { name: "bold-gradient", spec: "Multi-color gradient background with floating geometric shapes" },
        { name: "bold-split-color", spec: "Diagonal color split with text spanning both zones" },
        { name: "bold-oversized", spec: "Typography so large it bleeds off screen edges" }
      ],
      bestFor: ["startups", "creative agencies", "marketing", "entertainment"]
    },
    editorial: {
      name: "Editorial Hero",
      description: "Magazine-style asymmetric layout with personality",
      layoutSpec: "Asymmetric grid with large image on one side, text on other with generous whitespace, dropcap optional, pull-quote styling",
      subVariations: [
        { name: "editorial-portrait", spec: "Large portrait/headshot with text alongside" },
        { name: "editorial-offset", spec: "Image offset from edge with overlapping text block" },
        { name: "editorial-story", spec: "Long-form intro text with small supporting image" }
      ],
      bestFor: ["consultants", "coaches", "authors", "personal brands", "thought leaders"]
    },
    split: {
      name: "Split Screen Hero",
      description: "50/50 or 60/40 split between content and visual",
      layoutSpec: "Two-column layout, one side with content (headline, description, CTAs), other side with image/illustration/product mockup",
      subVariations: [
        { name: "split-product", spec: "Product screenshot/mockup floating with shadow on right" },
        { name: "split-video", spec: "Inline video player or animated demo on right side" },
        { name: "split-stats", spec: "Key metrics/stats displayed alongside hero content" }
      ],
      bestFor: ["SaaS", "technology", "B2B", "software products"]
    },
    minimal: {
      name: "Minimal Hero",
      description: "Clean, text-focused with maximum breathing room",
      layoutSpec: "Centered text-only or with small supporting visual, lots of whitespace, elegant typography as the star, subtle animation on load",
      subVariations: [
        { name: "minimal-centered", spec: "Pure centered text with no imagery, icon above optional" },
        { name: "minimal-logo", spec: "Large logo/mark with tagline below" },
        { name: "minimal-line", spec: "Horizontal line dividers with stacked text blocks" }
      ],
      bestFor: ["legal", "finance", "healthcare", "professional services"]
    }
  };
  
  return archetypes[archetype] || archetypes.bold;
}

/**
 * Generate detailed guidance text for the AI prompt based on hero archetype
 */
function getHeroArchetypeGuidance(archetype: string): string {
  const detail = getDetailedHeroArchetype(archetype);
  const randomVariant = detail.subVariations[Math.floor(Math.random() * detail.subVariations.length)];
  
  return `
DETAILED HERO SPECIFICATIONS for "${archetype}" archetype:
- Style: ${detail.name} - ${detail.description}
- Layout spec: ${detail.layoutSpec}
- Recommended sub-variant: "${randomVariant.name}" - ${randomVariant.spec}
- Include heroVariant: "${randomVariant.name}" in your hero section data
- This archetype is ideal for: ${detail.bestFor.join(", ")}
`;
}

/**
 * Map industry to the best heroArchetype for maximum visual impact
 * This ensures every website gets a premium, jaw-dropping hero
 */
function getHeroArchetypeForIndustry(industry: string): { archetype: string; reason: string } {
  const lowerIndustry = industry.toLowerCase();
  
  // Cinematic - luxury, premium, high-end
  if (/luxury|premium|real estate|hotel|hospitality|resort|spa|jewelry|automotive|fashion/i.test(lowerIndustry)) {
    return { archetype: "cinematic", reason: "Dramatic full-screen with film-like transitions for premium brands" };
  }
  
  // Immersive - experience-based, events, hospitality
  if (/event|wedding|photography|travel|tourism|restaurant|food|dining|entertainment/i.test(lowerIndustry)) {
    return { archetype: "immersive", reason: "Full-screen image with centered overlay for experiential businesses" };
  }
  
  // Bold - startups, creative agencies, modern brands
  if (/startup|agency|creative|design|marketing|advertising|media|studio|innovation/i.test(lowerIndustry)) {
    return { archetype: "bold", reason: "Extra-large typography with floating gradients for statement brands" };
  }
  
  // Editorial - portfolios, personal brands, thought leaders
  if (/portfolio|personal|consulting|author|speaker|coach|influencer|creator/i.test(lowerIndustry)) {
    return { archetype: "editorial", reason: "Bold asymmetric layout with gradient text for personal brands" };
  }
  
  // Split - SaaS, tech, B2B, software (but NOT "professional services")
  if (/saas|software|tech|technology|app|platform|b2b|enterprise/i.test(lowerIndustry) && !/professional/i.test(lowerIndustry)) {
    return { archetype: "split", reason: "50/50 split with product showcase for software businesses" };
  }
  
  // Minimal - professional services, finance, legal, healthcare
  if (/legal|law|finance|banking|accounting|healthcare|medical|insurance|professional/i.test(lowerIndustry)) {
    return { archetype: "minimal", reason: "Clean, understated design for trust and professionalism" };
  }
  
  // Default to bold for maximum impact
  return { archetype: "bold", reason: "Statement design that commands attention" };
}

interface IndustryTemplate {
  context: string;
  suggestedColors: { primary: string; secondary: string; accent: string };
  suggestedStyle: string;
  keyFeatures: string[];
  testimonialFocus: string;
  heroArchetype: string;
}

function getIndustryTemplate(industry: string): IndustryTemplate {
  const heroInfo = getHeroArchetypeForIndustry(industry);
  
  const templates: Record<string, IndustryTemplate> = {
    "Technology": {
      context: `Focus on innovation, efficiency, and cutting-edge solutions. Emphasize scalability, security, and ROI. Use modern tech terminology. Testimonials should mention specific metrics and time savings.`,
      suggestedColors: { primary: "#3b82f6", secondary: "#1e40af", accent: "#06b6d4" },
      suggestedStyle: "tech",
      keyFeatures: ["API Integration", "99.9% Uptime", "Enterprise Security", "24/7 Support", "Scalable Infrastructure", "Real-time Analytics"],
      testimonialFocus: "efficiency gains, time saved, ROI improvements",
      heroArchetype: "split"
    },
    "SaaS": {
      context: `Focus on productivity gains, ease of use, and seamless integration. Emphasize free trials, quick onboarding, and customer success stories. Use benefit-driven feature descriptions.`,
      suggestedColors: { primary: "#6366f1", secondary: "#4f46e5", accent: "#22d3ee" },
      suggestedStyle: "modern",
      keyFeatures: ["Free Trial", "No Credit Card Required", "Cancel Anytime", "API Access", "Team Collaboration", "Custom Integrations"],
      testimonialFocus: "productivity improvements, ease of use, customer support quality",
      heroArchetype: "split"
    },
    "Healthcare": {
      context: `Prioritize trust, safety, and patient outcomes. Use empathetic language. Emphasize certifications, experience, and care quality. Include HIPAA compliance messaging where relevant.`,
      suggestedColors: { primary: "#0d9488", secondary: "#047857", accent: "#14b8a6" },
      suggestedStyle: "corporate",
      keyFeatures: ["Board Certified", "HIPAA Compliant", "Patient-Centered Care", "Evidence-Based Treatment", "Compassionate Staff", "Modern Facilities"],
      testimonialFocus: "care quality, staff compassion, treatment outcomes",
      heroArchetype: "minimal"
    },
    "Restaurant": {
      context: `Appeal to senses and experiences. Use vivid, appetizing descriptions. Emphasize quality ingredients, atmosphere, and memorable dining experiences. Include menu highlights.`,
      suggestedColors: { primary: "#ea580c", secondary: "#c2410c", accent: "#f59e0b" },
      suggestedStyle: "elegant",
      keyFeatures: ["Fresh Ingredients", "Award-Winning Chef", "Cozy Atmosphere", "Private Dining", "Seasonal Menu", "Local Sourcing"],
      testimonialFocus: "food quality, atmosphere, memorable experiences",
      heroArchetype: "immersive"
    },
    "Food & Beverage": {
      context: `Appeal to senses and experiences. Use vivid, appetizing descriptions. Emphasize quality ingredients, atmosphere, and memorable dining experiences. Include menu highlights.`,
      suggestedColors: { primary: "#ea580c", secondary: "#c2410c", accent: "#f59e0b" },
      suggestedStyle: "elegant",
      keyFeatures: ["Fresh Ingredients", "Artisan Quality", "Cozy Atmosphere", "Special Events", "Seasonal Offerings", "Local Sourcing"],
      testimonialFocus: "food quality, atmosphere, memorable experiences",
      heroArchetype: "immersive"
    },
    "E-commerce": {
      context: `Focus on product quality, fast shipping, and customer satisfaction. Emphasize secure checkout, easy returns, and product variety. Use trust signals prominently.`,
      suggestedColors: { primary: "#8b5cf6", secondary: "#7c3aed", accent: "#f472b6" },
      suggestedStyle: "modern",
      keyFeatures: ["Free Shipping", "Easy Returns", "Secure Checkout", "24/7 Support", "Quality Guarantee", "Fast Delivery"],
      testimonialFocus: "product quality, shipping speed, customer service",
      heroArchetype: "bold"
    },
    "Consulting": {
      context: `Convey expertise, results, and strategic thinking. Use authoritative language. Emphasize case studies, methodology, and measurable outcomes.`,
      suggestedColors: { primary: "#1e3a8a", secondary: "#1e40af", accent: "#ca8a04" },
      suggestedStyle: "corporate",
      keyFeatures: ["Proven Methodology", "Fortune 500 Clients", "Measurable Results", "Industry Expertise", "Custom Solutions", "Executive Team"],
      testimonialFocus: "ROI delivered, strategic insights, business transformation",
      heroArchetype: "editorial"
    },
    "Finance": {
      context: `Convey stability, expertise, and trustworthiness. Use precise language. Emphasize security, returns, and regulatory compliance. Include fiduciary responsibility messaging.`,
      suggestedColors: { primary: "#166534", secondary: "#14532d", accent: "#ca8a04" },
      suggestedStyle: "corporate",
      keyFeatures: ["Fiduciary Duty", "SEC Registered", "Transparent Fees", "Personalized Plans", "Market Expertise", "Secure Transactions"],
      testimonialFocus: "trust, performance, personalized service",
      heroArchetype: "minimal"
    },
    "Real Estate": {
      context: `Focus on dreams, investment potential, and local expertise. Use aspirational language. Emphasize market knowledge, negotiation skills, and client success stories.`,
      suggestedColors: { primary: "#1e3a8a", secondary: "#1e40af", accent: "#ca8a04" },
      suggestedStyle: "elegant",
      keyFeatures: ["Local Market Expert", "Top Producer", "Virtual Tours", "Negotiation Skills", "Client-First Approach", "Investment Guidance"],
      testimonialFocus: "smooth transactions, market knowledge, finding dream homes",
      heroArchetype: "cinematic"
    },
    "Fitness": {
      context: `Inspire action and transformation. Use motivational language. Emphasize results, expertise, and community. Include transformation stories.`,
      suggestedColors: { primary: "#dc2626", secondary: "#b91c1c", accent: "#f59e0b" },
      suggestedStyle: "bold",
      keyFeatures: ["Personal Training", "Group Classes", "Nutrition Coaching", "Results Guaranteed", "Flexible Hours", "Community Support"],
      testimonialFocus: "transformation results, trainer expertise, community atmosphere",
      heroArchetype: "bold"
    },
    "Legal": {
      context: `Convey authority, experience, and client advocacy. Use professional language. Emphasize track record, expertise areas, and client confidentiality.`,
      suggestedColors: { primary: "#1e3a5a", secondary: "#0f172a", accent: "#b45309" },
      suggestedStyle: "corporate",
      keyFeatures: ["Free Consultation", "Experienced Attorneys", "Track Record", "Confidentiality", "Client Advocacy", "Results-Oriented"],
      testimonialFocus: "case outcomes, attorney expertise, client communication",
      heroArchetype: "minimal"
    },
    "Entertainment": {
      context: `Create excitement and energy. Use vibrant, engaging language. Emphasize experiences, memories, and fun. Include event highlights and entertainment options.`,
      suggestedColors: { primary: "#7c3aed", secondary: "#5b21b6", accent: "#f472b6" },
      suggestedStyle: "bold",
      keyFeatures: ["Unique Experiences", "Live Entertainment", "Special Events", "VIP Options", "Family-Friendly", "Memorable Moments"],
      testimonialFocus: "entertainment quality, memorable experiences, value",
      heroArchetype: "cinematic"
    },
    "Agency": {
      context: `Showcase creativity and results. Use bold, confident language. Emphasize portfolio, methodology, and client success. Include case study highlights.`,
      suggestedColors: { primary: "#0f172a", secondary: "#1e293b", accent: "#f97316" },
      suggestedStyle: "creative",
      keyFeatures: ["Award-Winning Work", "Strategic Approach", "Full-Service", "Results-Driven", "Creative Excellence", "Collaborative Process"],
      testimonialFocus: "creative impact, business results, collaboration quality",
      heroArchetype: "bold"
    }
  };
  
  const template = templates[industry];
  if (template) return template;
  
  // Return default with dynamically selected heroArchetype
  return {
    context: `Focus on professionalism, quality, and customer satisfaction. Use clear, benefit-driven language. Emphasize experience, reliability, and results.`,
    suggestedColors: { primary: "#3b82f6", secondary: "#1e40af", accent: "#10b981" },
    suggestedStyle: "modern",
    keyFeatures: ["Quality Service", "Expert Team", "Customer First", "Proven Results", "Reliable Support", "Best Value"],
    testimonialFocus: "quality, reliability, customer satisfaction",
    heroArchetype: heroInfo.archetype
  };
}

function getIndustryContext(industry: string): { context: string; heroArchetype: string; colors: { primary: string; secondary: string; accent: string } } {
  const template = getIndustryTemplate(industry);
  return {
    context: `${template.context}
- Suggested feature themes: ${template.keyFeatures.join(", ")}
- Testimonial focus: ${template.testimonialFocus}`,
    heroArchetype: template.heroArchetype,
    colors: template.suggestedColors
  };
}

export const openaiConnector = defineConnector({
  key: "openai",
  name: "GPT-4o (OpenAI)",
  description: "Premium AI generation powered by GPT-4o for names, brands, and website content",
  category: "ai",
  capabilities: ["name_generation", "brand_generation", "content_generation", "text_generation", "image_generation"],
  authType: "apiKey",
  requiredEnvVars: ["OPENAI_API_KEY"],

  isConfigured() {
    return !!process.env.OPENAI_API_KEY;
  },

  async test() {
    if (!this.isConfigured()) {
      return { ok: false, message: "OpenAI API not configured" };
    }
    try {
      const client = getClient();
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: "Say 'ok'" }],
        max_completion_tokens: 10,
      });
      return { ok: true, message: "OpenAI connection successful" };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Connection failed",
      };
    }
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const client = getClient();

    switch (task.action) {
      case "generate_names": {
        const input = task.input as {
          businessIdea: string;
          industry?: string;
          tone?: string;
          baseName?: string;
          count?: number;
        };
        
        const baseNameContext = input.baseName 
          ? `The user has named their business "${input.baseName}". Generate creative variations and similar-sounding alternatives.`
          : "";
        
        const prompt = `Generate ${input.count || 15} creative, memorable business names for:
Business idea: ${input.businessIdea}
${input.industry ? `Industry: ${input.industry}` : ""}
${input.tone ? `Brand tone: ${input.tone}` : ""}
${baseNameContext}

Requirements:
- Names should be unique, brandable, and easy to spell
- Include variations of the base name if provided
- Suitable for domain registration (short, no special characters)
- Modern and professional

Return a JSON object with a "names" array containing the business name strings.
Example: {"names": ["BrandName1", "BrandName2"]}`;

        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        
        let names: string[] = [];
        try {
          const parsed = JSON.parse(content);
          names = parsed.names || parsed.suggestions || parsed.businessNames || [];
          if (!Array.isArray(names)) {
            names = Object.values(parsed).find(v => Array.isArray(v)) as string[] || [];
          }
        } catch (parseError) {
          console.error("[OpenAI] Failed to parse JSON response:", content);
          throw new Error("Failed to parse AI response");
        }

        return {
          success: true,
          data: names as O,
          provider: "openai",
        };
      }

      case "generate_brand_kit": {
        const input = task.input as {
          businessName: string;
          businessIdea: string;
          industry?: string;
          tone?: string;
          targetAudience?: string;
        };

        const prompt = `Create a brand kit for:
Business: ${input.businessName}
Idea: ${input.businessIdea}
${input.industry ? `Industry: ${input.industry}` : ""}
${input.tone ? `Desired tone: ${input.tone}` : ""}

Return a JSON object with these fields:
- brandVoice: string (2-3 sentences about brand personality)
- taglines: array of 5 short taglines
- colorPalette: array of {name, hex, usage} objects for 5 colors
- fontPairings: array with one {heading, body} object using Google Font names
- messagingPillars: array of 3 {title, description} objects
- elevatorPitch: string (2-3 sentence pitch)`;

        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        
        let brandKit: Record<string, unknown> = {};
        try {
          brandKit = JSON.parse(content);
        } catch (parseError) {
          console.error("[OpenAI] Failed to parse brand kit JSON:", content);
          throw new Error("Failed to parse AI response for brand kit");
        }

        return {
          success: true,
          data: brandKit as O,
          provider: "openai",
        };
      }

      case "generate_website_content": {
        const input = task.input as {
          businessName: string;
          businessIdea: string;
          industry?: string;
          tone?: string;
          brandVoice?: string;
          pages?: string[];
          targetAudience?: string;
          location?: string;
          designStyle?: string;
          businessProfile?: {
            businessName?: string;
            tagline?: string;
            yearsInBusiness?: number;
            teamSize?: string;
            services?: { name: string; description?: string; price?: string }[];
            uniqueSellingPoints?: string[];
            competitiveAdvantages?: string[];
            customerPainPoints?: string[];
            targetAudience?: string;
            contactInfo?: { email?: string; phone?: string; address?: string };
            socialLinks?: Record<string, string>;
            businessHours?: Record<string, string>;
            websiteGoals?: { 
              primaryPurpose?: string; 
              primaryCta?: string; 
              secondaryCta?: string;
            };
            brandPreferences?: { visualStyle?: string };
            communicationTone?: string;
            founderStory?: string;
            certifications?: string[];
            awards?: string[];
            preferredContactMethod?: string;
            responseTime?: string;
          };
        };

        const profile = input.businessProfile;
        const pageList = input.pages || ["home", "about", "services", "contact"];
        const tone = profile?.communicationTone || input.tone || "professional";
        const industry = input.industry || "business";
        const designStyle = profile?.brandPreferences?.visualStyle || input.designStyle || "modern";

        const industryContext = getIndustryContext(industry);
        const styleVariant = getStyleVariant(designStyle);
        
        console.log(`[OpenAI] Website generation for industry="${industry}", heroArchetype="${industryContext.heroArchetype}"`);
        console.log(`[OpenAI] Style: ${designStyle}, Tone: ${tone}`);

        const prompt = `You are an elite conversion copywriter who has written for Apple, Stripe, Airbnb, and Linear. Create an EXCEPTIONAL, award-winning website that would impress Awwwards judges.

CRITICAL QUALITY REQUIREMENTS - READ CAREFULLY:
Your output will be scored by an AI quality evaluator. To score 85+, you MUST:

1. NEVER use these generic phrases (automatic FAILURE if used):
   - "Welcome to" (ANY variation - "Welcome to our", "Welcome to [name]", etc.)
   - "Start your journey" / "Begin your journey" / "Embark on"
   - "Your trusted partner" / "Your one-stop solution" / "Your go-to"
   - "Best in class" / "Industry-leading" / "World-class" / "Top-tier"
   - "We are passionate about..." / "We pride ourselves on..."
   - "Quality service guaranteed" / "Excellence is our priority"
   - "Lorem ipsum" or any placeholder text
   - ANY brackets like [Your Name], [Insert Here], [Company], {placeholder}
   - "Contact us today" / "Get in touch" (use specific, benefit-driven CTAs instead)
   - "Discover" / "Explore" / "Experience" as the first word of headlines
   - "Solutions for all your needs" / "All your [X] needs"
   - "Learn more" / "Click here" / "Find out more"
   
AUTOMATIC FAILURE: If ANY of the above phrases appear in your output, the quality score will be 0.
   
2. ALWAYS include specificity:
   - Use real numbers: "Save 12 hours per week" not "Save time"
   - Include timeframes: "Results in 48 hours" not "Fast results"
   - Name outcomes: "Increase conversions by 34%" not "Improve performance"
   - Be concrete: "Works with Salesforce, HubSpot, and 50+ tools" not "Integrates with your tools"

3. Testimonials must feel REAL:
   - Include specific details only a real customer would know
   - Mention exact outcomes: "$47,000 saved in Q3" not "saved money"
   - Use natural speech patterns, not marketing-speak
   - Reference specific features or experiences

4. Headlines must be UNIQUE to this business:
   - Reference the specific industry, service, or outcome
   - Never use generic phrases that could apply to any business
   - Create curiosity or make a bold promise

Your copy must be:
- Magnetic: Headlines that stop scrolling and create instant desire
- Concise: Every word earns its place. No fluff, no clichés, no "leverage synergies"
- Benefit-obsessed: Focus on transformation, not features
- Emotionally resonant: Connect with deep human needs (status, belonging, safety, growth)
- Specific: Use concrete numbers, timeframes, and outcomes

BUSINESS PROFILE:
- Name: ${profile?.businessName || input.businessName}
- Tagline: ${profile?.tagline || ""}
- Core Offering: ${input.businessIdea}
- Industry: ${industry}
- Target Audience: ${input.targetAudience || profile?.targetAudience || "discerning professionals and businesses"}
- Location: ${input.location || "United States"}
- Brand Tone: ${tone}
${input.brandVoice ? `- Brand Voice: ${input.brandVoice}` : ""}
${profile?.yearsInBusiness ? `- Years in Business: ${profile.yearsInBusiness}` : ""}
${profile?.teamSize ? `- Team Size: ${profile.teamSize}` : ""}

${profile?.services && profile.services.length > 0 ? `ACTUAL SERVICES/PRODUCTS TO FEATURE (use these real names and descriptions):
${profile.services.map((s, i) => `${i + 1}. ${s.name}${s.description ? ` - ${s.description}` : ""}${s.price ? ` (${s.price})` : ""}`).join("\n")}` : ""}

${profile?.uniqueSellingPoints && profile.uniqueSellingPoints.length > 0 ? `UNIQUE SELLING POINTS (incorporate these into features/benefits):
${profile.uniqueSellingPoints.map(u => `- ${u}`).join("\n")}` : ""}

${profile?.customerPainPoints && profile.customerPainPoints.length > 0 ? `CUSTOMER PAIN POINTS TO ADDRESS (use in testimonials & copy):
${profile.customerPainPoints.map(p => `- ${p}`).join("\n")}` : ""}

${profile?.certifications?.length || profile?.awards?.length ? `CREDIBILITY SIGNALS:
${profile?.certifications?.map(c => `- Certification: ${c}`).join("\n") || ""}
${profile?.awards?.map(a => `- Award: ${a}`).join("\n") || ""}` : ""}

CONTACT & COMMUNICATION:
${profile?.contactInfo?.email ? `- Email: ${profile.contactInfo.email}` : ""}
${profile?.contactInfo?.phone ? `- Phone: ${profile.contactInfo.phone}` : ""}
${profile?.contactInfo?.address ? `- Address: ${profile.contactInfo.address}` : ""}
${profile?.preferredContactMethod ? `- Preferred Contact: ${profile.preferredContactMethod}` : ""}
${profile?.responseTime ? `- Response Time: ${profile.responseTime}` : ""}

${profile?.websiteGoals ? `WEBSITE GOALS:
- Primary Purpose: ${profile.websiteGoals.primaryPurpose || "generate leads"}
- Primary CTA Text: ${profile.websiteGoals.primaryCta || "Get Started"}
- Secondary CTA Text: ${profile.websiteGoals.secondaryCta || "Learn More"}
IMPORTANT: Use "${profile.websiteGoals.primaryCta || "Get Started"}" as the primary CTA button text throughout the site.` : ""}

${profile?.socialLinks ? `SOCIAL LINKS (include in footer):
${Object.entries(profile.socialLinks).filter(([_, v]) => v).map(([k, v]) => `- ${k}: ${v}`).join("\n")}` : ""}

${profile?.founderStory ? `FOUNDER STORY (use in About page):
${profile.founderStory}` : ""}

DESIGN STYLE: ${designStyle.toUpperCase()}
${styleVariant.description}
- Use ${styleVariant.fonts.heading} for headings and ${styleVariant.fonts.body} for body text

INDUSTRY-SPECIFIC GUIDANCE:
${industryContext.context}

MANDATORY HERO ARCHETYPE: "${industryContext.heroArchetype}"
You MUST use heroArchetype: "${industryContext.heroArchetype}" for ALL hero sections on this website.
This is not optional - it was specifically selected for this ${industry} business to create maximum visual impact.

${getHeroArchetypeGuidance(industryContext.heroArchetype)}

PREMIUM VISUAL STYLE:
${styleVariant.gradientStyle ? `- Gradient style: ${styleVariant.gradientStyle}` : ""}
${styleVariant.visualSignatures ? `- Visual signatures to incorporate: ${styleVariant.visualSignatures.join(", ")}` : ""}

RECOMMENDED COLORS (based on ${industry}):
- Primary: ${industryContext.colors.primary}
- Secondary: ${industryContext.colors.secondary}
- Accent: ${industryContext.colors.accent}

PAGES TO CREATE: ${pageList.join(", ")}

LAYOUT VARIATION RULES (CRITICAL for premium feel):
1. NEVER use the same section layout back-to-back
2. Alternate between: full-width → grid → editorial → split → centered
3. Every 3rd section should have a different background treatment (gradient, image, solid color)
4. Insert "breathing room" sections (stats, quotes, dividers) between dense content blocks
5. Vary content alignment: left → centered → right → left (no repetition)
6. Mix text-heavy and visual-heavy sections for rhythm

SECTION BACKGROUND PATTERNS (assign variety):
- "default" - standard white/light background
- "muted" - subtle gray/off-white
- "accent" - uses primary brand color (sparingly, 1-2 per page max)
- "dark" - dark background with light text (for impact sections)
- "gradient" - gradient background for premium feel
- "image" - background image with overlay

AVAILABLE SECTION TYPES (use variety - never repeat the same layout twice in a row):

HERO & OPENERS:
- "hero": {headline, subheadline, statement, ctaText, ctaLink, secondaryCtaText, badge, heroArchetype, heroVariant} - Powerful opening
  - CRITICAL: You MUST set heroArchetype to "${industryContext.heroArchetype}" for all hero sections
  - heroArchetype "${industryContext.heroArchetype}" was specifically chosen for ${industry} businesses
  - heroVariant: sub-variation for uniqueness (see archetype details above)
  - statement: 1-2 sentence powerful value proposition (required for cinematic, immersive, bold)
  - badge: Short text like "Award Winning" or "Est. 2010" (recommended for premium feel)

CONTENT & STORY:
- "text": {headline, content, alignment} - Story and context (use sparingly, 1 paragraph max)
- "story": {headline, subheadline, paragraphs:[], quote, quoteAuthor, stats:[{value, label}], layout:"editorial"} - Brand narrative, origin story
- "brand-story": {headline, subheadline, founderName, founderRole, founderImage, origin, mission, vision, values:[]} - Founder/brand origin with personality

FEATURES & BENEFITS:
- "features": {headline, subheadline, items:[{title, description, icon}], layout:"grid"} - Value propositions (6 items, varied icons)
  - Icons: star, shield, zap, heart, target, users, clock, check, award, globe, briefcase, settings, wrench, lightbulb, rocket, sparkles, trophy, crown, gem, flame
  - layout: "grid" (default), "staggered", "alternating"
- "benefits": {headline, subheadline, items:[{title, description, icon, stat, statLabel}]} - Outcome-focused with optional stats
- "services": {headline, subheadline, items:[{title, description, icon, price, features:[]}]} - Detailed offerings with benefits

SOCIAL PROOF & TRUST:
- "testimonials": {headline, subheadline, items:[{quote, author, role, company, avatar, rating}], layout:"cards"} - Social proof
  - layout: "cards" (default), "carousel", "featured", "minimal"
- "stats": {headline, items:[{value, label, suffix, prefix}]} - Credibility numbers (4-6 items)
- "trust-signals": {headline, logos:[{name, category}], awards:[], certifications:[], partners:[]} - Logos, awards, certifications
- "case-studies": {headline, subheadline, items:[{title, client, challenge, solution, results:[{metric, value}], quote}]} - Detailed results

PROCESS & COMPARISON:
- "process": {headline, subheadline, steps:[{number, title, description, icon}]} - How it works (3-5 steps)
- "comparison": {headline, subheadline, you:{name, features:[]}, competitors:[{name, features:[]}]} - Why you vs alternatives
- "pricing": {headline, subheadline, plans:[{name, price, period, description, features:[], highlighted, ctaText}]} - Clear value tiers

ENGAGEMENT:
- "faq": {headline, subheadline, items:[{question, answer}]} - Objection handling (6-8 items)
- "cta": {headline, subheadline, buttonText, buttonLink, secondaryText} - Conversion driver
- "contact": {headline, subheadline, email, phone, address, showForm:true}
- "team": {headline, subheadline, members:[{name, role, bio, image}]} - Humanize the brand
- "gallery": {headline, subheadline, items:[{image, caption, category}], layout:"masonry"} - Visual showcase

PAGE BLUEPRINTS (LONG-FORM, PREMIUM AGENCY-LEVEL):

CRITICAL: Modern premium websites are NOT short. They include storytelling, credibility, proof, and depth.
Every page must feel COMPLETE and TRUSTWORTHY. Minimum 8 sections per page (except Contact).

1. HOME (10-12 sections): 
   hero → text (bold value proposition statement, 1 paragraph) → features (6 items with varied icons) → 
   story (brand origin, "why we exist" - editorial layout) → stats (4-6 impressive numbers) → 
   services (4 highlighted with benefits) → process (3-5 steps "how it works") → 
   testimonials (3-4 diverse, compelling stories) → benefits (4-6 outcome-focused) → 
   trust-signals (logos, awards, certifications) → cta (strong final conversion)

2. ABOUT (8-10 sections):
   hero → brand-story (founder story with emotion and personality) → text (mission, vision - aspirational) →
   team (4-6 members with personality and unexpected details) → stats (credibility numbers) → 
   process (how you work differently) → testimonials (2-3 personal endorsements) → 
   benefits (why clients choose you) → cta

3. SERVICES (8-10 sections):
   hero → text (service philosophy, what makes you different) → services (6+ comprehensive offerings) → 
   process (how engagements work) → case-studies (2-3 results with specific outcomes) →
   pricing (3 clear tiers if applicable) → comparison (why you vs alternatives) →
   faq (6-8 objection-handlers) → testimonials (service-specific) → cta

4. CONTACT (5-6 sections):
   hero → text (what to expect, response commitment) → contact (with form) → 
   faq (common questions about getting started) → trust-signals → cta

LAYOUT SOPHISTICATION RULES:
- NEVER use hero + 3 cards + hero + 3 cards repetition
- Alternate between: grid layouts, editorial text blocks, full-width moments, split compositions
- Add "breathing room" sections (stats, quotes, trust-signals) between dense content
- Every 3rd section should feel visually different (different background, different layout)

COPYWRITING MASTERY REQUIREMENTS:

HEADLINES (the most important element):
- Pattern: [Outcome] + [Timeframe/Method] OR [Provocative question]
- GOOD: "Build websites 10x faster. Ship today, not next month."
- GOOD: "What if your CRM actually helped you close?"
- BAD: "Welcome to Our Company" or "About Our Services"
- Every headline must create curiosity or promise clear value

SUBHEADLINES:
- 1-2 sentences that expand on the headline with specifics
- Include a number, timeframe, or concrete benefit
- Build desire and reduce friction

FEATURES & SERVICES:
- Title = Benefit statement, not feature name ("Save 10 hours weekly" not "Automation")
- Description = 25-40 words explaining the transformation and outcome
- Each item tells a mini story of before → after

TESTIMONIALS (crucial for trust):
- Write as REAL people speak - natural, not corporate
- Include specific outcomes: numbers, timeframes, emotions
- 40-60 words per quote
- Use diverse, realistic names from different backgrounds
- Each testimonial should address a different objection

TEAM BIOS:
- Lead with their superpower or unique approach
- Include one unexpected personal detail
- 30-40 words that make them memorable

FAQ:
- Questions should mirror actual customer concerns and objections
- Answers: 50-80 words, reassuring and specific
- End each answer on a confident, forward-looking note

CTAs:
- First-person: "Start My Free Trial" not "Start Free Trial"
- Specific: "Book My 15-Minute Strategy Call" not "Contact Us"
- Create urgency without being sleazy

STATS:
- Believable but impressive numbers with context
- Include timeframes: "10,000+ customers served since 2019"
- Use social proof: "Trusted by teams at Google, Stripe, and Notion"

COLOR PSYCHOLOGY (choose based on ${industry}):
- Professional services: Deep blues (#1e40af), slate grays, gold accents
- Healthcare/Wellness: Calming teals (#0d9488), soft greens, warm neutrals
- Technology: Electric blues (#3b82f6), vibrant purples, modern gradients
- Creative/Agency: Bold primaries, unexpected combinations
- Finance: Navy (#1e3a5a), forest green (#166534), gold
- Food/Restaurant: Warm oranges (#ea580c), rich reds, earthy tones
- Real Estate: Sophisticated navy (#1e3a8a), gold (#ca8a04), warm grays

FINAL CRITICAL REMINDER - HERO ARCHETYPE:
Your hero sections MUST use heroArchetype: "${industryContext.heroArchetype}"
This is mandatory. Using any other archetype will fail quality validation.
For ${industry}, the correct archetype is "${industryContext.heroArchetype}".

HERO SECTION EXAMPLE (you MUST follow this format):
{
  "id": "hero-home",
  "type": "hero",
  "data": {
    "headline": "Your compelling headline",
    "subheadline": "Supporting text",
    "statement": "Value proposition",
    "ctaText": "Primary CTA",
    "heroArchetype": "${industryContext.heroArchetype}",
    "badge": "Award Winning"
  }
}

JSON STRUCTURE (follow exactly):
{
  "pages": [
    {
      "slug": "home",
      "title": "Compelling Page Title | ${input.businessName}",
      "metaDescription": "SEO-optimized description with keywords, 150-160 chars",
      "sections": [
        {"id": "unique-id", "type": "section-type", "data": {...}}
      ]
    }
  ],
  "globalContent": {
    "siteName": "${input.businessName}",
    "tagline": "Memorable 5-8 word value proposition",
    "navigation": [
      {"label": "Home", "href": "/"},
      {"label": "About", "href": "/about"},
      {"label": "Services", "href": "/services"},
      {"label": "Contact", "href": "/contact"}
    ],
    "footer": {
      "copyright": "© 2024 ${input.businessName}. All rights reserved.",
      "links": [{"label": "Privacy Policy", "href": "/privacy"}, {"label": "Terms of Service", "href": "/terms"}],
      "socialLinks": [{"platform": "twitter", "url": "#"}, {"platform": "linkedin", "url": "#"}, {"platform": "facebook", "url": "#"}]
    }
  },
  "siteSettings": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "style": "${designStyle}",
    "fontFamily": "${styleVariant.fonts.body}",
    "headingFont": "${styleVariant.fonts.heading}"
  },
  "seo": {
    "title": "SEO-optimized title for search engines (50-60 chars)",
    "description": "Compelling meta description with primary keywords (150-160 chars)",
    "keywords": ["keyword1", "keyword2", "keyword3", "industry-term", "location-term"],
    "ogType": "website"
  }
}`;

        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 12000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        
        let websiteContent: Record<string, unknown> = {};
        try {
          websiteContent = JSON.parse(content);
        } catch (parseError) {
          console.error("[OpenAI] Failed to parse website content JSON:", content);
          throw new Error("Failed to parse AI response for website content");
        }

        return {
          success: true,
          data: websiteContent as O,
          provider: "openai",
        };
      }

      case "generate_graphics_briefs": {
        const input = task.input as {
          businessName: string;
          businessIdea: string;
          brandColors?: string[];
          types?: string[];
        };

        const types = input.types || ["instagram_post", "facebook_ad"];

        const prompt = `Create design briefs for marketing graphics for ${input.businessName}.
Business idea: ${input.businessIdea}
Create 2-3 briefs for these types: ${types.join(", ")}

Return JSON with "graphics" array. Each item has: type, name, dimensions, designBrief (object with prompt, style, colors array, mood), copyText.`;

        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        
        let graphics: Record<string, unknown> = {};
        try {
          graphics = JSON.parse(content);
        } catch (parseError) {
          console.error("[OpenAI] Failed to parse graphics briefs JSON:", content);
          throw new Error("Failed to parse AI response for graphics briefs");
        }

        return {
          success: true,
          data: graphics as O,
          provider: "openai",
        };
      }

      case "generate_image": {
        const input = task.input as {
          prompt: string;
          size?: "1024x1024" | "1536x1024" | "1024x1536";
          style?: "vivid" | "natural";
          quality?: "standard" | "hd";
        };

        console.log("[OpenAI] Generating image with prompt:", input.prompt.substring(0, 100) + "...");

        try {
          const imageResponse = await client.images.generate({
            model: "gpt-image-1",
            prompt: input.prompt,
            n: 1,
            size: input.size || "1024x1024",
          });

          const imageData = imageResponse.data?.[0];
          
          if (!imageData) {
            return {
              success: false,
              error: "No image data returned from API",
              provider: "openai",
            };
          }

          return {
            success: true,
            data: {
              b64_json: imageData.b64_json,
              url: imageData.url,
              revised_prompt: imageData.revised_prompt,
            } as O,
            provider: "openai",
          };
        } catch (error) {
          console.error("[OpenAI] Image generation failed:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Image generation failed",
            provider: "openai",
          };
        }
      }

      case "generate_hero_image": {
        const input = task.input as {
          businessName: string;
          businessIdea: string;
          industry?: string;
          brandColors?: { primary: string; secondary?: string };
          style?: string;
        };

        const styleGuidance = input.style 
          ? getStyleVariant(input.style).description 
          : "modern, professional aesthetic";

        const heroPrompt = `Create a stunning hero background image for a ${input.industry || "business"} website.

Business: ${input.businessName}
Concept: ${input.businessIdea}
Design style: ${styleGuidance}

Requirements:
- Professional, high-quality imagery suitable for a hero section
- Abstract or conceptual design that evokes the business essence
- Should work as a background with text overlay
- Colors should complement: ${input.brandColors?.primary || "blue tones"}
- No text, logos, or faces
- Clean, modern aesthetic
- Subtle gradients or abstract patterns preferred
- Should convey trust, professionalism, and innovation`;

        console.log("[OpenAI] Generating hero image for:", input.businessName);

        try {
          const imageResponse = await client.images.generate({
            model: "gpt-image-1",
            prompt: heroPrompt,
            n: 1,
            size: "1536x1024",
          });

          const imageData = imageResponse.data?.[0];
          
          if (!imageData) {
            return {
              success: false,
              error: "No hero image data returned from API",
              provider: "openai",
            };
          }

          return {
            success: true,
            data: {
              b64_json: imageData.b64_json,
              url: imageData.url,
              revised_prompt: imageData.revised_prompt,
              type: "hero",
            } as O,
            provider: "openai",
          };
        } catch (error) {
          console.error("[OpenAI] Hero image generation failed:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Hero image generation failed",
            provider: "openai",
          };
        }
      }

      case "generate_logo": {
        const input = task.input as {
          businessName: string;
          industry?: string;
          style?: string;
          brandColors?: { primary: string; secondary?: string; accent?: string };
        };

        const logoPrompt = `Create a minimalist, professional logo icon for "${input.businessName}".

Industry: ${input.industry || "general business"}
Style: ${input.style || "modern, clean, minimal"}

Requirements:
- Simple, iconic design that works at any size
- Single color or limited palette using: ${input.brandColors?.primary || "#3b82f6"}
- No text - icon/symbol only
- Geometric or abstract shapes
- Professional and memorable
- Suitable for favicon, app icon, and social media
- Clean white or transparent-looking background
- Should evoke trust and professionalism`;

        console.log("[OpenAI] Generating logo for:", input.businessName);

        try {
          const imageResponse = await client.images.generate({
            model: "gpt-image-1",
            prompt: logoPrompt,
            n: 1,
            size: "1024x1024",
          });

          const imageData = imageResponse.data?.[0];
          
          if (!imageData) {
            return {
              success: false,
              error: "No logo data returned from API",
              provider: "openai",
            };
          }

          return {
            success: true,
            data: {
              b64_json: imageData.b64_json,
              url: imageData.url,
              revised_prompt: imageData.revised_prompt,
              type: "logo",
            } as O,
            provider: "openai",
          };
        } catch (error) {
          console.error("[OpenAI] Logo generation failed:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Logo generation failed",
            provider: "openai",
          };
        }
      }

      case "refine_section": {
        const input = task.input as {
          section: { id: string; type: string; data: Record<string, unknown> };
          instruction: string;
          businessContext: {
            businessName: string;
            industry?: string;
            tone?: string;
            brandVoice?: string;
          };
        };

        const sectionTypeGuidance = getSectionTypeGuidance(input.section.type);

        const prompt = `You are an elite website copywriter and UX designer. Refine this website section based on the user's instruction.

BUSINESS CONTEXT:
- Business: ${input.businessContext.businessName}
- Industry: ${input.businessContext.industry || "General"}
- Tone: ${input.businessContext.tone || "Professional"}
- Brand Voice: ${input.businessContext.brandVoice || "Professional and approachable"}

CURRENT SECTION (type: ${input.section.type}):
${JSON.stringify(input.section.data, null, 2)}

USER'S INSTRUCTION:
"${input.instruction}"

${sectionTypeGuidance}

IMPORTANT:
- Apply the user's instruction while maintaining brand consistency
- Keep the same section structure and data format
- Improve the content quality based on the instruction
- Make it feel premium, authentic, and conversion-focused
- Return the refined section data in the exact same JSON format

Return ONLY the refined section data as valid JSON (same structure as the current section data).`;

        try {
          const response = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            max_completion_tokens: 4000,
          });

          const content = response.choices[0]?.message?.content || "{}";
          
          let refinedData: Record<string, unknown> = {};
          try {
            refinedData = JSON.parse(content);
          } catch (parseError) {
            console.error("[OpenAI] Failed to parse refined section JSON:", content);
            throw new Error("Failed to parse AI response for section refinement");
          }

          return {
            success: true,
            data: {
              id: input.section.id,
              type: input.section.type,
              data: refinedData,
            } as O,
            provider: "openai",
          };
        } catch (error) {
          console.error("[OpenAI] Section refinement failed:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Section refinement failed",
            provider: "openai",
          };
        }
      }

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "openai",
        };
    }
  },
});

function getSectionTypeGuidance(sectionType: string): string {
  const guidance: Record<string, string> = {
    hero: `HERO SECTION GUIDANCE:
- Headline: 4-8 words, powerful and benefit-focused
- Subheadline: Expand on the value, create urgency
- CTA: First-person, action-oriented
- Badge: Short, attention-grabbing`,
    
    features: `FEATURES SECTION GUIDANCE:
- Each feature title: 3-5 words
- Each feature description: 20-40 words, benefit-focused
- Focus on outcomes, not just features`,
    
    testimonials: `TESTIMONIALS GUIDANCE:
- Write as real people speak - natural, not corporate
- Include specific outcomes: numbers, timeframes, emotions
- 40-60 words per quote
- Each testimonial should address a different objection`,
    
    pricing: `PRICING GUIDANCE:
- Clear tier differentiation
- Feature lists that justify price differences
- Highlight most popular option
- Use psychological pricing`,
    
    process: `PROCESS GUIDANCE:
- 3-5 clear steps
- Each step: short title + descriptive explanation
- Show progression and outcomes`,
    
    cta: `CTA SECTION GUIDANCE:
- Headline: Create urgency and desire
- First-person CTA: "Start My..." not "Start Your..."
- Include trust signals or guarantees`,
    
    services: `SERVICES GUIDANCE:
- Each service: clear title + benefit-focused description
- 40-60 words per service description
- Include what makes each service unique`,
    
    team: `TEAM GUIDANCE:
- Lead with their superpower or unique approach
- Include one unexpected personal detail
- 30-40 words that make them memorable`,
    
    faq: `FAQ GUIDANCE:
- Questions should mirror actual customer concerns
- Answers: 50-80 words, reassuring and specific
- End each answer on a confident note`,
    
    stats: `STATS GUIDANCE:
- Believable but impressive numbers
- Include timeframes for context
- Use social proof where appropriate`,
  };
  
  return guidance[sectionType] || "Improve the content to be more compelling, specific, and conversion-focused.";
}
