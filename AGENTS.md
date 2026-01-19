# GoAventura Development Guidelines for AI Agents

This document provides comprehensive guidelines for AI agents working on the GoAventura project to ensure consistency, security, and quality across all development work.

## 1. Build/Test Commands

### Development
```bash
npm run dev                    # Start development server on port 9002 with Turbopack
npm run genkit:dev            # Start Genkit AI development server
npm run genkit:watch          # Start Genkit with file watching
```

### Building & Production
```bash
npm run build                 # Build production bundle
npm run start                  # Start production server
npm run typecheck             # Run TypeScript type checking
npm run lint                   # Run ESLint validation
npm run security-test          # Run security tests (requires server running)
```

### Testing Commands
```bash
npm run security-test http://localhost:9002  # Full security audit
npm audit --audit-level=moderate             # Check for vulnerabilities
```

**Always run** `npm run typecheck` and `npm run lint` before committing code.

## 2. Code Style Guidelines

### TypeScript Standards
- Use **strict TypeScript** configuration (already enabled in tsconfig.json)
- Always define interfaces for complex objects (see `src/lib/types.ts`)
- Use proper type annotations for function parameters and return values
- Prefer `const` over `let` when possible
- Use `null` for missing values, not `undefined`

### React Component Patterns
- Use functional components with React hooks
- Follow the existing component structure from `src/components/ui/`
- Use `React.forwardRef` for components that need ref forwarding
- Implement proper TypeScript interfaces for props
- Use `cn()` utility for className merging (from `src/lib/utils.ts`)

### Naming Conventions
- **Files**: kebab-case for components (`hero-section.tsx`), camelCase for utilities (`security.ts`)
- **Components**: PascalCase (`HeroSection`, `ProductCard`)
- **Functions**: camelCase (`sanitizeString`, `validateFile`)
- **Constants**: SCREAMING_SNAKE_CASE for environment variables, camelCase for module constants
- **Interfaces**: PascalCase with descriptive names (`Product`, `BlogPost`)

### File Organization Examples
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Layout-specific components
│   └── icons/        # Icon components
├── lib/
│   ├── security.ts   # Security utilities
│   ├── types.ts      # TypeScript interfaces
│   └── utils.ts      # General utilities
├── app/
│   ├── api/          # API routes
│   ├── admin/        # Admin pages
│   └── (routes)/     # Public routes
```

## 3. Import/Export Rules

### Import Organization
1. **External libraries** (React, Next.js, third-party)
2. **Internal modules** (`@/lib/`, `@/components/`)
3. **Relative imports** (`./`, `../`)

```typescript
// ✅ Correct import order
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { contactFormSchema, sanitizeUserInput } from '@/lib/security';
import { Button } from '@/components/ui/button';
import { ProductCard } from './product-card';
```

### Import Path Rules
- **Use absolute imports** with `@/` prefix for internal modules
- **Never use relative imports** for modules outside the same directory
- **Consolidate related imports** from the same module

```typescript
// ✅ Use absolute imports
import { sanitizeString, sanitizeHTML } from '@/lib/security';

// ❌ Avoid relative imports for different directories
import { sanitizeString } from '../../../lib/security';
```

### Export Patterns
- Use named exports for utilities and multiple exports
- Use default export only for main component or functionality
- Group related exports together

```typescript
// ✅ Named exports for utilities
export const sanitizeString = (input: string): string => { /* ... */ };
export const sanitizeHTML = (html: string): string => { /* ... */ };

// ✅ Default export for main component
export default function HeroSection() { /* ... */ }
```

## 4. Error Handling Patterns

### Try-Catch Structure
```typescript
// ✅ Proper error handling with logging
export async function processRequest(data: any) {
  try {
    const result = await someAsyncOperation(data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Operation failed:', error);
    
    if (error instanceof ZodError) {
      return { 
        success: false, 
        error: 'Validation failed', 
        details: error.errors.map(e => e.message) 
      };
    }
    
    return { 
      success: false, 
      error: 'Internal server error' 
    };
  }
}
```

### API Error Responses
- Always use appropriate HTTP status codes
- Include error messages in JSON format
- Sanitize error messages for production
- Log detailed errors server-side only

```typescript
// ✅ API error response pattern
return NextResponse.json(
  { error: 'Validation failed', details: error.errors },
  { status: 400, headers: getSecurityHeaders() }
);
```

### User-Friendly Error Messages
- Display Spanish error messages for user-facing errors
- Use technical error messages for development logs
- Never expose sensitive information in error messages

## 5. Component Guidelines

### Component Structure
```typescript
// ✅ Standard component structure
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  children: React.ReactNode;
  // ... other props
}

