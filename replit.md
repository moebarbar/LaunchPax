# LaunchPax - AI Business Builder Platform

## Overview

LaunchPax is an AI-powered platform designed to enable users to launch and grow businesses efficiently. It provides a centralized dashboard to orchestrate various external APIs for generating essential business assets like names, domains, brand kits, website content, and graphics. The platform operates on a project-based architecture, ensuring isolated configurations for each business venture.

The core vision is to offer a comprehensive, white-labeled solution that simplifies the business launch process. It abstracts technical and design complexities through an intuitive AI-driven workflow, enabling users to create and manage their online presence with ease. Key capabilities include AI-powered content generation, a flexible connector-based integration system, and a robust workflow engine for multi-step generation processes. The project aims to provide a comprehensive, white-labeled solution for business creation, emphasizing ease of use and professional-grade output.

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
    - **Website Templates**: 20 section types with premium styling, code-built visuals, and animations.
    - **Responsive Design**: Mobile-first approach with progressive text scaling and responsive layouts.
    - **Visual Editor**: Full-page split-screen editor (60% preview, 40% editor panel) for intuitive content editing.
    - **Code-Built Visual Elements Library** (`client/src/components/website-templates/visuals/`):
        - `floating-elements.tsx`: FloatingOrb, GradientMesh, DotGrid, GridLines, FloatingShapes, SectionDivider, ShineEffect - all theme-aware via CSS variables.
        - `browser-mockup.tsx`: BrowserMockup (animated dashboard preview), PhoneMockup (mobile app preview) - used as hero visual panels.
        - `checklist-panel.tsx`: ChecklistPanel, StepIndicator - animated status/progress displays.
        - `metrics-display.tsx`: MetricCard, MetricsGrid, ProgressRing - animated counters with IntersectionObserver.
        - `advanced-effects.tsx`: RadialGlow, MultiStopGradient, NoiseTexture, MeshGradientBackground, SectionColorEvolution, GlowLine, ScrollProgressBar - premium gradient and visual effects.
        - `micro-interactions.tsx`: ParallaxLayer, StaggerReveal, MagneticElement, TextReveal, CountUpAnimation, HoverTilt, AnimatedGradientBorder - premium interaction components.
        - `svg-illustrations.tsx`: AbstractBlob, WavesDivider, GeometricPattern, DecorativeCircles, AbstractLines, IconGrid, GradientShape - code-built SVG illustrations with brand-color matching.
    - **Layout Intelligence System** (`client/src/lib/layout-intelligence.ts`):
        - Smart section rhythm alternation (dense/balanced/airy/dramatic) for visual breathing room.
        - Automated background variant cycling (default/alt/accent-subtle/gradient-subtle).
        - Entrance animation variety (fade-up/left/right, scale, blur, slide-up) cycling per section.
        - Section divider intelligence (line/gradient/glow styles based on theme).
        - Content layout variation (alignment, grid pattern, card style) for unique compositions.
        - Premium spacing computation with container width mapping.
    - **Enhanced Typography System** (`client/src/lib/design-tokens.ts`, `typography-provider.tsx`):
        - 57+ Google Fonts supported with intelligent weight loading.
        - 17 brand personality types with curated font pairings (bold, elegant, playful, minimal, tech, luxury, creative, professional, editorial, startup, saas, fintech, healthcare, eco, indie, enterprise, retro).
        - 24 style-based font pairings in the website renderer for theme matching.
    - **Design Bible v1.0 Compliance**: 90vh heroes, 64-96px headlines (weight 800+), 3+ background layers (FloatingOrb, GradientMesh, DotGrid), gradient overlays, 8px grid spacing, Bento Grid layouts, premium hover effects (8px lift + shadow), animated counters, glass-morphism effects.
    - **Design Personality System** (`client/src/components/website-templates/design-personality.tsx`):
        - React context providing 17+ personality profiles (bold, elegant, playful, minimal, tech, luxury, creative, professional, editorial, startup, saas, fintech, healthcare, eco, indie, enterprise, retro).
        - Maps style/theme/personality to specific visual treatments: buttonStyle (7 types: gradient-border/solid/outlined/pill/sharp/ghost/minimal), ctaButtonStyle (separate for primary CTAs), decorationStyle (geometric/organic/angular/dots/minimal/none), effectIntensity (high/medium/low/minimal), cardStyle (elevated/flat/bordered/glass), animationStyle (dynamic/smooth/subtle/minimal).
        - 10+ boolean flags: showFloatingOrbs, showDotGrid, showGlowLines, showNoiseTexture, showParallax, showHoverTilt, showMagneticButtons, showCountUpAnimation, showDecorativeSvgs.
        - DesignPersonalityProvider wraps all website content in WebsiteRenderer, populated from siteSettings (style, creativeThemeId, visualPersonality).
        - All 6 hero templates and 6 section templates conditionally render effects based on personality profile.
        - WebsiteHeader CTA, mobile CTA, logo fallback, and nav pills all adapt to personality styling.
    - **Hero Variants**: 6 variants (split, bold, editorial, minimal, cinematic, immersive) with personality-driven visual treatments. All heroes conditionally render AnimatedGradientBorder, FloatingOrbs, DotGrid, DecorativeCircles, GeometricPattern, AbstractBlob, NoiseTexture, MeshGradientBackground, ParallaxLayer, and GlowLine based on personality. CTA button styles (border-radius, background, color, border) adapt to ctaButtonStyle personality setting. Heavy decorative SVGs hidden on mobile (hidden md:block).
    - **Section Templates**: Features (Bento Grid, conditional HoverTilt/GeometricPattern), Services (alternating split, conditional AbstractBlob/GlowLine/FloatingOrbs), Testimonials (conditional AnimatedGradientBorder/HoverTilt/AbstractBlob/FloatingOrbs), Pricing (conditional AnimatedGradientBorder/HoverTilt/DecorativeCircles/FloatingOrbs), CTA (conditional MagneticElement/GlowLine/NoiseTexture), Stats (conditional CountUpAnimation/RadialGlow/GlowLine), Process (animated timeline), Contact (split layout), FAQ (sidebar + numbered), Team (animated avatars), Benefits (numbered alternating), Brand Story (gradient timeline), Case Studies (split cards), Comparison (gradient-highlighted table), Gallery (masonry-style), Story (editorial sticky sidebar), Trust Signals (gradient icon cards), Text (scroll-reveal).

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Pattern**: RESTful endpoints
- **Authentication**: Replit Auth (OpenID Connect) with PostgreSQL session storage

