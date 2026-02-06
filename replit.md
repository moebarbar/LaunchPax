# LaunchPax - AI Business Builder Platform

## Overview

LaunchPax is an AI-powered platform designed to empower users to launch and grow businesses efficiently. It provides a centralized dashboard to orchestrate various external APIs for generating essential business assets like names, domains, brand kits, website content, and graphics. The platform operates on a project-based architecture, ensuring isolated configurations for each business venture.

The core vision is to offer a comprehensive, white-labeled solution that simplifies the business launch process. It abstracts technical and design complexities through an intuitive AI-driven workflow, enabling users to create and manage their online presence with ease. Key capabilities include AI-powered content generation, a flexible connector-based integration system, and a robust workflow engine for multi-step generation processes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript (Vite)
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **UI Components**: shadcn/ui (based on Radix UI)
- **Styling**: Tailwind CSS with CSS variables (light/dark mode)
- **UI/UX Decisions**:
    - **Global Style Editor**: Manages colors, typography, and style presets.
    - **Editable Sections Panel**: Allows drag-based reordering, adding, deleting, and duplicating of website sections.
    - **Website Templates**: Offers 12 diverse section types with premium styling and animations.
    - **Responsive Design**: Mobile-first approach with progressive text scaling and responsive layouts.
    - **Signature Visual Moments**: Utilizes components like LargeTypography, ParallaxDivider, and AnimatedGradientBg.
    - **Techy Build Progress**: Displays terminal-style animated progress visualization for workflows.

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Pattern**: RESTful endpoints
- **Authentication**: Replit Auth (OpenID Connect) with PostgreSQL session storage

### Core Systems
- **Connector System**: Registry pattern for abstracting external API integrations with capability-based lookup and mock fallbacks.
- **Creative Theme Engine v4.0.0**: World-class design system with 24 distinctive themes covering ALL business types:
  - **Original 12 Themes**: dark-neon, editorial-luxury, soft-gradient, bold-modern, minimal-clean, urban-gritty, vibrant-pop, classic-elegant, nature-organic, tech-futuristic, warm-artisan, crisp-corporate
  - **NEW 12 Specialized Themes v4.0**:
    - `startup-velocity`: Dynamic startup/tech companies with purple/cyan gradients
    - `saas-aurora`: Modern SaaS products with aurora-inspired gradients
    - `fintech-precision`: Financial/banking with trust-building blue/green palette
    - `healthcare-trust`: Medical/wellness with calming cyan/green tones
    - `cyber-matrix`: Cybersecurity/dev tools with terminal green aesthetic
    - `creative-studio`: Creative agencies with expressive orange/purple
    - `luxury-noir`: High-end luxury with gold on black elegance
    - `eco-sustainable`: Environmental/organic with natural green palette
    - `indie-maker`: Indie hackers/solo founders with warm orange energy
    - `enterprise-power`: Enterprise B2B with authoritative blue
    - `retro-future`: Synthwave/gaming with pink/cyan/yellow neon
    - `zen-minimal`: Ultra-minimal Japanese aesthetic with serene neutrals
  - **Complete Design Systems**: 22+ color palette, named gradient definitions, 7-level shadow system, typography scales, spacing/border-radius scales per theme
  - **Motion Design**: Theme-specific durations, easings, hover/click transforms, page transitions, scroll reveal animations
  - **Visual Effects**: Glass morphism, gradient overlays, animated gradients, parallax, particle effects, grain textures
  - **Intelligent Selection**: Advanced scoring algorithm with 150+ industry mappings, 25+ tone modifiers with boost/suppress logic
  - **Hero/Navigation/Card Configs**: Per-theme configurations for archetypes, styles, animations
  - **Photography Direction**: Style, mood, lighting, composition, color treatment per theme
  - **Quality Metrics**: Sophistication, accessibility, uniqueness scores with bestFor/avoidFor recommendations
