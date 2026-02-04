# LaunchPax - AI Business Builder Platform

## Overview

LaunchPax is an AI-powered platform designed to help users launch and grow businesses. It provides a single dashboard to orchestrate various external APIs for generating business essentials such as names, domains, brand kits, website content, and graphics. The platform uses a project-based architecture, where each "Project" represents an isolated business venture.

Key capabilities include:
- Project-based business creation with isolated configurations
- AI-powered generation of business names, domains, brand assets, and website content
- Connector-based architecture for flexible integration with external services
- Comprehensive workflow engine for multi-step generation processes
- Payment processing, email, SMS, and analytics integrations

The business vision is to provide a comprehensive, white-labeled solution that simplifies the business launch process, abstracting complex technical and design tasks into an intuitive AI-driven workflow.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript (Vite build tool)
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **UI Components**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS with CSS variables (light/dark mode)
- **Path Aliases**: `@/` for `client/src/`, `@shared/` for `shared/`
- **UI/UX Decisions**:
    - **Global Style Editor**: Comprehensive system for managing colors (primary, secondary, accent, background, surface, text, muted text, border), typography (font pairing presets, heading/body font selectors), and style presets for brand personalities.
    - **Editable Sections Panel**: Drag-based reordering, adding, deleting, and duplicating of website sections.
    - **Website Templates**: 12 diverse section types (hero, features, services, testimonials, etc.) with premium, award-winning quality styling and Framer Motion animations.
    - **Responsive Design**: Mobile-first approach with progressive text scaling and responsive layouts.
    - **Signature Visual Moments**: Components like LargeTypography, ParallaxDivider, and AnimatedGradientBg for enhanced user engagement.
    - **Techy Build Progress**: Terminal-style animated progress visualization for workflows.

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: `shared/schema.ts`
- **API Pattern**: RESTful endpoints (`/api/`)
- **Authentication**: Replit Auth (OpenID Connect) with PostgreSQL session storage

### Core Systems
- **Connector System**: A registry pattern abstracts external API integrations. Connectors implement a standard interface and are registered in `server/connectors/index.ts`. They provide capability-based lookup (e.g., "name_generation") with **automatic fallback to mock connectors** when primary AI services fail (quota exceeded, network errors, etc.).
- **Image Management System**: Located in `server/services/image-manager.ts`, provides:
    - User image upload for any section at any time
    - Auto-generation of SEO-optimized alt text, captions, and metadata
    - Stock photo search and integration via Pexels API and Unsplash API
    - **Visual Completeness Enforcement**:
        - HARD BLOCK on publish: Cannot publish without complete images
        - Auto-fill missing images from Pexels stock photos before publishing
        - SOFT WARNING on preview: Shows completeness status for users to fix issues
        - Returns detailed missing images list for remediation
    - Image optimization with responsive sizes and lazy loading via Cloudinary
- **Section Transitions**: Smooth visual flow between sections using:
    - Gradient-fade, overlap, soft-merge, and blur-blend transition types
    - Overlapping sections to eliminate harsh visual breaks
    - Premium design standard with cohesive visual flow
- **Workflow Engine**: Located in `server/workflows/engine.ts`, it orchestrates multi-step generation workflows (naming, brand, website, graphics) using connectors based on capabilities. It tracks progress and logs activity.
- **Quality Engine**: Located in `server/workflows/quality-engine.ts`, it provides AI-powered quality evaluation and multi-pass refinement:
    - Evaluates website quality across 8 dimensions (overall, layout, typography, creativity, heroImpact, contentQuality, visualDepth, layoutSophistication)
    - Runs up to 3 refinement passes to auto-improve weak sections
    - **Premium Quality Thresholds**: Minimum 85 overall score, 90 for hero sections, 95 for excellent, 70 for layout sophistication
    - Detects 100+ generic patterns and template-looking content (banned phrases like "Welcome to", "Your trusted partner", etc.)
    - **Layout Sophistication Analysis**: Detects repetitive layouts, adjacent dense sections, hero+cards patterns, missing storytelling/trust sections
    - **Smart Hero Archetype Selection**: Industry-aware mapping (luxury→cinematic, events→immersive, startups→bold, SaaS→split, professional→minimal)
    - Provides comprehensive error handling with skipped/error flags for graceful degradation
    - Stores quality reports in activity logs for transparency
