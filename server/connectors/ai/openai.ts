import OpenAI from "openai";
import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

/**
 * OpenAI Connector (via Replit AI Integrations)
 * 
 * Provides: name_generation, brand_generation, content_generation, text_generation
 * 
 * Uses Replit AI Integrations which provides OpenAI-compatible API access
 * without requiring user's own API key.
 */

function getClient() {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "",
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function getStyleVariant(style: string): { description: string; fonts: { heading: string; body: string }; radiusStyle: string } {
  const variants: Record<string, { description: string; fonts: { heading: string; body: string }; radiusStyle: string }> = {
    modern: {
      description: "Clean lines, generous whitespace, subtle shadows. Focus on clarity and contemporary aesthetics.",
      fonts: { heading: "Inter", body: "Inter" },
      radiusStyle: "rounded-xl (12px)"
    },
    minimal: {
      description: "Ultra-clean, lots of negative space, monochromatic with single accent. Typography-focused.",
      fonts: { heading: "DM Sans", body: "DM Sans" },
      radiusStyle: "rounded-lg (8px)"
    },
    bold: {
      description: "High contrast, large typography, vibrant colors, dramatic shadows. Makes a strong statement.",
      fonts: { heading: "Oswald", body: "Open Sans" },
      radiusStyle: "rounded-md (6px)"
    },
    corporate: {
      description: "Professional, trustworthy, structured layouts. Emphasizes stability and expertise.",
      fonts: { heading: "Montserrat", body: "Source Sans 3" },
      radiusStyle: "rounded (4px)"
    },
    elegant: {
      description: "Sophisticated, refined typography, subtle gradients. Luxury feel with attention to detail.",
      fonts: { heading: "Playfair Display", body: "Lora" },
      radiusStyle: "rounded-lg (8px)"
    },
    creative: {
      description: "Playful, unexpected layouts, creative use of color. Fun and approachable.",
      fonts: { heading: "Poppins", body: "Nunito" },
      radiusStyle: "rounded-2xl (16px)"
    },
    tech: {
      description: "Futuristic, sharp edges optional, gradient accents. Modern technology feel.",
      fonts: { heading: "Space Grotesk", body: "Work Sans" },
      radiusStyle: "rounded-lg (8px)"
    }
  };
  
  return variants[style] || variants.modern;
}

interface IndustryTemplate {
  context: string;
  suggestedColors: { primary: string; secondary: string; accent: string };
  suggestedStyle: string;
  keyFeatures: string[];
  testimonialFocus: string;
}

function getIndustryTemplate(industry: string): IndustryTemplate {
  const templates: Record<string, IndustryTemplate> = {
    "Technology": {
      context: `Focus on innovation, efficiency, and cutting-edge solutions. Emphasize scalability, security, and ROI. Use modern tech terminology. Testimonials should mention specific metrics and time savings.`,
      suggestedColors: { primary: "#3b82f6", secondary: "#1e40af", accent: "#06b6d4" },
      suggestedStyle: "tech",
      keyFeatures: ["API Integration", "99.9% Uptime", "Enterprise Security", "24/7 Support", "Scalable Infrastructure", "Real-time Analytics"],
      testimonialFocus: "efficiency gains, time saved, ROI improvements"
    },
    "SaaS": {
      context: `Focus on productivity gains, ease of use, and seamless integration. Emphasize free trials, quick onboarding, and customer success stories. Use benefit-driven feature descriptions.`,
      suggestedColors: { primary: "#6366f1", secondary: "#4f46e5", accent: "#22d3ee" },
      suggestedStyle: "modern",
      keyFeatures: ["Free Trial", "No Credit Card Required", "Cancel Anytime", "API Access", "Team Collaboration", "Custom Integrations"],
      testimonialFocus: "productivity improvements, ease of use, customer support quality"
    },
    "Healthcare": {
      context: `Prioritize trust, safety, and patient outcomes. Use empathetic language. Emphasize certifications, experience, and care quality. Include HIPAA compliance messaging where relevant.`,
      suggestedColors: { primary: "#0d9488", secondary: "#047857", accent: "#14b8a6" },
      suggestedStyle: "corporate",
      keyFeatures: ["Board Certified", "HIPAA Compliant", "Patient-Centered Care", "Evidence-Based Treatment", "Compassionate Staff", "Modern Facilities"],
      testimonialFocus: "care quality, staff compassion, treatment outcomes"
    },
    "Restaurant": {
      context: `Appeal to senses and experiences. Use vivid, appetizing descriptions. Emphasize quality ingredients, atmosphere, and memorable dining experiences. Include menu highlights.`,
      suggestedColors: { primary: "#ea580c", secondary: "#c2410c", accent: "#f59e0b" },
      suggestedStyle: "elegant",
      keyFeatures: ["Fresh Ingredients", "Award-Winning Chef", "Cozy Atmosphere", "Private Dining", "Seasonal Menu", "Local Sourcing"],
      testimonialFocus: "food quality, atmosphere, memorable experiences"
    },
    "E-commerce": {
      context: `Focus on product quality, fast shipping, and customer satisfaction. Emphasize secure checkout, easy returns, and product variety. Use trust signals prominently.`,
      suggestedColors: { primary: "#8b5cf6", secondary: "#7c3aed", accent: "#f472b6" },
      suggestedStyle: "modern",
      keyFeatures: ["Free Shipping", "Easy Returns", "Secure Checkout", "24/7 Support", "Quality Guarantee", "Fast Delivery"],
      testimonialFocus: "product quality, shipping speed, customer service"
    },
    "Consulting": {
      context: `Convey expertise, results, and strategic thinking. Use authoritative language. Emphasize case studies, methodology, and measurable outcomes.`,
      suggestedColors: { primary: "#1e3a8a", secondary: "#1e40af", accent: "#ca8a04" },
      suggestedStyle: "corporate",
      keyFeatures: ["Proven Methodology", "Fortune 500 Clients", "Measurable Results", "Industry Expertise", "Custom Solutions", "Executive Team"],
      testimonialFocus: "ROI delivered, strategic insights, business transformation"
    },
    "Finance": {
      context: `Convey stability, expertise, and trustworthiness. Use precise language. Emphasize security, returns, and regulatory compliance. Include fiduciary responsibility messaging.`,
      suggestedColors: { primary: "#166534", secondary: "#14532d", accent: "#ca8a04" },
      suggestedStyle: "corporate",
      keyFeatures: ["Fiduciary Duty", "SEC Registered", "Transparent Fees", "Personalized Plans", "Market Expertise", "Secure Transactions"],
      testimonialFocus: "trust, performance, personalized service"
    },
    "Real Estate": {
      context: `Focus on dreams, investment potential, and local expertise. Use aspirational language. Emphasize market knowledge, negotiation skills, and client success stories.`,
      suggestedColors: { primary: "#1e3a8a", secondary: "#1e40af", accent: "#ca8a04" },
      suggestedStyle: "elegant",
      keyFeatures: ["Local Market Expert", "Top Producer", "Virtual Tours", "Negotiation Skills", "Client-First Approach", "Investment Guidance"],
      testimonialFocus: "smooth transactions, market knowledge, finding dream homes"
    },
    "Fitness": {
      context: `Inspire action and transformation. Use motivational language. Emphasize results, expertise, and community. Include transformation stories.`,
      suggestedColors: { primary: "#dc2626", secondary: "#b91c1c", accent: "#f59e0b" },
      suggestedStyle: "bold",
      keyFeatures: ["Personal Training", "Group Classes", "Nutrition Coaching", "Results Guaranteed", "Flexible Hours", "Community Support"],
      testimonialFocus: "transformation results, trainer expertise, community atmosphere"
    },
    "Legal": {
      context: `Convey authority, experience, and client advocacy. Use professional language. Emphasize track record, expertise areas, and client confidentiality.`,
      suggestedColors: { primary: "#1e3a5a", secondary: "#0f172a", accent: "#b45309" },
      suggestedStyle: "corporate",
      keyFeatures: ["Free Consultation", "Experienced Attorneys", "Track Record", "Confidentiality", "Client Advocacy", "Results-Oriented"],
      testimonialFocus: "case outcomes, attorney expertise, client communication"
    }
  };
  
  return templates[industry] || {
    context: `Focus on professionalism, quality, and customer satisfaction. Use clear, benefit-driven language. Emphasize experience, reliability, and results.`,
    suggestedColors: { primary: "#3b82f6", secondary: "#1e40af", accent: "#10b981" },
    suggestedStyle: "modern",
    keyFeatures: ["Quality Service", "Expert Team", "Customer First", "Proven Results", "Reliable Support", "Best Value"],
    testimonialFocus: "quality, reliability, customer satisfaction"
  };
}

function getIndustryContext(industry: string): string {
  const template = getIndustryTemplate(industry);
  return `${template.context}
- Suggested feature themes: ${template.keyFeatures.join(", ")}
- Testimonial focus: ${template.testimonialFocus}`;
}

export const openaiConnector = defineConnector({
  key: "openai",
  name: "OpenAI (via Replit AI)",
  description: "AI text, content, and image generation powered by GPT models",
  category: "ai",
  capabilities: ["name_generation", "brand_generation", "content_generation", "text_generation", "image_generation"],
  authType: "bearer",
  requiredEnvVars: ["AI_INTEGRATIONS_OPENAI_API_KEY", "AI_INTEGRATIONS_OPENAI_BASE_URL"],

  isConfigured() {
    return !!(
      process.env.AI_INTEGRATIONS_OPENAI_API_KEY &&
      process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
    );
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

        const prompt = `You are an elite conversion copywriter who has written for Apple, Stripe, Airbnb, and Linear. Create an EXCEPTIONAL, award-winning website that would impress Awwwards judges.

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
${industryContext}

PAGES TO CREATE: ${pageList.join(", ")}

AVAILABLE SECTION TYPES:
- "hero": {headline, subheadline, statement, ctaText, ctaLink, secondaryCtaText, badge, heroArchetype} - Powerful opening
  - heroArchetype options based on business type:
    * "editorial" - Best for agencies, creators, portfolios. Bold asymmetric layout with gradient text
    * "split" - Best for SaaS, tech, startups. 50/50 split with image on right
    * "immersive" - Best for luxury, hospitality, events. Full-screen image with centered text overlay
    * "cinematic" - Best for premium brands, real estate, high-end products. Dramatic full-screen with film-like transitions
    * "bold" - Best for startups, creative agencies. Extra-large typography with floating gradients
    * "minimal" - Best for professional services, consulting. Clean, understated, focused
  - Choose heroArchetype based on: SaaS/tech→split or bold, local business→split, agency→editorial or bold, luxury→immersive or cinematic, professional→minimal
  - statement: 1-2 sentence powerful value proposition (optional, used in some archetypes)
  - badge: Short text like "New in 2024" or "Award Winning" (optional)
- "features": {headline, subheadline, items:[{title, description, icon}]} - Value propositions. Icons: star, shield, zap, heart, target, users, clock, check, award, globe, briefcase, settings, wrench, lightbulb
- "services": {headline, subheadline, items:[{title, description, icon, price, features:[]}]} - Detailed offerings with benefits
- "testimonials": {headline, subheadline, items:[{quote, author, role, company}]} - Social proof with compelling stories
- "team": {headline, subheadline, members:[{name, role, bio}]} - Humanize the brand
- "stats": {headline, items:[{value, label, suffix, prefix}]} - Credibility numbers
- "pricing": {headline, subheadline, plans:[{name, price, period, description, features:[], highlighted, ctaText}]} - Clear value tiers
- "faq": {headline, subheadline, items:[{question, answer}]} - Objection handling
- "cta": {headline, subheadline, buttonText, buttonLink} - Conversion driver
- "text": {headline, content, alignment} - Story and context
- "story": {headline, subheadline, paragraphs:[], quote, quoteAuthor, stats:[{value, label}], layout:"editorial"} - Brand narrative, origin story
- "contact": {headline, subheadline, email, phone, address, showForm:true}

PAGE BLUEPRINTS:
1. HOME (6 sections): hero → features (6 items) → stats (4 credibility numbers) → services (4 highlighted) → testimonials (3 compelling stories) → cta
2. ABOUT (5 sections): hero → text (origin story, mission, vision - 3 rich paragraphs) → team (4 members with personality) → stats → cta
3. SERVICES (5 sections): hero → services (6 comprehensive offerings) → pricing (3 tiers: starter/professional/enterprise) → faq (6 objection-handlers) → cta
4. CONTACT (4 sections): hero → contact (with form) → text (response commitment, office hours) → cta

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

          const imageData = imageResponse.data[0];
          
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

          const imageData = imageResponse.data[0];
          
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

          const imageData = imageResponse.data[0];
          
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