- **Image Management System**: Handles user uploads, auto-generates SEO-optimized alt text, integrates with stock photo services, and optimizes images via Cloudinary.
- **Section Transitions**: Implements smooth visual transitions (gradient-fade, overlap, soft-merge, blur-blend) between website sections.
- **Workflow Engine**: Orchestrates multi-step generation processes with self-healing capabilities (automatic retries, workflow recovery).
- **Smart AI Router**: Intelligently routes AI tasks to appropriate models (e.g., OpenAI, DeepSeek, DALL-E) with automatic fallback chains and retry logic.
- **Content Cache System**: Reduces API calls by caching generated content with hash-based invalidation.
- **Workflow Recovery**: Ensures workflow completion by tracking progress, auto-cleaning stuck jobs, and enforcing maximum workflow times.
- **Creativity Checklist**: Validates premium website elements, hero archetypes, visual signatures, section variety, SEO fields, and font limits.
- **Quality Engine**: Provides AI-powered quality evaluation across 8 dimensions and performs refinement passes to improve weak sections, enforcing premium quality thresholds and detecting generic patterns.
- **Long-Form Page Blueprints**: Defines sophisticated section layouts for common page types (HOME, ABOUT, SERVICES, CONTACT).
- **Project Architecture**: Each project is an independent business configuration with isolated content and build states.
- **Website Publishing System**: Supports publishing to live URLs and secure previews.
- **AI-Powered Section Editing**: Allows users to refine website sections using natural language prompts.
- **Website Enhancement Service**: Orchestrates integrations for premium website features, including AI hero images, multi-source stock photos, CDN optimization, analytics injection, maps, payment processing, contact forms, and animations.
- **Theme Color Integration (Complete)**: Full pipeline from backend theme data to frontend CSS variables:
  - **generateBrandStyles**: Maps 30+ theme settings to CSS custom properties (colors, gradients, card configs, motion tokens, effects, typography weights)
  - **CSS Variable Cascade**: Global CSS overrides use `var(--brand-heading, var(--brand-text, hsl(var(--foreground))))` pattern for graceful fallback
  - **Dark Theme Support**: All section templates, navigation, and footer use CSS variables instead of hardcoded light-mode colors
  - **Theme-Aware Navigation**: Adapts background, text, border, shadow, and pill colors based on `colorScheme` (dark/light) and `navigationStyle` (floating-pill/minimal/solid/transparent)
  - **Themed Cards**: `.themed-card` CSS class applies `--brand-card-radius`, `--brand-card-shadow`, `--brand-card-hover-lift`, `--brand-card-hover-shadow` with motion-aware transitions
  - **Motion Tokens (Complete)**: Theme-specific motion system with `useThemeMotion()` hook in `motion-wrapper.tsx`:
    - 8 CSS variables: `--brand-motion-fast`, `--brand-motion-duration`, `--brand-motion-slow`, `--brand-motion-very-slow`, `--brand-motion-easing`, `--brand-motion-easing-out`, `--brand-motion-easing-bounce`, `--brand-motion-easing-smooth`
    - `useThemeMotion()` hook reads CSS variables and provides JS values (duration, durationFast, durationSlow, durationVerySlow, easing, easingOut) for Framer Motion
    - All 15 section templates + 5 hero templates use `themeMotion.*` instead of hardcoded duration/easing values
    - `FadeIn`, `StaggerItem`, `ScaleIn` wrappers in motion-wrapper.tsx also use theme tokens internally
    - CSS `.hover-card` and `.themed-card` classes use motion tokens for transition timing
  - **Visual Effects System**: CSS utility classes for glass-morphism, gradient-overlay, animated-gradient injected in website-renderer.tsx scoped styles when theme enables them via `enableGlassMorphism`/`enableGradientOverlays`/`enableAnimatedGradients` flags
  - **Photography Direction Integration**: Stock photo searches receive `photographyStyle`, `photographyMood`, `photographyKeywords` from theme config via siteSettings, threaded through `autoFillMissingImages` → `findStockImage`
- **Premium Design Standards System (v2.0.0)**: Central module (`server/services/premium-design-standards.ts`) enforcing agency-level quality via:
  - **Navigation**: Floating-pill style with glass morphism, hover animations, gradient CTA with shine effect
  - **Hero Sections**: 90vh minimum height, animated gradient orbs, pill-style badges, scroll indicators
  - **Cards**: 1.5rem border radius, 8px hover lift, premium shadows (0 20px 40px)
  - **Typography**: font-weight 800 for h1, -0.035em letter-spacing, antialiased rendering
  - **Colors**: Theme-driven via CSS variables; no hardcoded light-mode colors in section templates
  - **Quality Thresholds**: Overall 90, hero 95, home page 10 sections, about/services 8 sections
  - **Validation**: 13-point premium compliance check integrated into quality gate (requires 80% score)
- **White-Label Requirements**: No Replit branding exposed; hosting/build layers designed for future provider flexibility.
- **Website Content Quality**: Includes smart icon assignment based on keywords, comprehensive image population for all sections, and industry-specific logo prompts for combination marks.

## External Dependencies

### Database
- **PostgreSQL**: Primary database.
- **Drizzle ORM**: For database schema definition and interaction.

### LaunchPax Engine (Multi-Model AI Orchestration)
- **LaunchPax Engine (DeepSeek)**: For cost-effective long-form content generation.
- **GPT-4o (OpenAI)**: For premium name, brand, and website content generation.
- **Claude 3.5 Sonnet (Anthropic)**: Alternative for long-form content generation.
- **DALL-E 3 (OpenAI)**: For AI image generation (hero images, logos).
- **Stability AI**: For high-quality AI image generation (Stable Diffusion).
- **Leonardo AI**: For stylized AI graphics and illustrations.
- **Google Studio (Google Gemini)**: For advanced graphics generation.

### Stock Photography
- **Pexels**: For high-quality free stock photos.
- **Unsplash**: For premium stock photography.

### Payment Processing
- **Stripe**: For e-commerce functionality.

### Email Services
- **SendGrid**: For email delivery.

### SMS Services
- **Twilio**: For SMS notifications and business alerts.

### Analytics
- **Google Analytics**: For website visitor tracking and conversion tracking.

### Domain Services
- **Namecheap**: For domain availability checking and registration.

### Maps & Location
- **Google Maps**: For embedding business locations.

### Animations
- **Lottie**: For animated icons and graphics.

### CDN & Image Optimization
- **Cloudinary**: For image optimization, transformation, and CDN.
- **Cloudflare**: For CDN, DNS, and edge deployment.

### Authentication
- **Replit Auth**: For OpenID Connect-based authentication.