### Core Systems
- **Connector System**: Registry pattern for abstracting external API integrations with capability-based lookup and mock fallbacks.
- **Creative Theme Engine v4.0.0**: A world-class design system offering 24 distinctive themes with complete design systems (color palettes, shadows, typography, spacing, motion design, visual effects) and intelligent selection based on industry and tone.
- **Image Management System**: Handles user uploads, automates SEO-optimized alt text generation, integrates with stock photo services, and optimizes images via Cloudinary.
- **Workflow Engine**: Orchestrates multi-step generation processes with self-healing capabilities (automatic retries, workflow recovery). Non-critical steps are optional to ensure core content generation completes.
- **Smart AI Router**: Intelligently routes AI tasks to appropriate models with automatic fallback chains and retry logic.
- **Content Cache System**: Reduces API calls by caching generated content with hash-based invalidation.
- **Quality Engine**: Provides AI-powered quality evaluation across 8 dimensions, performs refinement passes, and enforces premium quality thresholds (e.g., minimum 75 score, hero minimum 80) by setting content status to "needs_review" if quality is below threshold.
- **Hero Image Field Convention**: Backend stores hero images as `backgroundImage`/`backgroundImageB64`; all 6 hero templates read both `data.image || data.backgroundImage` and `data.imageB64 || data.backgroundImageB64` for full compatibility.
- **Personality-Driven Design Pipeline**: Creative theme `personality` field (e.g., "bold-confident") is stored as `visualPersonality` in siteSettings, fed to frontend `DesignPersonalityProvider` which maps it to one of 17+ personality profiles affecting button styles, effects, decorations, and animations.
- **Industry Normalization**: Keyword-based matching maps compound industry names (e.g., "Healthcare / Wellness", "Technology / SaaS") to 14 primary categories for image sourcing and section queries.
- **Typography Dual Storage**: Both `fontFamily` and `bodyFont` fields stored in siteSettings for compatibility across different code paths.
- **Premium Design Standards System (v2.0.0)**: Enforces agency-level quality through specific requirements for navigation, hero sections, cards, typography, and color integration, validated by a 13-point premium compliance check.
- **White-Label Requirements**: Ensures no Replit branding is exposed, with hosting and build layers designed for future provider flexibility.
- **Website Content Quality**: Includes smart icon assignment, comprehensive image population, and industry-specific logo prompts.

## External Dependencies

### Database
- **PostgreSQL**: Primary database.
- **Drizzle ORM**: For database interaction.

### LaunchPax Engine (Multi-Model AI Orchestration)
- **LaunchPax Engine (DeepSeek)**: For cost-effective long-form content generation.
- **GPT-4o (OpenAI)**: For premium name, brand, and website content generation.
- **Claude 3.5 Sonnet (Anthropic)**: Alternative for long-form content generation.
- **DALL-E 3 (OpenAI)**: For AI image generation.
- **Stability AI**: For high-quality AI image generation.
- **Leonardo AI**: For stylized AI graphics.
- **Google Studio (Google Gemini)**: For advanced graphics generation.

### Stock Photography
- **Pexels**: For free stock photos.
- **Unsplash**: For premium stock photography.

### Payment Processing
- **Stripe**: For e-commerce functionality.

### Email Services
- **SendGrid**: For email delivery.

### SMS Services
- **Twilio**: For SMS notifications.

### Analytics
- **Google Analytics**: For website visitor and conversion tracking.

### Domain Services
- **Namecheap**: For domain availability checking and registration.

### Maps & Location
- **Google Maps**: For embedding business locations.

### Animations
- **Lottie**: For animated icons and graphics.

### CDN & Image Optimization
- **Cloudinary**: For image optimization and CDN.
- **Cloudflare**: For CDN, DNS, and edge deployment.

### Authentication
- **Replit Auth**: For OpenID Connect-based authentication.