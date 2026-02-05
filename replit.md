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
    - **Global Style Editor**: Manages colors, typography (font pairing, heading/body fonts), and style presets.
    - **Editable Sections Panel**: Allows drag-based reordering, adding, deleting, and duplicating of website sections.
    - **Website Templates**: Offers 12 diverse section types with premium styling and Framer Motion animations.
    - **Responsive Design**: Mobile-first approach with progressive text scaling and responsive layouts.
    - **Signature Visual Moments**: Utilizes components like LargeTypography, ParallaxDivider, and AnimatedGradientBg for enhanced engagement.
    - **Techy Build Progress**: Displays terminal-style animated progress visualization for workflows.

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Pattern**: RESTful endpoints
- **Authentication**: Replit Auth (OpenID Connect) with PostgreSQL session storage

### Core Systems
- **Connector System**: A registry pattern for abstracting external API integrations. Connectors provide capability-based lookup and automatically fall back to mock connectors if primary AI services fail.
- **Image Management System**: Handles user uploads, auto-generates SEO-optimized alt text, integrates with stock photo services (Pexels, Unsplash), and enforces visual completeness with auto-filling missing images and optimization via Cloudinary.
- **Section Transitions**: Implements smooth visual transitions (gradient-fade, overlap, soft-merge, blur-blend) between website sections.
- **Workflow Engine**: Orchestrates multi-step generation processes (naming, brand, website, graphics) with self-healing capabilities (automatic retries, workflow recovery).
- **Smart AI Router**: Intelligently routes AI tasks to appropriate models (e.g., OpenAI for naming, DeepSeek for long-form content, DALL-E for images) with automatic fallback chains and retry logic.
- **Content Cache System**: Reduces API calls by caching generated content (naming, brand kits, website content) with hash-based invalidation.
- **Workflow Recovery**: Ensures workflows complete by tracking progress, auto-cleaning stuck jobs, and enforcing maximum workflow times.
- **Creativity Checklist**: Validates premium website elements, verifies hero archetypes, visual signatures, section variety, SEO fields, and font limits.
- **Quality Engine**: Provides AI-powered quality evaluation across 8 dimensions (e.g., overall, layout, typography) and performs up to 3 refinement passes to improve weak sections. It enforces premium quality thresholds and detects generic patterns and repetitive layouts.
- **Long-Form Page Blueprints**: Defines sophisticated section layouts for common page types (HOME, ABOUT, SERVICES, CONTACT) requiring 8-12+ sections.
- **Project Architecture**: Each project is an independent business configuration with isolated content (JSON) and build states (draft, building, ready, error).
- **Website Publishing System**: Supports publishing to live URLs and secure previews.
- **AI-Powered Section Editing**: Allows users to refine website sections using natural language prompts with section-type-aware guidance.
- **Website Enhancement Service**: Orchestrates integrations for premium website features, including AI hero images, multi-source stock photos, CDN optimization, analytics injection, maps integration, payment processing, contact forms, and animations.

### White-Label Requirements
- No Replit branding is exposed to end-users.
- Hosting/build layers are designed for future provider flexibility.

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
- **Stripe**: For e-commerce functionality (checkout, payment intents, subscriptions).

### Email Services
- **SendGrid**: For email delivery (contact forms, notifications).

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

## Recent Changes

### Color Contrast Enforcement System (Feb 2026)
- **Issue**: Light text on light backgrounds causing poor readability across website sections
- **Solution**: Implemented comprehensive solid color enforcement system
- **Schema Updates**: Added `headingColor` and `cardBackground` properties to SiteSettings interface
- **Professional Color Palettes**: Enhanced quality-engine with 7 industry-specific palettes (healthcare, dental, technology, professional, creative, food, default) including heading, text, and muted colors
- **Engine Integration**: Updated workflow engine to apply palette colors for headingColor, textColor, mutedTextColor, and cardBackground
- **Global CSS Enforcement**: Changed website-renderer to use `.website-renderer` class for global CSS that enforces solid colors on all h1-h6, paragraphs, and cards
- **Section Updates**: Updated section-features and section-services to use solid white backgrounds with inline CSS variable styles
- **Verified Colors**: headingColor=#0f172a, textColor=#1e293b, mutedTextColor=#475569, cardBackground=#ffffff, surfaceColor=#ffffff
- **Testing Verified**: All 4 tested previews (Healthcare, Food industries) passed with correct card backgrounds (rgb(255,255,255)) and text contrast

### Hero Image Rendering Fix (Feb 2026)
- **Issue**: Healthcare/dental websites were using "minimal" hero archetype which doesn't display images
- **Fix**: Updated hero archetype selection to use "split" for healthcare/dental/medical industries (image-supporting archetype)
- **Enhancement**: Updated hero-minimal to support images with dark overlay and white text when image is available
- **Contrast Fix**: Updated hero-split to use explicit dark text colors (text-gray-900, text-gray-600) instead of CSS variables to ensure readability on light backgrounds

### AI Logo Generation Fix (Feb 2026)
- **Issue**: Logo generation was failing silently - server started generation but logoUrl never saved
- **Root Cause**: OpenAI connector was using invalid model name "gpt-image-1" instead of "dall-e-3"
- **Fix**: Changed model to "dall-e-3" with quality="hd" and style="natural" for professional logo output
- **Response Handling**: Fixed upsertBrandKit to explicitly pass only valid fields (avoiding extra DB fields like id, createdAt)
- **Error Handling**: Added proper error response when logo URL is missing from AI provider response
- **Logging**: Enhanced logging throughout logo generation flow for debugging:
  - `[Logo Generation] Starting for project X, style: Y, model: Z`
  - `[Logo Generation] Result: {JSON}`
  - `[Logo Generation] Logo URL: <url>`
  - `[Logo Generation] Brand kit updated, logoUrl saved: <url>`
- **Testing Verified**: DALL-E 3 logo generation successfully creates and saves logos to brand kit

### Website Content Quality Improvements (Feb 2026)
- **Smart Icon Assignment**: Added intelligent icon selection based on content keywords across 20+ icon categories
  - Keywords mapped to semantic icons (e.g., "secure" → shield, "fast" → zap, "care" → heart)
  - Industry-specific icon preferences (healthcare, dental, tech, food, fitness, beauty, etc.)
  - Automatic variety enforcement - no icon repetition within sections
  - Conditional assignment - only replaces missing or generic icons, preserves curated choices
- **Comprehensive Image Population**: Enhanced fillItemImages() function with:
  - Placeholder detection helper (`isPlaceholderImage()`) that identifies filenames without URLs (e.g., "john.jpg")
  - Full coverage for all sections: team, testimonials, services (no cap), case-studies, gallery, features, benefits
  - Business-specific stock photo queries for each section type
- **Industry-Specific Logo Prompts**: Enhanced DALL-E 3 prompts with:
  - 15+ industry mappings to appropriate symbols, styles, and moods
  - Healthcare → medical cross/heart, Dental → tooth/smile, Tech → circuit/hexagon
  - Emphasis on "no text, icon only" for clean logos
  - Brand color integration from approved palette