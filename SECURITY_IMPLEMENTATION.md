# GoAventura Security Implementation Documentation

## 📋 Overview

This document provides a comprehensive overview of the security implementation for the GoAventura project. The security measures implemented address critical vulnerabilities while maintaining excellent performance and user experience.

## 🛡️ Security Layers

### 1. Application Layer Security

#### 1.1 Input Validation and Sanitization
- **Location**: `src/lib/security.ts`
- **Features**:
  - Zod schema validation for all user inputs
  - HTML sanitization using DOMPurify
  - SQL injection prevention
  - NoSQL injection protection
  - File upload validation with type and size restrictions

#### 1.2 XSS Protection
- **Location**: `src/components/ui/safe-html.tsx`
- **Features**:
  - Safe HTML rendering component with strict CSP
  - Customizable allowed tags and attributes
  - Memoized sanitization for performance
  - Higher-order component wrapper for existing components

#### 1.3 Authentication & Authorization
- **Location**: `src/lib/auth-rbac.ts`, `src/lib/firebase-admin.ts`
- **Features**:
  - Role-based access control (RBAC)
  - Firebase Admin SDK for secure server-side operations
  - Custom claims for user roles
  - JWT token verification
  - Session management

### 2. Network Layer Security

#### 2.1 Security Middleware
- **Location**: `middleware.ts`
- **Features**:
  - Comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.)
  - Rate limiting with IP-based tracking
  - CSRF protection for API routes
  - CORS configuration
  - Request validation

#### 2.2 API Route Security
- **Location**: `src/app/api/`
- **Features**:
  - Protected admin endpoints
  - Rate limiting per endpoint type
  - reCAPTCHA integration
  - Secure email handling
  - Input sanitization

### 3. Data Layer Security

#### 3.1 Firestore Security Rules
- **Location**: `firestore.rules`
- **Features**:
  - Role-based document access
  - Input validation at database level
  - Malicious content detection
  - User ownership verification
  - Comprehensive read/write restrictions

#### 3.2 Storage Security Rules
- **Location**: `storage.rules`
- **Features**:
  - File type validation
  - Size restrictions
  - Path-based access control
  - Malicious file name filtering
  - Public vs private file separation

## 🔧 Key Security Components

### SafeHTML Component
```typescript
import { SafeHTML } from '@/components/ui/safe-html';

// Usage
<SafeHTML 
  html={userContent} 
  tagName="div"
  allowedTags={['p', 'strong', 'em']}
  className="content-wrapper"
/>
```

### Security Validation
```typescript
import { contactFormSchema, sanitizeUserInput } from '@/lib/security';

// Validate and sanitize form data
const validatedData = contactFormSchema.parse(sanitizedInput);
```

### Authentication Middleware
```typescript
import { authenticateRequest, requirePermission } from '@/lib/auth-rbac';

// Protect API routes
const auth = await authenticateRequest(request);
if (!auth.user?.permissions.includes(Permission.WRITE_CONTENT)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

## 📊 Security Headers Implemented

| Header | Value | Purpose |
|--------|--------|---------|
| Content-Security-Policy | Dynamic | XSS protection |
| X-Frame-Options | DENY | Clickjacking protection |
| X-Content-Type-Options | nosniff | MIME type sniffing prevention |
| X-XSS-Protection | 1; mode=block | Legacy XSS protection |
| Referrer-Policy | strict-origin-when-cross-origin | Referrer control |
| Strict-Transport-Security | max-age=31536000; preload | HTTPS enforcement |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Feature access control |

## 🚦 Rate Limiting Configuration

### Default Rate Limits
- **General API**: 100 requests per 15 minutes
- **Contact Form**: 5 requests per 15 minutes
- **Login Attempts**: 5 attempts per 15 minutes
- **Password Reset**: 3 attempts per 15 minutes

### Implementation
```typescript
// In middleware.ts
const rateLimit = new Map();

function rateLimitMiddleware(request: NextRequest): NextResponse | null {
  const ip = getClientIP(request);
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;
  
  // Check and enforce rate limits
  const entry = rateLimit.get(ip);
  if (entry && entry.count >= maxRequests && now < entry.resetTime) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString() }
    });
  }
  // Update rate limit tracking...
}
```

## 🔐 Authentication Flow

### 1. User Registration/Login
```typescript
// Firebase Auth with custom claims
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const token = await userCredential.user.getIdToken();

// Add custom claims for role-based access
await admin.auth().setCustomUserClaims(uid, { role: 'editor' });
```

### 2. API Route Protection
```typescript
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  
  // Proceed with authenticated request
  return NextResponse.json({ data: 'protected content' });
}
```

### 3. Role-Based Access Control
```typescript
// Role hierarchy
enum UserRole {
  ADMIN = 'admin',      // Full access
  EDITOR = 'editor',    // Content management
  VIEWER = 'viewer'     // Read-only access
}

