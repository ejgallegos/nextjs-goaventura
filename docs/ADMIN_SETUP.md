# GoAventura Admin User Management System

This comprehensive system provides secure, role-based access control for managing administrative users in the GoAventura project.

## 🚀 Quick Start

### 1. Set Up Firebase Admin Credentials

First, get your Firebase Admin SDK credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `goaventura-web`
3. Navigate to **Project Settings** → **Service Accounts**
4. Click **Generate new private key**
5. Download the JSON file and copy the values to your `.env.local`:

```bash
# Add to .env.local
FIREBASE_PROJECT_ID=goaventura-web
FIREBASE_CLIENT_EMAIL=your-service-account@goaventura-web.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 2. Create Your First Admin User

Run the setup script to create the initial admin user:

```bash
# Interactive setup
npm run setup-admin

# Or with parameters
npm run setup-admin -- email="admin@goaventura.com.ar" displayName="Admin User"
```

### 3. Access Admin Panel

1. **New Users**: Check your email for a password reset link
2. **Existing Users**: Log in with your existing credentials
3. **Admin Panel**: Navigate to `http://localhost:9002/admin`

## 📋 Features Overview

### Role-Based Access Control (RBAC)

| Role | Permissions | Description |
|------|-------------|-------------|
| **Admin** | All permissions | Full system access, user management |
| **Editor** | Content management | Create/edit content, view analytics |
| **Viewer** | Read-only access | View content and analytics only |

### Key Permissions

- `read_content` - View content and data
- `write_content` - Create and edit content  
- `delete_content` - Delete content
- `manage_users` - Manage admin users
- `view_analytics` - View analytics and reports

### Security Features

- ✅ Firebase Authentication integration
- ✅ Custom user claims for roles/permissions
- ✅ Comprehensive audit logging
- ✅ Input sanitization and validation
- ✅ Rate limiting protection
- ✅ Security headers enforcement
- ✅ Environment-based configuration

## 🛠 API Reference

### Base URLs
- Development: `http://localhost:9002/api/admin`
- Production: `https://your-domain.com/api/admin`

### Authentication
All API calls require a Firebase ID token:

```javascript
const token = await user.getIdToken();
const response = await fetch('/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Core Endpoints

#### Users Management
```http
# Create admin user
POST /api/admin/users
{
  "email": "user@example.com",
  "displayName": "User Name",
  "role": "admin",
  "permissions": ["manage_users", "read_content"],
  "isActive": true
}

# List users with filters
GET /api/admin/users?limit=50&role=admin&isActive=true

# Get single user
GET /api/admin/users/{uid}

# Update user
PUT /api/admin/users/{uid}
{
  "displayName": "Updated Name",
  "role": "editor"
}

# Delete user
DELETE /api/admin/users/{uid}

# Toggle user status
PATCH /api/admin/users/{uid}
{
  "isActive": false
}

# Batch operations
POST /api/admin/users/batch
{
  "operations": [
    {
      "type": "create",
      "email": "new@example.com",
      "userData": { "role": "editor" }
    },
    {
      "type": "update", 
      "userId": "abc123",
      "userData": { "isActive": false }
    }
  ]
}
```

## 📊 Data Models

### Admin User Document
```typescript
interface AdminUser {
  uid: string;                    // Firebase Auth UID
  email: string;                  // User email
  displayName: string;            // Display name
  role: 'admin' | 'editor' | 'viewer';
  permissions: Permission[];      // Array of permissions
  isActive: boolean;              // Account status
  createdAt: Date;                // Creation timestamp
  updatedAt?: Date;               // Last update
  lastLoginAt?: Date;             // Last login
  createdBy?: string;             // Creator UID
  updatedBy?: string;             // Updater UID
  notes?: string;                 // Admin notes
  metadata?: {                    // Metadata
    source: 'manual' | 'import' | 'api';
    version: number;
  };
}
```

### Audit Log Entry
```typescript
interface AdminAuditLog {
  id: string;                     // Unique ID
  userId: string;                 // Acting user UID
  action: string;                 // Action type
  targetUserId?: string;          // Target user UID
  details: Record<string, any>;   // Action details
  ipAddress?: string;             // Client IP
  userAgent?: string;              // Client user agent
  timestamp: Date;                // Event timestamp
  environment: string;             // dev/staging/prod
}
```

## 🔧 Command Line Tools

### Setup Script
```bash
# Interactive setup
npm run setup-admin

