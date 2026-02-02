# LaunchPad AI - AI Business Builder Platform

## Overview

LaunchPad AI is an AI-powered business builder and growth engine platform. It provides a single dashboard that orchestrates multiple external APIs to help users launch businesses by generating names, domains, brand kits, website content, and graphics. The platform follows a Replit-style project architecture where each "Project" represents an isolated business being launched.

Key capabilities:
- Project-based business creation with isolated configurations
- AI-powered name and domain generation
- Brand kit generation (colors, fonts, messaging)
- Website content planning and generation
- Graphics asset creation
- Connector-based architecture for swappable external service integrations

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all database table definitions
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Authentication**: Replit Auth (OpenID Connect) with session storage in PostgreSQL

### Connector System (Core Abstraction)
The platform uses a **connector registry pattern** to abstract all external API integrations:
- All connectors implement a standard interface with `key`, `name`, `capabilities`, `isConfigured()`, `test()`, and `execute()` methods
- Connectors are registered in `server/connectors/index.ts`
- Registry provides capability-based lookup (e.g., find any connector that provides "name_generation")
- Mock connectors provide fallback demo data when real APIs are unavailable
- Current connectors: OpenAI (AI generation), Mock AI, Mock Domain checker

### Workflow Engine
- Located in `server/workflows/engine.ts`
- Orchestrates multi-step generation workflows (naming → domain check → brand kit → website → graphics)
- Uses connectors via capabilities, not direct API calls
- Tracks progress and status in `workflow_jobs` table
- Logs all activity to `activity_logs` table

### Project Architecture Pattern
Following Replit-style isolation:
- Each Project is an independent business configuration
- Content stored as structured JSON (not raw HTML)
- Projects have build states: draft → building → ready → error
- Template-based approach for website generation (to be expanded)

### White-Label Requirements
- Replit is used as internal infrastructure only
- No Replit branding appears in user-facing interfaces
- Hosting/build layers are abstracted for future provider swapping

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema defined in `shared/schema.ts`, migrations in `./migrations`
- **Session Storage**: PostgreSQL-backed sessions via `connect-pg-simple`

### AI Services
- **OpenAI API** (via Replit AI Integrations): Powers name generation, brand kit creation, content generation
- Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
- Falls back to mock connector when not configured