export default function Component({ 
  className, 
  children, 
  ...props 
}: ComponentProps) {
  const [state, setState] = useState();

  return (
    <div className={cn('base-styles', className)} {...props}>
      {children}
    </div>
  );
}
```

### Props Guidelines
- Use TypeScript interfaces for all props
- Make optional props truly optional with `?`
- Provide default values where appropriate
- Use proper prop types for all props

### Hooks Usage
- Use hooks from `src/hooks/` for reusable logic
- Follow React hooks rules strictly
- Use `useCallback` and `useMemo` for performance optimization
- Custom hooks should be prefixed with `use-`

### Component File Naming
- **UI Components**: kebab-case (`button.tsx`, `input.tsx`)
- **Page Components**: kebab-case (`hero-section.tsx`, `product-card.tsx`)
- **Layout Components**: kebab-case (`header.tsx`, `footer.tsx`)

## 6. Database/API Patterns

### API Route Structure
```typescript
// ✅ Standard API route pattern
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeUserInput, getSecurityHeaders } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sanitizedData = sanitizeUserInput(body);
    
    // Validation and processing
    const result = await processData(sanitizedData);
    
    return NextResponse.json(
      { success: true, data: result },
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
```

### Async/Await Patterns
- Always use `async/await` for asynchronous operations
- Handle promises properly with try-catch blocks
- Use proper error boundaries
- Implement proper timeout handling

### Data Fetching
- Use the existing security patterns for all data operations
- Implement proper caching strategies
- Use rate limiting for API endpoints
- Validate all incoming data with Zod schemas

## 7. Security Best Practices

### Input Validation
- **Always sanitize user input** using functions from `src/lib/security.ts`
- Use Zod schemas for validation (patterns already defined)
- Never trust client-side validation only
- Implement server-side validation for all API endpoints

```typescript
// ✅ Input validation pattern
const validatedData = contactFormSchema.parse(sanitizedData);
```

### Authentication & Authorization
- Use JWT tokens for authentication
- Implement proper session management
- Use environment variables for secrets
- Never expose sensitive data in client-side code

### Security Headers
- Always use `getSecurityHeaders()` for API responses
- CSP is already configured in middleware
- Security headers are enforced in next.config.ts

### File Upload Security
- Validate file types using `validateFile()` from `src/lib/security.ts`
- Check file sizes and dimensions
- Never allow executable file uploads
- Use secure file storage practices

### Rate Limiting
- Implement rate limiting for all API endpoints
- Use the middleware patterns already established
- Log rate limit violations for monitoring

## 8. File Organization

### Directory Structure
```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── admin/           # Admin pages
│   ├── (routes)/        # Public routes with layouts
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components
│   └── icons/          # Icon components
├── lib/                # Utilities and configurations
│   ├── security.ts     # Security utilities
│   ├── types.ts        # TypeScript interfaces
│   ├── utils.ts        # General utilities
│   └── data/           # Static data files
├── hooks/              # Custom React hooks
├── ai/                 # Genkit AI functionality
└── middleware.ts       # Next.js middleware
```

### File Naming Rules
- **Components**: kebab-case with `.tsx` extension
- **Utilities**: camelCase with `.ts` extension
- **Types**: camelCase with `.ts` extension
- **API Routes**: `route.ts` in appropriate directory
- **Pages**: `page.tsx` for page components
- **Layouts**: `layout.tsx` for layout components

### Module Boundaries
- Keep components focused on single responsibilities
- Separate business logic from UI components
- Use the `lib/` directory for shared utilities
- Place type definitions in `lib/types.ts`

## 9. Performance Guidelines

### Optimization Techniques
- Use Next.js Image optimization for all images
- Implement proper lazy loading for components
- Use React.memo for expensive components
- Optimize bundle size with dynamic imports

```typescript
// ✅ Dynamic import example
const AdminDashboard = dynamic(() => import('./admin-dashboard'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});
```

### Bundle Analysis
- Use `npm run build` to analyze bundle size
- Check bundle analyzer output for large dependencies
- Remove unused dependencies
- Optimize imports to reduce bundle size

### Lazy Loading Patterns
- Use Next.js dynamic imports for admin components
- Implement code splitting for large features
- Use React.lazy() for route-based code splitting
- Load non-critical features on demand

### Caching Strategies
- Implement proper HTTP caching headers
- Use Next.js built-in caching for static assets
- Cache database queries where appropriate
- Use client-side caching for frequently accessed data

## 10. Git Workflow

### Commit Message Format
```
type(scope): description

Examples:
feat(auth): add JWT token validation
fix(security): implement XSS protection in contact form
refactor(components): extract button variants to separate file
docs(agents): update development guidelines
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes
- `test`: Adding or updating tests
- `chore`: Build process or dependency changes

### Branching Strategy
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: Feature development
- **fix/***: Bug fixes
- **hotfix/***: Critical production fixes

### PR Guidelines
- Ensure all tests pass before creating PR
- Include clear description of changes
- Reference relevant issues in PR description
- Keep PRs focused and reasonably sized
- Request review from at least one team member

### Pre-commit Requirements
Always run these commands before committing:
```bash
npm run typecheck    # Ensure TypeScript compilation
npm run lint         # Check code style
npm run build        # Verify build process
```

## Additional Guidelines

### Environment Variables
- Never commit `.env` files
- Use proper environment variable naming conventions
- Document all required environment variables
- Use `.env.example` for template

### Documentation
- Update documentation when changing APIs
- Include examples for complex functionality
- Document security considerations
- Keep README files current

### Testing Strategy
- Run security tests before deployment
- Test all API endpoints with proper validation
- Verify error handling works correctly
- Test file upload security

### Monitoring & Logging
- Use existing security logging patterns
- Log important events without exposing sensitive data
- Monitor performance in production
- Set up alerts for security events

---

**Important**: Always review existing code patterns before implementing new features. The security-first approach is critical for this project. When in doubt, refer to `src/lib/security.ts` for proper security patterns.