// Permission mapping
const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    Permission.READ_CONTENT,
    Permission.WRITE_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.MANAGE_USERS,
    Permission.VIEW_ANALYTICS
  ],
  // ... other roles
};
```

## 📁 File Upload Security

### Validation Rules
- **Allowed Types**: JPEG, PNG, WebP, PDF
- **Max Size**: 5MB (general), 2MB (images), 10MB (documents)
- **File Name Validation**: Alphanumeric with dots, hyphens, underscores only
- **Malicious File Detection**: Blocks executables, scripts, and potentially dangerous files

### Implementation Example
```typescript
import { validateFile } from '@/lib/security';

function handleFileUpload(file: File) {
  const validation = validateFile(file, {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
  
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // Process file upload...
}
```

## 🔍 Content Security

### HTML Sanitization
```typescript
import { sanitizeHTML } from '@/lib/security';

// Sanitize user-generated content
const cleanContent = sanitizeHTML(userInput, {
  allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
  allowedAttributes: ['href', 'title']
});
```

### Database-Level Protection
```javascript
// Firestore rules example
function noMaliciousContent(text) {
  return !text.matches('.*<script.*>.*</script>.*') &&
         !text.matches('.*javascript:.*') &&
         !text.matches('.*on\\w+\\s*=.*');
}

match /blogPosts/{postId} {
  allow create: if isEditor() &&
                   noMaliciousContent(request.resource.data.title) &&
                   noMaliciousContent(request.resource.data.content);
}
```

## 📝 Security Testing

### Automated Testing Script
- **Location**: `scripts/security-test.sh`
- **Features**:
  - Security headers verification
  - XSS protection testing
  - SQL injection prevention checks
  - Rate limiting validation
  - CORS configuration testing
  - Authentication bypass attempts
  - Directory traversal testing
  - File upload security checks

### Running Security Tests
```bash
# Test local development
npm run security-test

# Test production
./scripts/security-test.sh https://goaventura.com.ar

# Custom target
./scripts/security-test.sh http://localhost:9002
```

## 🚀 Deployment Security

### Environment Variables
- **Template**: `.env.example`
- **Production**: `.env.local` (never committed)
- **Key Variables**:
  - `JWT_SECRET`: Secure token signing
  - `NEXTAUTH_SECRET`: Session encryption
  - `RECAPTCHA_V3_SECRET_KEY`: Bot protection
  - Firebase credentials (server-side only)

### Production Checklist
- [ ] All secrets in environment variables
- [ ] HTTPS enabled with valid certificates
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Monitoring and logging enabled
- [ ] Regular security audits scheduled
- [ ] Dependency vulnerability scans
- [ ] Backup encryption enabled

## 🔍 Monitoring & Logging

### Security Event Logging
```typescript
import { logSecurityEvent } from '@/lib/security';

logSecurityEvent({
  type: 'auth_failure',
  severity: 'high',
  ip: getClientIP(request),
  userAgent: request.headers.get('user-agent'),
  details: { reason: 'invalid_token', endpoint: request.url }
});
```

### Monitoring Integration
- **Sentry**: Error tracking and performance monitoring
- **Custom Analytics**: Security event tracking
- **Log Aggregation**: Centralized security logs
- **Alert System**: Real-time security notifications

## 📚 Best Practices

### For Developers
1. **Always validate inputs**: Use Zod schemas for all user inputs
2. **Sanitize HTML content**: Use SafeHTML component for user-generated content
3. **Check permissions**: Use role-based access control for all operations
4. **Secure API routes**: Implement authentication and authorization
5. **Use environment variables**: Never hardcode secrets in code

### For Operations
1. **Regular updates**: Keep dependencies updated
2. **Security audits**: Perform regular security assessments
3. **Access control**: Implement principle of least privilege
4. **Monitoring**: Set up comprehensive security monitoring
5. **Incident response**: Have a security incident response plan

### For Users
1. **Strong passwords**: Enforce password complexity requirements
2. **2FA**: Implement two-factor authentication where possible
3. **Education**: Provide security awareness training
4. **Reporting**: Easy mechanism to report security issues
5. **Privacy**: Clear privacy policies and data handling

## 🔄 Continuous Security

### Dependency Management
```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Automated security patches
npm audit fix
```

### Regular Tasks
- **Weekly**: Dependency vulnerability scans
- **Monthly**: Security rule reviews
- **Quarterly**: Security audits and penetration testing
- **Annually**: Comprehensive security assessment

## 📞 Security Incident Response

### Reporting Security Issues
- **Email**: security@goaventura.com.ar
- **Process**: 
  1. Report issue to security team
  2. Immediate assessment and containment
  3. Investigation and remediation
  4. Post-incident analysis and improvements

### Response Team
- **Security Lead**: Coordinates response efforts
- **Development Team**: Implements fixes
- **Operations Team**: Manages infrastructure
- **Communications**: Handles public communication

## 🔧 Configuration Examples

### Security Headers (Next.js)
```javascript
// next.config.ts
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // ... other headers
];
```

### Firebase Security Rules
```javascript
// firestore.rules - Example user access control
match /users/{userId} {
  allow read: if isOwner(userId) || isAdmin();
  allow update: if isOwner(userId) && 
                     request.resource.data.diff(resource.data).affectedKeys()
                       .hasOnly(['displayName', 'photoURL']);
  allow delete: if isAdmin();
}
```

## 📈 Performance Considerations

### Optimizations
- **Memoized Sanitization**: Cache sanitized HTML content
- **Efficient Rate Limiting**: In-memory storage with expiration
- **Lazy Loading**: Security rules executed only when needed
- **Caching**: Secure response caching for public content

### Monitoring Metrics
- **Response Times**: Security overhead impact
- **Error Rates**: Authentication failures
- **Rate Limiting**: Active blocks and triggers
- **Resource Usage**: Memory and CPU impact

---

## 🚨 Critical Security Fixes Implemented

### 1. Environment Security ✅
- **Firebase API Keys**: Moved from client-side to environment variables
- **Server-side Firebase Admin**: Separate configuration for backend operations
- **Environment Variables Template**: Created `.env.example` with all required variables

### 2. API Security ✅
- **Security Middleware**: Rate limiting, CORS, CSRF protection, security headers
- **Input Validation**: Comprehensive Zod schemas for all forms
- **XSS Protection**: HTML sanitization with DOMPurify
- **Rate Limiting**: Configurable per-IP request throttling

### 3. Authentication & Authorization ✅
- **RBAC System**: Role-based access control with permissions
- **JWT Token Verification**: Firebase Auth with custom claims
- **Protected API Routes**: Middleware for permission checking
- **Admin Route Security**: Role-protected endpoints

### 4. Content Security ✅
- **SafeHTML Component**: Sanitized HTML rendering
- **Input Sanitization**: SQL injection prevention
- **File Upload Validation**: Type and size restrictions
- **CORS Configuration**: Origin-based access control

### 5. Firebase Security Rules ✅
- **Firestore Rules**: Role-based data access
- **Storage Rules**: File upload restrictions
- **Collection Security**: Proper read/write permissions

---

## 📋 Implementation Checklist

### Phase 1: Environment Setup (Day 1)
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set Firebase environment variables
- [ ] Configure reCAPTCHA keys
- [ ] Set up SMTP configuration
- [ ] Update `package.json` dependencies

### Phase 2: Security Middleware (Day 1-2)
- [ ] Install missing dependencies: `dompurify`, `firebase-admin`
- [ ] Deploy `middleware.ts` to project root
- [ ] Test security headers functionality
- [ ] Verify CORS and CSRF protection

### Phase 3: API Implementation (Day 2-3)
- [ ] Deploy contact form API route
- [ ] Update contact form with API integration
- [ ] Implement protected admin routes
- [ ] Test rate limiting functionality

### Phase 4: Firebase Configuration (Day 3-4)
- [ ] Deploy Firestore security rules
- [ ] Deploy Storage security rules
- [ ] Configure Firebase Admin SDK
- [ ] Set up user roles in Firestore

### Phase 5: Testing & Deployment (Day 4-5)
- [ ] Run security testing script
- [ ] Fix any identified vulnerabilities
- [ ] Set up monitoring and logging
- [ ] Deploy to production with SSL/TLS

---

## 🛠️ Required Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "dompurify": "^3.0.6",
    "firebase-admin": "^12.0.0"
  },
  "devDependencies": {
    "@types/dompurify": "^3.0.5"
  }
}
```

---

## 🔧 Installation Commands

```bash
# Install required dependencies
npm install dompurify firebase-admin

# Install type definitions
npm install --save-dev @types/dompurify

# Run security tests
./scripts/security-test.sh http://localhost:9002

# Deploy Firebase rules
firebase deploy --only firestore:rules,storage:rules
```

---

## 📞 Support & Contact

For security-related questions or concerns:
- **Email**: security@goaventura.com.ar
- **Documentation**: Check this guide first
- **Issues**: Report through proper channels
- **Emergencies**: Use emergency contact procedures

*Last Updated: January 14, 2026*
*Version: 1.0.0*