### Authentication
- **Replit Auth**: OpenID Connect authentication
- Environment variables: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`
- User data stored in `users` table, sessions in `sessions` table

### Planned Integrations (via Connector System)
- Domain registrars (GoDaddy, Namecheap, Cloudflare) for domain availability and purchase
- Image generation APIs for graphics
- Hosting providers for deployment (abstracted for future implementation)

### Development Tools
- **Vite**: Development server with HMR
- **TypeScript**: End-to-end type safety
- **Drizzle Kit**: Database schema management (`npm run db:push`)

## Recent Changes

### 2026-02-02: AI-Powered Section Editing System
- **Prompt-Based Section Refinement**: Users can click any website section and give natural language instructions to refine it
- **Edit Tab in Website Plan**: New "Edit" tab shows all sections with clickable cards for editing
- **SectionEditor Component** (`client/src/components/project/section-editor.tsx`):
  - Quick prompts per section type (hero, features, testimonials, etc.)
  - Custom instruction input for freeform refinement
  - Toast notifications for success/error feedback
  - Section-type-aware guidance for AI refinement
- **API Routes for Section Editing** (`server/routes.ts`):
  - POST `/api/projects/:id/sections/:sectionId/refine` - AI-powered section refinement
  - PATCH `/api/projects/:id/sections/:sectionId` - Direct section data updates
- **Storage Method**: `updateWebsiteContent()` for partial updates without full regeneration
- **OpenAI Connector**: `refine_section` action with section-type-specific guidance for optimal copy

### 2026-02-02: Advanced Agency-Quality Website Engine
- **Design Token System** (`client/src/lib/design-tokens.ts`):
  - Typography scales (12 sizes from xs to display)
  - Spacing system with section spacing presets
  - Shadow presets including premium and elevated variants
  - Color palettes (ocean, forest, sunset, midnight, earth, royal)
  - Font pairings for 8 brand personalities (bold, elegant, playful, minimal, tech, luxury, creative, professional)
  - Motion presets with Framer Motion configurations
- **Multiple Hero Archetypes** (`client/src/components/website-templates/heroes/`):
  - 6 distinct archetypes: editorial, split, immersive, cinematic, bold, minimal
  - HeroSelector component for intelligent archetype selection
  - Business type to archetype mapping (SaaS→split/bold, luxury→immersive/cinematic, etc.)
- **Asymmetric Layout Engine** (`client/src/components/website-templates/layouts/`):
  - AsymmetricGrid with patterns: 2-1, 1-2, 3-2, 2-3, featured, masonry, bento
  - AlternatingLayout for zigzag content sections
  - EditorialGrid with 12-column editorial layouts
- **Narrative/Story Section** (`client/src/components/website-templates/section-story.tsx`):
  - Editorial layout with sticky sidebar
  - Support for paragraphs, quotes, stats, and images
- **Typography Provider** (`client/src/components/website-templates/typography-provider.tsx`):
  - Dynamic Google Fonts loading based on brand personality
  - CSS custom properties for fonts (--font-heading, --font-body)
- **Signature Visual Moments** (`client/src/components/website-templates/signature-moments.tsx`):
  - LargeTypography with scroll-driven opacity/parallax
  - ParallaxDivider with animated gradient lines
  - AnimatedGradientBg with floating color orbs
  - FloatingElements, RevealOnScroll, TextReveal components
- **AI Prompt Upgrade**: Hero archetype selection logic in OpenAI connector

### 2026-02-02: Premium Website Template Upgrade
- **Award-Winning Quality**: All website sections upgraded to Awwwards-level premium styling
- **Framer Motion Animations**: Scroll-triggered animations with staggered reveals across all sections
- **Premium Section Components**:
  - Hero: 90vh height, animated gradients, floating decorative elements, display typography
  - Features: Bento grid layout with asymmetric sizing, glassmorphism cards
  - Testimonials: Large quote marks, profile cards, star ratings, staggered animations
  - CTA: Animated gradient backgrounds, floating elements
  - Services/Stats/Pricing: Premium styling with layered depth, shadows, hover effects
  - FAQ/Team/Contact: All upgraded with animations and glassmorphism effects
- **Premium Navigation**: Floating header with blur-on-scroll effect, gradient CTA button
- **Premium Footer**: Multi-column layout with social links, proper branding
- **AI Prompt Upgrades**: Elite conversion copywriter prompts for Apple/Stripe/Airbnb quality content
- **Image Size Fix**: Changed hero image generation from 1792x1024 to 1536x1024 (supported size)

### 2026-02-02: Website Publishing System Complete
- **Publishing to Live URLs**: Complete publish flow with /site/:projectId public route
- **Public Route Architecture**: /preview/:token (secure preview) vs /site/:projectId (published, isPublished required)
- **Frontend Routing Fix**: Public routes now outside auth gate for anonymous access
- **End-to-End Testing**: Full workflow verified (auth → project → names → brand → website → publish → live site)
- **All 15 Enhancement Tasks Complete**: Platform ready for production use

### 2026-02-02: Enhanced Website Template System
- **12 Section Types**: Comprehensive section components for professional websites:
  - hero, features, services, testimonials, team, stats, pricing, faq, cta, contact, text, gallery
  - All components in `client/src/components/website-templates/`
  - Null-safe data handling with `(section.data || {})` pattern
- **Website Renderer**: Central component that assembles sections with header/footer navigation
- **Preview Navigation**: Client-side page navigation using query parameters (`?page=slug`)
  - onNavigate callback intercepts internal links
  - URL updates without full page reload
  - Supports Home, About, Services, Contact pages
- **Secure Preview System**: Token-based access via `previewToken` field (UUID)
- **Public Preview Route**: `/preview/:token` accessible without authentication for iframe embedding
- **Preview Tab in Website Plan**: Live preview iframe with desktop/mobile toggle and "Open Preview" button
- **Href Sanitization**: `sanitizeHref()` function blocks javascript:/data:/vbscript: URLs
- **UI Guidelines**: All template components use hover-elevate utilities instead of custom hover states

### 2026-02-02: Workflow Execution Fixes
- **OpenAI Connector Hardening**: Changed to gpt-4o-mini model for all AI operations with simplified prompts and robust JSON parsing (try-catch around all JSON.parse calls)
- **Frontend Polling Fix**: Workflow status polling now only occurs when status === "running" (not for "pending" or "not_started")
- **Result Refetch Pattern**: All workflow components now use useEffect with useRef to detect workflow completion (running → completed) and automatically refetch results
- **Status Handling**: Backend returns "not_started" status when no workflow job exists, preventing infinite loading states

### Key Implementation Notes
- Workflow status endpoint returns `{status: "not_started", progress: 0}` when no job exists for a project/workflow type
- Frontend components track previous workflow status to detect completion transitions
- OpenAI responses are wrapped in try-catch with error logging for debugging
- All AI operations use response_format: { type: "json_object" } for structured output
- Website preview uses token-based access (websiteContents.previewToken) to prevent IDOR attacks
- Preview accessible at `/preview/:token` or embedded in Website tab iframe