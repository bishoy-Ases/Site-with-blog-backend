# Ases Kahraba - Electrical Services Website

## Overview

This is a bilingual (Arabic/English) landing page website for "Ases Kahraba" (أسس كهربا), an Egyptian electrical services company specializing in professional electrical work including installation, finishing, low-current systems, and smart home solutions. The application is a full-stack TypeScript project with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with HMR support
- **Internationalization**: Custom i18n implementation supporting Arabic (RTL) and English (LTR)
- **Theme**: Dark/light mode toggle with localStorage persistence

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for development
- **API Pattern**: RESTful API with `/api` prefix convention
- **Build**: esbuild for production bundling with selective dependency bundling for cold start optimization

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for shared types between frontend and backend
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Current Storage**: In-memory storage implementation (`MemStorage` class) with interface ready for database migration

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components (shadcn/ui)
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities, i18n, query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data storage interface
│   └── vite.ts       # Vite dev server integration
├── shared/           # Shared code between frontend/backend
│   └── schema.ts     # Drizzle schema definitions
└── migrations/       # Database migrations (Drizzle Kit)
```

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migration tool (`npm run db:push`)

### UI Framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment

### Fonts
- Google Fonts: Inter, DM Sans, Architects Daughter, Fira Code, Geist Mono (loaded via CDN)

## Brand Colors
- **Primary (Dark Blue)**: #1d3c5c (HSL: 210 51% 24%)
- **Accent (Orange)**: #f5a623 (HSL: 40 91% 55%)
- **Background (Cream)**: #f9f7f3 (HSL: 45 30% 97%)

## Website Sections
1. **Hero** - Main tagline with CTA buttons
2. **About Us** - Company description and 12+ years experience
3. **Services** - 6 service cards (Electrical infrastructure, Distribution boards, Load calculation, Low current systems, Smart home, Testing & reports)
4. **Projects** - Portfolio section with placeholder projects
5. **Why Choose Us** - 6 key differentiators
6. **Blog** - Articles and tips section with recent posts preview
7. **Contact** - Phone, email, location with WhatsApp integration

## Blog System
- **Blog Listing Page**: `/blog` - Shows all published articles with bilingual titles/excerpts
- **Blog Post Page**: `/blog/:slug` - Individual article view with full content
- **Admin Panel**: `/admin` - Add, edit, delete blog posts with bilingual content
- **Database**: PostgreSQL with blog_posts table storing Arabic/English content
- **Features**: Published/draft status, image URLs, SEO-friendly slugs

## Internationalization
- **Languages**: Arabic (default, RTL) and English (LTR)
- **Language Toggle**: Persists preference in localStorage
- **Translation File**: `client/src/lib/i18n.ts`