# With parameters
npm run setup-admin -- email="admin@example.com" displayName="Admin User"

# Available options:
#   email="user@example.com"     # User email (required)
#   displayName="User Name"       # Display name (required)
```

### Development Commands
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build

# Security test
npm run security-test
```

## 🔒 Security Best Practices

### Environment Security
- Never commit `.env.local` to version control
- Use strong, unique private keys
- Rotate credentials regularly
- Use different keys for dev/staging/prod

### Access Control
- Follow principle of least privilege
- Regularly review user permissions
- Disable inactive accounts promptly
- Use 2FA where possible

### Monitoring
- Monitor audit logs for suspicious activity
- Set up alerts for failed login attempts
- Regular security audits and penetration testing
- Keep dependencies updated

## 🚨 Troubleshooting

### Common Issues

#### "Missing Firebase Admin configuration"
```bash
# Check environment variables
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_CLIENT_EMAIL
echo $FIREBASE_PRIVATE_KEY

# Verify service account permissions
gcloud projects get-iam-policy goaventura-web
```

#### "Invalid ID token"
```javascript
// Verify token format
const token = await user.getIdToken();
console.log('Token:', token.substring(0, 50) + '...');

// Check token expiration
const decoded = await admin.auth().verifyIdToken(token);
console.log('Expires:', new Date(decoded.exp * 1000));
```

#### "Insufficient permissions"
```bash
# Check user role in Firestore
firebase firestore:read goaventura-web --collection users --document USER_ID

# Verify custom claims
firebase auth:export users.json
```

### Debug Commands
```bash
# Test Firebase connection
node -e "
const { getFirebaseAdmin } = require('./src/lib/firebase-admin');
const admin = getFirebaseAdmin();
console.log('Connected to project:', admin.options.projectId);
"

# Check admin service
npm run typecheck && npm run lint

# Test API endpoints
curl -X GET http://localhost:9002/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📈 Performance Optimization

### Database Indexing
```javascript
// Create composite indexes for better query performance
// Users collection indexes:
// - role + isActive
// - createdAt (descending)
// - lastLoginAt (descending)
```

### Caching Strategy
- Cache user permissions in memory
- Implement Redis for session storage
- Use browser caching for static assets
- Implement CDN for API responses

### Rate Limiting
```javascript
// Configure rate limits per endpoint
const rateLimits = {
  '/api/admin/users': { windowMs: 15 * 60 * 1000, max: 100 },
  '/api/admin/users/batch': { windowMs: 15 * 60 * 1000, max: 10 },
  '/api/admin/auth': { windowMs: 15 * 60 * 1000, max: 5 }
};
```

## 🔄 Migration Guide

### From Simple Auth to Admin System

1. **Backup existing data**
   ```bash
   firebase firestore:export goaventura-web --backup-path ./backup
   ```

2. **Install new dependencies**
   ```bash
   npm install firebase-admin zod dompurify
   ```

3. **Update environment variables**
   - Add Firebase Admin SDK credentials
   - Configure admin settings

4. **Run setup script**
   ```bash
   npm run setup-admin
   ```

5. **Migrate existing users**
   ```javascript
   // Script to migrate existing users to new system
   const migration = require('./scripts/migrate-admin-users');
   migration.run();
   ```

## 🧪 Testing

### Unit Tests
```bash
# Run admin user service tests
npm test -- admin-user-service.test.ts

# Run API endpoint tests  
npm test -- admin-api.test.ts
```

### Integration Tests
```bash
# Test complete admin workflow
npm run test:integration

# Test security scenarios
npm run test:security
```

### Load Testing
```bash
# Test API under load
npm run test:load -- --concurrent=50 --duration=60s
```

## 📚 Additional Resources

### Documentation
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

### Best Practices
- [Firebase Security Guidelines](https://firebase.google.com/docs/security)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)

### Support
- [GoAventura Documentation](./docs/ADMIN_USER_MANAGEMENT.md)
- [Firebase Support](https://firebase.google.com/support)
- [Issue Tracker](https://github.com/your-org/goaventura/issues)

---

## 🎯 Next Steps

1. **Set up your first admin user** using the setup script
2. **Configure proper security settings** in production
3. **Set up monitoring and alerts** for admin activities
4. **Create user management UI** in your admin panel
5. **Implement regular security audits** and user reviews

For detailed implementation examples and advanced configurations, see the [complete documentation](./docs/ADMIN_USER_MANAGEMENT.md).