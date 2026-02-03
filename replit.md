# LaunchPax - AI Business Builder Platform

## Overview

LaunchPax is an AI-powered platform designed to help users launch and grow businesses. It provides a single dashboard to orchestrate various external APIs for generating business essentials such as names, domains, brand kits, website content, and graphics. The platform uses a project-based architecture, where each "Project" represents an isolated business venture.

Key capabilities include:
- Project-based business creation with isolated configurations
- AI-powered generation of business names, domains, brand assets, and website content
- Connector-based architecture for flexible integration with external services
- Comprehensive workflow engine for multi-step generation processes

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
- **Connector System**: A registry pattern abstracts external API integrations. Connectors implement a standard interface and are registered in `server/connectors/index.ts`. They provide capability-based lookup (e.g., "name_generation") and support mock connectors for fallback.
- **Workflow Engine**: Located in `server/workflows/engine.ts`, it orchestrates multi-step generation workflows (naming, brand, website, graphics) using connectors based on capabilities. It tracks progress and logs activity.
- **Quality Engine**: Located in `server/workflows/quality-engine.ts`, it provides AI-powered quality evaluation and multi-pass refinement:
    - Evaluates website quality across 7 dimensions (overall, layout, typography, creativity, heroImpact, contentQuality, visualDepth)
    - Runs up to 3 refinement passes to auto-improve weak sections
    - Enforces quality gates (minimum 70 overall score, 85 for hero sections)
    - Detects generic patterns and template-looking content
    - Provides comprehensive error handling with skipped/error flags for graceful degradation
    - Stores quality reports in activity logs for transparency
- **Project Architecture**: Each project is an independent business configuration with an isolated content structure (structured JSON) and build states (draft, building, ready, error).
- **Website Publishing System**: Supports publishing to live URLs (`/site/:projectId`) and secure previews (`/preview/:token`).
- **AI-Powered Section Editing**: Allows users to refine website sections using natural language prompts, with section-type-aware guidance and dedicated API routes for refinement and direct data updates.

### White-Label Requirements
- Replit is used solely as internal infrastructure.
- No Replit branding is exposed to end-users.
- Hosting/build layers are designed for future provider flexibility.

## External Dependencies

### Database
- **PostgreSQL**: Primary database.
- **Drizzle ORM**: Used for database schema definition and interaction.

### LaunchPax Engine (Multi-Model AI Orchestration)
The LaunchPax Engine combines multiple premium AI models for best-in-class results:
- **GPT-4o (OpenAI)**: Premium AI generation for names, brands, and website content. Requires `OPENAI_API_KEY`.
- **Claude 3.5 Sonnet (Anthropic)**: Long-form content generation, blog posts, detailed copy. Requires `ANTHROPIC_API_KEY`.
- **Nano Banana Pro (Google Gemini)**: Advanced graphics generation for logos, hero images, marketing assets. Requires `GOOGLE_AI_API_KEY`.
- **Mock AI Connector**: Fallback for AI services when API keys are not configured.

### Other Services
- **Pexels**: Stock photography for website imagery. Requires `PEXELS_API_KEY`.

### Authentication
- **Replit Auth**: OpenID Connect-based authentication.

### Planned Integrations (via Connector System)
- **Domain Registrars**: For domain availability checks and purchases (e.g., GoDaddy, Namecheap).
- **Hosting Providers**: For website deployment.