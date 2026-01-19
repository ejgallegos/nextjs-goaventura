# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15 travel agency website for "Go aventura" built with TypeScript, React 18, and Tailwind CSS. The site features excursions, transfers, accommodations, blog posts, and promotions for a tourism business in Villa Unión del Talampaya, La Rioja, Argentina.

## Development Commands

### Core Development
```bash
# Development server (runs on port 9002 with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

### AI Development (Genkit)
```bash
# Start Genkit development server
npm run genkit:dev

# Start Genkit with file watching
npm run genkit:watch
```

### Docker
```bash
# Build Docker image
docker build -t nextjs-goaventura .

# Run container
docker run -p 3000:3000 nextjs-goaventura
```

## Architecture Overview

### Application Structure

**Next.js App Router** (`src/app/`):
- Uses Next.js 15 App Router with TypeScript
- Server components by default, client components marked with `"use client"`
- All routes follow the App Router convention (`page.tsx`, `layout.tsx`)
- Main routes: `/`, `/viajes`, `/alojamientos`, `/blog`, `/contacto`, `/nosotros`, `/faq`, `/promociones`
- Protected admin routes under `/admin` with Firebase authentication

### Data Management System

**JSON-based Content Storage**:
- All content is stored in JSON files in `public/data/`:
  - `products.json` - Excursions and transfers
  - `blog-posts.json` - Blog articles
  - `promotions.json` - Special promotion packages
  - `featured-accommodation.json` - Featured accommodation card
  - `slides.json` - Hero slider content
  - `statistics.json` - Product view/inquiry statistics

**Data Layer** (`src/lib/data/`):
- Server-side data functions using `'use server'` directive
- Each data file has a corresponding TypeScript module
- Functions initialize JSON files from mock data if they don't exist
- Pattern: `get{DataType}()` and `save{DataType}()` functions
- Example: `getProducts()`, `saveProducts()` for products

**Admin Interface**:
- Protected by Firebase Auth (`src/app/admin/layout.tsx`)
- CRUD interfaces for all content types
- Uses TanStack Table for data management
- Admin sections: Viajes (trips), Blog, Promociones, Slider, Alojamiento Destacado, Estadísticas

### Core Technologies

**Styling**:
- Tailwind CSS with custom theme in `tailwind.config.ts`
- CSS variables defined in `src/app/globals.css` for light/dark mode
- Custom fonts: Roboto (body) and Montserrat (headlines)
- shadcn/ui components in `src/components/ui/`
- Dark mode support via `next-themes`

**UI Components**:
- Radix UI primitives for accessibility
- Custom components in `src/components/`
- Layout components: `Header`, `Footer`, `NavLink`
- Feature components: `ProductCard`, `HeroSection`, `ImageSlider`, etc.

**AI Integration** (`src/ai/`):
- Google Genkit for AI features
- Gemini 2.0 Flash model configured in `src/ai/genkit.ts`
- Flows in `src/ai/flows/` (e.g., `enhance-summary.ts`)
- Development entry point: `src/ai/dev.ts`

**Firebase**:
- Authentication for admin access
- Configuration in `src/lib/firebase.ts`
- Project: `goaventura-web`

### Type System

**Core Types** (`src/lib/types.ts`):
- `Product` - Excursions and transfers with status, featured flag, gallery
- `BlogPost` - Blog articles with markdown content
- `Promotion` - Special packages with optional accommodation info
- `HeroSlide` - Hero carousel slides
- `FeaturedAccommodation` - Featured accommodation card
- `Testimonial` - Customer testimonials
- All content types have `status: 'draft' | 'published' | 'archived'`

### Routing Conventions

**Public Routes**:
- `/` - Home page with featured content
- `/viajes` - All trips (excursions/transfers)
- `/viajes/[slug]` - Individual trip details
- `/blog` - Blog listing
- `/blog/[slug]` - Individual blog post
- `/promociones/[slug]` - Promotion details
- `/alojamientos` - Accommodations page
- `/contacto` - Contact form with reCAPTCHA
- `/login` - Admin login

**Admin Routes** (protected):
- `/admin` - Dashboard with all admin sections
- `/admin/viajes` - Manage trips
- `/admin/blog` - Manage blog posts
- `/admin/promociones` - Manage promotions
- `/admin/slider` - Manage hero slider
- `/admin/alojamiento-destacado/editor` - Edit featured accommodation
- `/admin/estadisticas` - View statistics

### Important Patterns

**Path Aliases**:
- `@/*` maps to `src/*` (configured in `tsconfig.json`)

**Environment Variables**:
- `NEXT_PUBLIC_SITE_URL` - Site URL for SEO/metadata
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA v3 key
- Firebase config is hardcoded in `src/lib/firebase.ts`

**Image Handling**:
- Next.js Image component used throughout
- Remote pattern configured for `placehold.co`
- `imageHint` field in types for AI-generated placeholder descriptions
- Product galleries stored in `imageGallery` array

**SEO & Metadata**:
- Comprehensive metadata in `src/app/layout.tsx`
- Includes OpenGraph, Twitter cards, and JSON-LD structured data
- Configured for Spanish language (`es-AR`)
- Travel agency schema markup

**Standalone Build**:
- `next.config.ts` configured with `output: 'standalone'`
- TypeScript and ESLint errors ignored during build
- Optimized for Docker deployment

## Development Notes

### When Working with Content
- Content changes should modify JSON files in `public/data/`
- Use the admin interface pattern when adding new CRUD functionality
- All content types should have `status` field for draft/published workflow
- Featured items use `isFeatured` boolean and optional `featuredOrder` number

### When Adding New Routes
- Follow Next.js App Router conventions
- Use `page.tsx` for route components
- Use `layout.tsx` for shared layouts
- Protected routes should wrap content with auth check

### When Creating Components
- UI primitives go in `src/components/ui/`
- Feature components go in `src/components/`
- Use TypeScript interfaces from `src/lib/types.ts`
- Follow the existing pattern of client vs server components

### When Working with AI Features
- AI flows are defined in `src/ai/flows/`
- Use Genkit's `defineFlow` and `definePrompt` patterns
- Input/output schemas use Zod validation
- Functions should be exported as server actions

### Styling Guidelines
- Use Tailwind utility classes
- Reference theme colors via CSS variables (e.g., `bg-primary`, `text-foreground`)
- Custom fonts: `font-body` (Roboto), `font-headline` (Montserrat)
- Maintain dark mode compatibility using HSL color variables

### Data Fetching
- Use server actions (`'use server'`) for data operations
- Client components fetch data with `useEffect` and state
- Initialize JSON files on first access if they don't exist
- Fallback to mock data if JSON reading fails