- **Long-Form Page Blueprints**: Premium websites require 8-12+ sections per page with sophisticated layouts:
    - HOME: hero → text → features → story → stats → services → process → testimonials → benefits → trust-signals → cta
    - ABOUT: hero → brand-story → text → team → stats → process → testimonials → benefits → cta
    - SERVICES: hero → text → services → process → case-studies → pricing → comparison → faq → testimonials → cta
    - CONTACT: hero → text → contact → faq → trust-signals → cta
- **Project Architecture**: Each project is an independent business configuration with an isolated content structure (structured JSON) and build states (draft, building, ready, error).
- **Website Publishing System**: Supports publishing to live URLs (`/site/:projectId`) and secure previews (`/preview/:token`).
- **AI-Powered Section Editing**: Allows users to refine website sections using natural language prompts, with section-type-aware guidance and dedicated API routes for refinement and direct data updates.
- **Website Enhancement Service**: Located in `server/services/website-enhancer.ts`, orchestrates all integrations to create premium websites:
    - **AI Hero Images**: Generates premium hero images using DALL-E 3, Stability AI, or Leonardo AI
    - **Multi-Source Stock Photos**: Auto-fills missing images from Pexels (primary) with Unsplash fallback
    - **CDN Optimization**: Optimizes all images through Cloudinary for responsive sizes and modern formats
    - **Analytics Injection**: Adds Google Analytics tracking to all pages
    - **Maps Integration**: Embeds Google Maps for business locations with address provided
    - **Payment Processing**: Integrates Stripe checkout for e-commerce functionality
    - **Contact Forms**: Connects SendGrid for email handling and Twilio for SMS alerts
    - **Animations**: Adds Lottie animated icons and micro-interactions
    - API endpoints: `GET /api/enhancement-capabilities` (available integrations), `POST /api/projects/:id/enhance` (apply enhancements)

### White-Label Requirements
- Replit is used solely as internal infrastructure.
- No Replit branding is exposed to end-users.
- Hosting/build layers are designed for future provider flexibility.

## Connector Architecture (21 Registered Connectors)

### Connector Categories
- **AI (8 connectors)**: openai, claude, nanobanana, launchpax, ai_mock, dalle, stability, leonardo
- **Images (3 connectors)**: pexels, stockphotos_mock, unsplash
- **Domains (2 connectors)**: domain_mock, namecheap
- **CDN (2 connectors)**: cloudinary, cloudflare
- **Payments (1 connector)**: stripe
- **Email (1 connector)**: sendgrid
- **SMS (1 connector)**: twilio
- **Maps (1 connector)**: google-maps
- **Animations (1 connector)**: lottie
- **Analytics (1 connector)**: google-analytics

### Connector Capabilities
All connectors implement a standard interface with:
- `key`: Unique identifier
- `name`: Display name
- `description`: Human-readable description
- `category`: Service category
- `capabilities`: Array of capability types
- `authType`: Authentication method (apiKey, oauth, bearer, none)
- `requiredEnvVars`: Required environment variables
- `isConfigured()`: Check if connector is ready
- `test()`: Validate connection
- `execute()`: Execute connector tasks

## External Dependencies

### Database
- **PostgreSQL**: Primary database.
- **Drizzle ORM**: Used for database schema definition and interaction.

