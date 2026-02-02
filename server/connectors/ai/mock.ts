import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

/**
 * Mock AI Connector
 * 
 * Provides fallback mock data when no real AI connector is available.
 * Used for demonstration and development purposes.
 */

export const mockAIConnector = defineConnector({
  key: "ai_mock",
  name: "Mock AI (Demo Mode)",
  description: "Fallback mock data for demonstration when AI APIs are unavailable",
  category: "ai",
  capabilities: ["name_generation", "brand_generation", "content_generation", "text_generation"],
  authType: "none",
  requiredEnvVars: [],

  isConfigured() {
    return true; // Always available as fallback
  },

  async test() {
    return { ok: true, message: "Mock connector always available" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    switch (task.action) {
      case "generate_names": {
        const input = task.input as { businessIdea: string; industry?: string };
        const baseName = input.industry || "Business";
        
        const names = [
          `${baseName}Flow`,
          `${baseName}Hub`,
          `${baseName}Spark`,
          `${baseName}Wave`,
          `${baseName}Sync`,
          `Bright${baseName}`,
          `${baseName}ify`,
          `${baseName}Labs`,
          `Pure${baseName}`,
          `${baseName}Craft`,
          `Nova${baseName}`,
          `${baseName}Nest`,
          `${baseName}Pulse`,
          `Zen${baseName}`,
          `${baseName}Forge`,
          `Swift${baseName}`,
          `${baseName}Bridge`,
          `${baseName}Sphere`,
          `Prime${baseName}`,
          `${baseName}Edge`,
        ].slice(0, 20);

        return {
          success: true,
          data: names as O,
          provider: "ai_mock",
          metadata: { isMock: true },
        };
      }

      case "generate_brand_kit": {
        const input = task.input as { businessName: string; tone?: string };
        
        const brandKit = {
          brandVoice: `${input.businessName} speaks with a ${input.tone || "professional"} and approachable voice. We believe in clarity, reliability, and building lasting relationships with our customers.`,
          taglines: [
            `${input.businessName} - Where Innovation Meets Excellence`,
            "Building Tomorrow, Today",
            "Your Success, Our Mission",
            "Elevate Your Experience",
            "Simplicity. Quality. Results.",
          ],
          colorPalette: [
            { name: "Primary", hex: "#2563eb", usage: "Main brand color, CTAs" },
            { name: "Secondary", hex: "#7c3aed", usage: "Accents and highlights" },
            { name: "Background", hex: "#f8fafc", usage: "Page backgrounds" },
            { name: "Text", hex: "#1e293b", usage: "Body text" },
            { name: "Accent", hex: "#10b981", usage: "Success states, highlights" },
          ],
          fontPairings: [
            { heading: "Inter", body: "Inter", accent: "JetBrains Mono" },
            { heading: "Poppins", body: "Open Sans" },
          ],
          messagingPillars: [
            { title: "Innovation", description: "We constantly push boundaries to deliver cutting-edge solutions." },
            { title: "Reliability", description: "Our customers trust us to deliver consistent, dependable results." },
            { title: "Customer Focus", description: "Every decision we make starts with our customers' needs." },
          ],
          elevatorPitch: `${input.businessName} helps businesses achieve their goals through innovative solutions. We combine cutting-edge technology with exceptional service to deliver results that exceed expectations.`,
        };

        return {
          success: true,
          data: brandKit as O,
          provider: "ai_mock",
          metadata: { isMock: true },
        };
      }

      case "generate_website_content": {
        const input = task.input as { businessName: string; businessIdea: string };
        
        const websiteContent = {
          pages: [
            {
              slug: "home",
              title: `${input.businessName} - Transform Your Business`,
              metaDescription: `Welcome to ${input.businessName}. ${input.businessIdea}. Discover how we can help you achieve your goals.`,
              sections: [
                {
                  id: "hero-1",
                  type: "hero",
                  data: {
                    headline: `Transform Your Business with ${input.businessName}`,
                    subheadline: `${input.businessIdea}. We deliver exceptional results that drive growth and exceed expectations. Join thousands of satisfied clients who trust us with their success.`,
                    ctaText: "Get Started Today",
                    ctaLink: "/contact",
                  },
                },
                {
                  id: "features-1",
                  type: "features",
                  data: {
                    headline: "Why Industry Leaders Choose Us",
                    subheadline: "We combine expertise, innovation, and dedication to deliver outstanding results for every client.",
                    items: [
                      { title: "Expert Team", description: "Our seasoned professionals bring decades of combined experience to solve your toughest challenges", icon: "users" },
                      { title: "Proven Results", description: "Track record of delivering measurable outcomes that exceed client expectations", icon: "target" },
                      { title: "24/7 Support", description: "Round-the-clock assistance ensures you're never left without help when you need it", icon: "clock" },
                      { title: "Innovation First", description: "We leverage cutting-edge technology and methods to stay ahead of the curve", icon: "zap" },
                      { title: "Quality Guaranteed", description: "Our rigorous quality standards ensure excellence in every deliverable", icon: "shield" },
                      { title: "Client-Focused", description: "Your success is our priority - we tailor our approach to your unique needs", icon: "heart" },
                    ],
                  },
                },
                {
                  id: "stats-1",
                  type: "stats",
                  data: {
                    headline: "Trusted by Thousands Worldwide",
                    items: [
                      { value: "500", suffix: "+", label: "Happy Clients" },
                      { value: "10", suffix: "+", label: "Years Experience" },
                      { value: "98", suffix: "%", label: "Client Satisfaction" },
                      { value: "50", suffix: "K+", label: "Projects Completed" },
                    ],
                  },
                },
                {
                  id: "testimonials-1",
                  type: "testimonials",
                  data: {
                    headline: "What Our Clients Say",
                    subheadline: "Don't just take our word for it - hear from businesses we've helped succeed.",
                    items: [
                      { quote: "Working with this team transformed our entire operation. Their expertise and dedication exceeded all expectations. We saw a 40% increase in efficiency within the first quarter.", author: "Sarah Johnson", role: "CEO", company: "TechStart Inc." },
                      { quote: "The level of professionalism and attention to detail is unmatched. They truly understand our business needs and deliver results that matter.", author: "Michael Chen", role: "Director of Operations", company: "Global Solutions" },
                      { quote: "From day one, they've been incredible partners. Their innovative approach helped us solve challenges we'd been struggling with for years.", author: "Emily Rodriguez", role: "Founder", company: "Innovation Labs" },
                    ],
                  },
                },
                {
                  id: "cta-1",
                  type: "cta",
                  data: {
                    headline: "Ready to Transform Your Business?",
                    subheadline: "Join thousands of satisfied customers and take the first step toward success today.",
                    buttonText: "Schedule a Free Consultation",
                    buttonLink: "/contact",
                  },
                },
              ],
            },
            {
              slug: "about",
              title: `About ${input.businessName} - Our Story`,
              metaDescription: `Learn about ${input.businessName}'s mission, values, and the team dedicated to your success.`,
              sections: [
                {
                  id: "hero-about",
                  type: "hero",
                  data: {
                    headline: `About ${input.businessName}`,
                    subheadline: "Discover the passion, expertise, and vision that drives everything we do.",
                    ctaText: "Meet Our Team",
                    ctaLink: "#team",
                  },
                },
                {
                  id: "text-story",
                  type: "text",
                  data: {
                    headline: "Our Story",
                    content: `${input.businessName} was founded with a simple yet powerful vision: ${input.businessIdea}.\n\nWhat began as a small team with big dreams has grown into a trusted partner for hundreds of businesses across multiple industries. Our journey has been defined by a relentless commitment to excellence and a genuine passion for helping our clients succeed.\n\nToday, we continue to push boundaries and innovate, always staying true to the values that got us here: integrity, excellence, and unwavering dedication to our clients' success.`,
                    alignment: "left",
                  },
                },
                {
                  id: "team-1",
                  type: "team",
                  data: {
                    headline: "Meet Our Leadership Team",
                    subheadline: "The experienced professionals driving our vision forward.",
                    members: [
                      { name: "Alexandra Thompson", role: "Chief Executive Officer", bio: "15+ years of industry experience. Former VP at Fortune 500 company. Passionate about innovation and team development." },
                      { name: "David Martinez", role: "Chief Technology Officer", bio: "Engineering leader with a track record of building scalable solutions. MIT graduate with expertise in AI and cloud architecture." },
                      { name: "Jennifer Park", role: "Chief Operations Officer", bio: "Operations expert who has optimized processes for dozens of companies. Known for turning challenges into opportunities." },
                      { name: "Robert Williams", role: "Chief Marketing Officer", bio: "Brand strategist who has led award-winning campaigns. Specialist in digital transformation and customer engagement." },
                    ],
                  },
                },
                {
                  id: "stats-about",
                  type: "stats",
                  data: {
                    items: [
                      { value: "2015", label: "Founded" },
                      { value: "85", suffix: "+", label: "Team Members" },
                      { value: "12", label: "Countries Served" },
                      { value: "5", suffix: "★", label: "Average Rating" },
                    ],
                  },
                },
                {
                  id: "cta-about",
                  type: "cta",
                  data: {
                    headline: "Want to Join Our Team?",
                    subheadline: "We're always looking for talented individuals who share our passion for excellence.",
                    buttonText: "View Open Positions",
                    buttonLink: "/careers",
                  },
                },
              ],
            },
            {
              slug: "services",
              title: `Services | ${input.businessName}`,
              metaDescription: `Explore our comprehensive range of services designed to help your business grow and succeed.`,
              sections: [
                {
                  id: "hero-services",
                  type: "hero",
                  data: {
                    headline: "Our Services",
                    subheadline: "Comprehensive solutions tailored to your unique business needs. Discover how we can help you achieve your goals.",
                    ctaText: "Get a Quote",
                    ctaLink: "/contact",
                  },
                },
                {
                  id: "services-1",
                  type: "services",
                  data: {
                    headline: "What We Offer",
                    subheadline: "From strategy to execution, we provide end-to-end solutions that drive real results.",
                    items: [
                      { title: "Strategic Consulting", description: "In-depth analysis and actionable strategies to position your business for long-term success. We identify opportunities and create roadmaps for growth.", icon: "target", price: "Starting at $2,500" },
                      { title: "Digital Transformation", description: "Modernize your operations with cutting-edge technology solutions. We help you leverage digital tools to increase efficiency and reach.", icon: "zap", price: "Custom Pricing" },
                      { title: "Brand Development", description: "Create a powerful brand identity that resonates with your audience. From logos to messaging, we build brands that stand out.", icon: "award", price: "Starting at $5,000" },
                      { title: "Marketing Services", description: "Data-driven marketing strategies that generate leads and drive conversions. We optimize every channel for maximum ROI.", icon: "globe", price: "Starting at $1,500/mo" },
                      { title: "Training & Support", description: "Comprehensive training programs and ongoing support to ensure your team has the skills and knowledge they need.", icon: "users", price: "Starting at $500/session" },
                      { title: "Custom Solutions", description: "Bespoke solutions designed specifically for your unique challenges. We work closely with you to create exactly what you need.", icon: "settings", price: "Contact for Quote" },
                    ],
                  },
                },
                {
                  id: "pricing-1",
                  type: "pricing",
                  data: {
                    headline: "Simple, Transparent Pricing",
                    subheadline: "Choose the plan that best fits your needs. All plans include our core features and dedicated support.",
                    plans: [
                      { name: "Starter", price: "$499", period: "month", description: "Perfect for small businesses just getting started", features: ["Up to 5 team members", "Basic analytics", "Email support", "Core features", "Monthly reports"], ctaText: "Get Started" },
                      { name: "Professional", price: "$999", period: "month", description: "Ideal for growing businesses with advanced needs", features: ["Up to 25 team members", "Advanced analytics", "Priority support", "All features", "Weekly reports", "Custom integrations"], highlighted: true, ctaText: "Start Free Trial" },
                      { name: "Enterprise", price: "Custom", period: "", description: "Tailored solutions for large organizations", features: ["Unlimited team members", "Enterprise analytics", "24/7 phone support", "All features", "Real-time dashboards", "Dedicated account manager", "SLA guarantee"], ctaText: "Contact Sales" },
                    ],
                  },
                },
                {
                  id: "faq-1",
                  type: "faq",
                  data: {
                    headline: "Frequently Asked Questions",
                    subheadline: "Find answers to common questions about our services.",
                    items: [
                      { question: "How long does a typical project take?", answer: "Project timelines vary based on scope and complexity. Most projects range from 2-8 weeks. During our initial consultation, we'll provide a detailed timeline tailored to your specific needs." },
                      { question: "Do you offer a money-back guarantee?", answer: "Yes! We stand behind our work with a 30-day satisfaction guarantee. If you're not completely satisfied with our services, we'll work with you to make it right or provide a full refund." },
                      { question: "Can you work with our existing systems?", answer: "Absolutely. We specialize in integrating with existing workflows and systems. Our team will assess your current setup and ensure seamless compatibility with our solutions." },
                      { question: "What industries do you serve?", answer: "We work with clients across various industries including technology, healthcare, finance, retail, and manufacturing. Our approach adapts to the unique needs of each sector." },
                      { question: "How do we get started?", answer: "Getting started is easy! Simply schedule a free consultation through our contact page. We'll discuss your needs, answer any questions, and create a customized proposal for your project." },
                      { question: "Do you provide ongoing support?", answer: "Yes, we offer various support packages to ensure your continued success. From basic email support to dedicated account management, we have options to fit every need and budget." },
                    ],
                  },
                },
                {
                  id: "cta-services",
                  type: "cta",
                  data: {
                    headline: "Ready to Get Started?",
                    subheadline: "Let's discuss how we can help your business grow. Schedule a free consultation today.",
                    buttonText: "Schedule a Call",
                    buttonLink: "/contact",
                  },
                },
              ],
            },
            {
              slug: "contact",
              title: `Contact Us | ${input.businessName}`,
              metaDescription: `Get in touch with ${input.businessName}. We're here to answer your questions and help you succeed.`,
              sections: [
                {
                  id: "hero-contact",
                  type: "hero",
                  data: {
                    headline: "Let's Connect",
                    subheadline: "Have a question or ready to get started? We'd love to hear from you. Reach out and let's start a conversation.",
                    ctaText: "Send Us a Message",
                    ctaLink: "#contact-form",
                  },
                },
                {
                  id: "contact-1",
                  type: "contact",
                  data: {
                    headline: "Get in Touch",
                    subheadline: "Choose your preferred way to reach us. We typically respond within 24 hours.",
                    email: `hello@${input.businessName.toLowerCase().replace(/\s+/g, "")}.com`,
                    phone: "(555) 123-4567",
                    address: "123 Business Avenue, Suite 100, New York, NY 10001",
                    showForm: true,
                  },
                },
                {
                  id: "text-contact",
                  type: "text",
                  data: {
                    headline: "Office Hours",
                    content: "Monday - Friday: 9:00 AM - 6:00 PM EST\nSaturday: 10:00 AM - 2:00 PM EST\nSunday: Closed\n\nFor urgent inquiries outside business hours, please email us and we'll respond as soon as possible.",
                    alignment: "center",
                  },
                },
                {
                  id: "cta-contact",
                  type: "cta",
                  data: {
                    headline: "Prefer to Schedule a Call?",
                    subheadline: "Book a time that works for you and we'll call you directly.",
                    buttonText: "Book a Call",
                    buttonLink: "#schedule",
                  },
                },
              ],
            },
          ],
          globalContent: {
            siteName: input.businessName,
            tagline: "Transforming Ideas Into Success",
            navigation: [
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
            ],
            footer: {
              copyright: `© 2025 ${input.businessName}. All rights reserved.`,
              links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Careers", href: "/careers" },
              ],
              socialLinks: [
                { platform: "twitter", url: "#" },
                { platform: "linkedin", url: "#" },
                { platform: "facebook", url: "#" },
              ],
            },
          },
          siteSettings: {
            style: "modern",
            primaryColor: "#2563eb",
            secondaryColor: "#1e40af",
            accentColor: "#f59e0b",
            fontFamily: "Inter",
            headingFont: "Poppins",
          },
        };

        return {
          success: true,
          data: websiteContent as O,
          provider: "ai_mock",
          metadata: { isMock: true },
        };
      }

      case "generate_graphics_briefs": {
        const input = task.input as { businessName: string };
        
        const graphics = {
          graphics: [
            {
              type: "instagram_post",
              name: "Brand Introduction",
              dimensions: "1080x1080",
              designBrief: {
                prompt: `Modern, clean design for ${input.businessName} brand introduction`,
                style: "minimal",
                colors: ["#2563eb", "#ffffff"],
                elements: ["logo", "tagline"],
                mood: "professional",
              },
              copyText: `Introducing ${input.businessName} - Your new favorite way to succeed. #business #launch #startup`,
            },
            {
              type: "story",
              name: "Coming Soon",
              dimensions: "1080x1920",
              designBrief: {
                prompt: `Exciting coming soon announcement for ${input.businessName}`,
                style: "bold",
                colors: ["#7c3aed", "#ffffff"],
                elements: ["countdown", "logo"],
                mood: "exciting",
              },
              copyText: "Something amazing is coming... Stay tuned!",
            },
            {
              type: "facebook_ad",
              name: "Launch Campaign",
              dimensions: "1200x628",
              designBrief: {
                prompt: `Professional Facebook ad for ${input.businessName} launch`,
                style: "modern",
                colors: ["#2563eb", "#10b981"],
                elements: ["product", "cta button"],
                mood: "trustworthy",
              },
              copyText: `Ready to transform your business? ${input.businessName} is here to help. Learn more today!`,
            },
          ],
        };

        return {
          success: true,
          data: graphics as O,
          provider: "ai_mock",
          metadata: { isMock: true },
        };
      }

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "ai_mock",
        };
    }
  },
});
