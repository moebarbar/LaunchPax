# LaunchPax - AI Business Builder Platform

LaunchPax is an AI-powered platform that helps users launch and grow businesses efficiently. It provides a centralized dashboard to generate essential business assets including names, domains, brand kits, website content, and graphics — all powered by intelligent AI orchestration.

## What It Does

- **AI-Powered Website Generation** — Creates complete, premium, agency-quality websites with award-winning designs including images, icons, colors, typography, and decorative elements
- **Brand Kit Creation** — Generates cohesive brand identities with color palettes, typography pairings, and visual styles tailored to your industry
- **Domain Management** — Check domain availability and register domains directly from the platform
- **Multi-Model AI Engine** — Intelligently routes tasks across multiple AI providers (OpenAI, DeepSeek, Stability AI, Leonardo AI) for optimal results
- **Stock Photo Integration** — Automatically sources and optimizes images from Pexels and Unsplash with Cloudinary CDN delivery
- **20+ Website Section Types** — Features, testimonials, pricing, team, FAQ, stats, services, gallery, process, case studies, and more
- **17 Design Personalities** — From bold and elegant to minimal and retro, each with curated font pairings and visual treatments
- **24 Creative Themes** — Complete design systems with color palettes, shadows, typography, spacing, and motion design
- **Responsive Design** — Mobile-first approach with progressive text scaling and responsive layouts
- **Quality Engine** — AI-powered quality evaluation across 8 dimensions with automatic refinement

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Express.js, TypeScript, PostgreSQL, Drizzle ORM
- **AI**: OpenAI GPT-4o, DeepSeek, DALL-E 3, Stability AI, Leonardo AI
- **Infrastructure**: Cloudinary (CDN/images), Cloudflare, Pexels, Unsplash
- **Auth**: Replit Auth (OpenID Connect)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example` or configure secrets)
4. Start the development server: `npm run dev`

## Project Structure

```
client/               # React frontend
  src/
    components/       # UI components and website templates
    pages/            # Application pages
    lib/              # Utilities, design tokens, layout intelligence
server/               # Express backend
  services/           # AI, image, and content services
  workflows/          # Multi-step generation engine
  connectors/         # External API integrations
shared/               # Shared types and schemas
```

## License

All rights reserved.