### LaunchPax Engine (Multi-Model AI Orchestration)
The LaunchPax Engine combines multiple premium AI models for best-in-class results:
- **LaunchPax Engine (DeepSeek)**: Cost-effective AI for long-form content, articles, and detailed copy. The preferred choice for content generation. Requires `DEEPSEEK_API_KEY`.
- **GPT-4o (OpenAI)**: Premium AI generation for names, brands, and website content. Requires `OPENAI_API_KEY`.
- **Claude 3.5 Sonnet (Anthropic)**: Alternative for long-form content generation. Requires `ANTHROPIC_API_KEY`.
- **DALL-E 3 (OpenAI)**: AI image generation for hero images, logos, and custom graphics. Uses `OPENAI_API_KEY`.
- **Stability AI**: High-quality AI image generation with Stable Diffusion. Requires `STABILITY_API_KEY`.
- **Leonardo AI**: Stylized AI graphics and illustrations. Requires `LEONARDO_API_KEY`.
- **Google Studio (Google Gemini)**: Advanced graphics generation for logos, hero images, marketing assets. Requires `GOOGLE_API_KEY`.
- **Mock AI Connector**: Fallback for AI services when API keys are not configured.

### Stock Photography
- **Pexels**: High-quality free stock photos. Requires `PEXELS_API_KEY`.
- **Unsplash**: Premium stock photography. Requires `UNSPLASH_ACCESS_KEY`.

### Payment Processing
- **Stripe**: Payment processing for e-commerce websites. Requires `STRIPE_SECRET_KEY`.
    - Checkout session creation
    - Payment intent management
    - Product and subscription handling

### Email Services
- **SendGrid**: Email delivery for contact forms and notifications. Requires `SENDGRID_API_KEY`.
    - Contact form email handling
    - Transactional email delivery
    - Business notification emails

### SMS Services
- **Twilio**: SMS notifications and business alerts. Requires `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`.
    - New lead alerts
    - Order notifications
    - Appointment reminders

### Analytics
- **Google Analytics**: Website visitor tracking. Requires `GOOGLE_ANALYTICS_MEASUREMENT_ID`.
    - Page view tracking
    - Event tracking
    - E-commerce tracking
    - Conversion tracking

### Domain Services
- **Namecheap**: Domain availability checking and registration. Requires `NAMECHEAP_API_USER`, `NAMECHEAP_API_KEY`.
    - Domain availability checks
    - Domain suggestions
    - Multi-TLD search

### Maps & Location
- **Google Maps**: Location embedding for business websites. Requires `GOOGLE_MAPS_API_KEY`.
    - Address geocoding
    - Place details
    - Map embed generation

### Animations
- **Lottie**: Animated icons and graphics. Optional `LOTTIEFILES_API_KEY`.
    - Icon animations
    - Loading animations
    - UI micro-interactions

### CDN & Image Optimization
- **Cloudinary**: Image optimization and CDN. Requires `CLOUDINARY_CLOUD_NAME`, optional `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
    - Image upload and transformation
    - Responsive image generation
    - Format optimization (WebP, AVIF)
- **Cloudflare**: CDN, DNS, and edge deployment. Requires `CLOUDFLARE_API_TOKEN`.
    - Cache purging
    - DNS management
    - Edge deployment

### Authentication
- **Replit Auth**: OpenID Connect-based authentication.

## Recent Updates (February 2026)

### New Integrations Added
1. **Stripe** - Payment processing with checkout, subscriptions
2. **SendGrid** - Contact form emails and notifications
3. **Twilio** - SMS alerts for leads, orders, appointments
4. **Unsplash** - Additional stock photo source
5. **DALL-E 3** - AI image generation for hero images, logos
6. **Stability AI** - Stable Diffusion image generation
7. **Leonardo AI** - Stylized AI graphics
8. **Namecheap** - Domain availability checking
9. **Google Maps** - Business location embedding
10. **Lottie** - Animated graphics and icons
11. **Cloudinary** - Image optimization and CDN
12. **Cloudflare** - CDN and edge deployment
13. **Google Analytics** - Visitor tracking

### Schema Updates
- Added 11 new ConnectorCapability types: sms, alerts, notifications, checkout, subscriptions, contact_form, ai_graphics, stylized_art, maps, animations, cdn, image_optimization
