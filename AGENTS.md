# Guías de Desarrollo GoAventura para Agentes de IA

Este documento proporciona guías para agentes de IA que trabajan en el proyecto GoAventura.

## 1. Comandos de Build/Test

### Desarrollo
```bash
npm run dev                    # Iniciar servidor dev en puerto 9002 con Turbopack
npm run genkit:dev            # Iniciar servidor de desarrollo Genkit AI
npm run genkit:watch          # Genkit con monitoreo de archivos
```

### Building y Producción
```bash
npm run build                 # Build de producción
npm run start                 # Iniciar servidor de producción
npm run typecheck             # Verificación de tipos TypeScript
npm run lint                  # Validación ESLint
npm run security-test http://localhost:9002  # Auditoría seguridad (requiere servidor)
npm audit --audit-level=moderate             # Verificar vulnerabilidades
```

**Siempre ejecutar** `npm run typecheck` y `npm run lint` antes de hacer commit.

## 2. Estándares de Código

### TypeScript
- Usar **TypeScript strict** (habilitado en tsconfig.json)
- Definir interfaces para objetos complejos (ver `src/lib/types.ts`)
- Usar anotaciones de tipo para parámetros y retornos
- Preferir `const` sobre `let`
- Usar `null` para valores faltantes, no `undefined`

### Componentes React
- Usar componentes funcionales con React hooks
- Usar `React.forwardRef` para componentes que necesitan ref forwarding
- Definir props con interfaces TypeScript
- Usar utilería `cn()` para combinar classNames (de `src/lib/utils.ts`)

### Convenciones de Nombres
- **Archivos**: kebab-case (`hero-section.tsx`), camelCase (`security.ts`)
- **Componentes**: PascalCase (`HeroSection`)
- **Funciones**: camelCase (`sanitizeString`)
- **Interfaces**: PascalCase (`Product`, `BlogPost`)
- **Constantes**: SCREAMING_SNAKE_CASE para vars de entorno

## 3. Reglas de Import/Export

```typescript
// Orden: External → Internal (@/) → Relative
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { contactFormSchema, sanitizeUserInput } from '@/lib/security';
import { Button } from '@/components/ui/button';
import { ProductCard } from './product-card';

// Usar imports absolutos con prefijo @/
// Default export solo para componente principal
export default function HeroSection() { }
export const sanitizeString = (input: string): string => { };
```

### Optimización de Imports (Vercel)
- **Evitar barrel files**: Importar directamente, no de archivos índice
- Importar iconos de ruta específica: `import Check from 'lucide-react/dist/esm/icons/check'`
- Usar `next/dynamic` para componentes pesados

## 4. Optimización de Rendimiento

### Eliminar Waterfalls (CRÍTICO)
```typescript
// ❌ Secuencial: 3 await secuenciales
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()

// ✅ Paralelo: Promise.all() para operaciones independientes
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])

// ✅ Defer await: mover await solo donde se necesita
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) return { skipped: true }
  const userData = await fetchUserData(userId) // Solo aquí
  return processUserData(userData)
}
```

### Componentes Server (RSC)
- Usar `React.cache()` para deduplicar dentro de una	request
- Estructurar componentes para fetching paralelo
- Usar `after()` para operaciones no-bloqueantes

### Re-render Optimization
- **Estado derivado**: Calcular durante render, no en useEffect
```typescript
// ❌
const [fullName, setFullName] = useState('')
useEffect(() => { setFullName(firstName + ' ' + lastName) }, [firstName, lastName])

// ✅
const fullName = firstName + ' ' + lastName
```

- **Functional setState**: Usar función para actualizar estado
```typescript
// ✅ Estable, sin stale closures
setItems(curr => [...curr, ...newItems])
```

- **useMemo**: Solo para expresiones complejas, no primitivas simples

### Suspense y Rendering
- Usar `<Suspense>` para mostrar UI mientras carga data
- Usar ternary `? :` en lugar de `&&` para evitar renderizar "0"
- Usar `useTransition` para estados de carga

```tsx
// ✅ Suspense para streaming
function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <DataDisplay />
      </Suspense>
      <Footer />
    </div>
  )
}
```

## 5. Manejo de Errores

```typescript
export async function processRequest(data: any) {
  try {
    const result = await someAsyncOperation(data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Operation failed:', error);
    if (error instanceof ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors };
    }
    return { success: false, error: 'Internal server error' };
  }
}
```

- Usar códigos de estado HTTP apropiados
- Sanitizar mensajes de error para producción
- Usar español para errores visibles al usuario

## 6. Estructura de Componentes

```typescript
interface ComponentProps {
  className?: string;
  children: React.ReactNode;
}

export default function Component({ className, children, ...props }: ComponentProps) {
  const [state, setState] = useState<string>('');

  return (
    <div className={cn('base-styles', className)} {...props}>
      {children}
    </div>
  );
}
```

## 7. Rutas API

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeUserInput, getSecurityHeaders } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sanitizedData = sanitizeUserInput(body);
    const result = await processData(sanitizedData);
    return NextResponse.json({ success: true, data: result }, { headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: getSecurityHeaders() });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: { ...getSecurityHeaders(), 'Access-Control-Allow-Methods': 'POST, OPTIONS' } });
}
```

## 8. Mejores Prácticas de Seguridad

- **Siempre sanitizar input** usando funciones de `src/lib/security.ts`
- Usar esquemas Zod para validación
- Nunca confiar solo en validación del cliente
- Usar `getSecurityHeaders()` para todas las respuestas API
- Validar tipos de archivo con `validateFile()` de `src/lib/security.ts`
- Implementar rate limiting para endpoints API

## 9. Estructura de Directorios

```
src/
├── app/              # Next.js App Router (api/, admin/, (routes)/)
├── components/       # Componentes React (ui/, layout/, icons/)
├── lib/              # Utilerías (security.ts, types.ts, utils.ts, data/)
├── hooks/            # React hooks personalizados
└── ai/               # Funcionalidad Genkit AI
```

### Nombres de Archivos
- **Componentes**: kebab-case `.tsx` (`button.tsx`)
- **Utilerías/Types**: camelCase `.ts` (`security.ts`)
- **Rutas API**: `route.ts`
- **Páginas**: `page.tsx`
- **Layouts**: `layout.tsx`

## 10. Pre-commit Checklist

```bash
npm run typecheck    # Compilación TypeScript
npm run lint         # Estilo de código
npm run build        # Verificar build
```

## 11. Auditoría UI/UX

### Web Interface Guidelines
- Usar skill `web-design-guidelines` para auditar componentes
- Revisar: accesibilidad, estados focus, formularios, animaciones, tipografía
- Reglas clave:
  - Botones icono necesitan `aria-label`
  - Controles formulario necesitan `<label>` o `aria-label`
  - Elementos interactivos necesitan keyboard handlers
  - Usar `<button>` para acciones, `<a>`/`<Link>` para navegación
  - Imágenes necesitan `alt` y dimensiones explícitas
  - Respetar `prefers-reduced-motion`
  - Estados hover/focus visibles
  - No usar `outline: none` sin replacements

### Comandos de Auditoría
```bash
# Auditar componentes específicos
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines
# Luego ejecutar revisión manual usando las guidelines
```

## 12. Git Workflow

```
type(scope): descripción

Ejemplos:
feat(auth): add JWT token validation
fix(security): implement XSS protection in contact form
```

- Tipos de commit: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

---

**Importante**: 
- Revisar patrones de código existentes antes de implementar nuevas características
- Referirse a `src/lib/security.ts` para patrones de seguridad
- Aplicar reglas de rendimiento de Vercel para optimizar React/Next.js
