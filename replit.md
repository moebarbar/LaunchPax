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