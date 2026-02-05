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
- **Creative Theme Engine**: Automatically selects dramatic visual themes (8 unique themes) based on industry and tone, including design systems for colors, typography, hero archetypes, and photography.
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
- **Premium Design Standards System (v2.0.0)**: Central module (`server/services/premium-design-standards.ts`) enforcing agency-level quality via:
  - **Navigation**: Floating-pill style with glass morphism, hover animations, gradient CTA with shine effect
  - **Hero Sections**: 90vh minimum height, animated gradient orbs, pill-style badges, scroll indicators
  - **Cards**: 1.5rem border radius, 8px hover lift, premium shadows (0 20px 40px)
  - **Typography**: font-weight 800 for h1, -0.035em letter-spacing, antialiased rendering
  - **Colors**: Conditional application preserving valid dark colors, falling back to #0f172a/#64748b/#94a3b8
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