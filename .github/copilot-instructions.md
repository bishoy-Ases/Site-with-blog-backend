# Ases Kahraba - AI Coding Agent Instructions

## Project Overview
This is a bilingual (Arabic/English) commercial website for "Ases Kahraba", an Egyptian electrical services company. Full-stack TypeScript application with React frontend and Express backend, using PostgreSQL database.

## Architecture
- **Frontend**: React 18 + Vite, Wouter routing, TanStack React Query, shadcn/ui components, Tailwind CSS
- **Backend**: Express.js + TypeScript, REST API with `/api` prefix, Drizzle ORM
- **Database**: PostgreSQL with shared schema in `shared/schema.ts`
- **Auth**: Replit-based authentication for admin panel access
- **Internationalization**: Custom i18n supporting Arabic (RTL) and English (LTR)

## Key Directories & Files
- `client/src/` - React frontend with pages, components, hooks, lib utilities
- `server/` - Express backend with routes, storage, auth integrations
- `shared/schema.ts` - Drizzle database schema and Zod validation types
- `replit.md` - Comprehensive project documentation

## Development Workflow
- **Start dev server**: `npm run dev` (uses tsx for hot-reload)
- **Build production**: `npm run build` (custom esbuild + Vite build)
- **Database migrations**: `npm run db:push` (Drizzle Kit)
- **Type checking**: `npm run check` (tsc)

## Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

## Bilingual Content Pattern
All user-facing content uses separate Arabic/English fields:
```typescript
{
  titleAr: "العنوان بالعربية",
  titleEn: "Title in English",
  contentAr: "المحتوى بالعربية",
  contentEn: "Content in English"
}
```

## API Patterns
- RESTful endpoints under `/api` prefix
- Admin routes protected with `isAuthenticated` middleware
- Request/response logging middleware captures API calls
- Zod validation on all inputs with detailed error messages

## Component Patterns
- shadcn/ui components in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/` (use-seo, use-analytics, use-mobile)
- Language/direction detection via `getDirection()` from i18n
- Theme persistence in localStorage

## Database Operations
- Storage interface in `server/storage.ts` with DatabaseStorage implementation
- Drizzle queries using `eq`, `desc` operators
- Schema validation via drizzle-zod generated types

## Internationalization
- Language toggle persists preference in localStorage
- Direction automatically switches between RTL (Arabic) and LTR (English)
- All translations in `client/src/lib/i18n.ts`

## Admin Features
- Blog post CRUD operations
- Editable site content sections
- Protected routes requiring authentication
- Bilingual content management

## Build Optimization
- Selective server dependency bundling for cold start performance
- Vite for client build with React plugin
- esbuild for server bundling in production