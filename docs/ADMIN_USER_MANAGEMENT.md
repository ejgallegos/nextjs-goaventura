# Admin User Management System

This document provides comprehensive documentation for the GoAventura admin user management system.

## Overview

The admin user management system provides a secure, role-based access control (RBAC) system for managing administrative users in the GoAventura project. It uses Firebase Authentication for user management and Firestore for storing user data and permissions.

## Features

- **Role-Based Access Control (RBAC)** with three roles: Admin, Editor, Viewer
- **Granular Permissions** for different operations
- **Secure Authentication** using Firebase ID tokens
- **Audit Logging** for all admin operations
- **Batch Operations** for managing multiple users
- **RESTful API** for integration with admin panels
- **Command-line Setup Script** for initial configuration

## User Roles and Permissions

### Roles

| Role | Description | Default Permissions |
|------|-------------|-------------------|
| **Admin** | Full system access | All permissions |
| **Editor** | Content management | Read, Write, Analytics |
| **Viewer** | Read-only access | Read, Analytics |

### Permissions

| Permission | Description | Admin | Editor | Viewer |
|------------|-------------|-------|---------|--------|
| `read_content` | View content and data | ✅ | ✅ | ✅ |
| `write_content` | Create and edit content | ✅ | ✅ | ❌ |
| `delete_content` | Delete content | ✅ | ❌ | ❌ |
| `manage_users` | Manage admin users | ✅ | ❌ | ❌ |
| `view_analytics` | View analytics and reports | ✅ | ✅ | ✅ |

## API Endpoints

### Authentication
All API endpoints require a valid Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

### Users Management

#### Create Admin User
```http
POST /api/admin/users
Content-Type: application/json

{
  "email": "admin@example.com",
  "displayName": "Admin User",
  "role": "admin",
  "permissions": ["read_content", "write_content", "manage_users"],
  "isActive": true,
  "notes": "Initial admin user"
}
```

#### List Admin Users
```http
GET /api/admin/users?limit=50&pageToken=xyz&role=admin&isActive=true&search=john
```

#### Get Single Admin User
```http
GET /api/admin/users/{uid}
```

#### Update Admin User
```http
PUT /api/admin/users/{uid}
Content-Type: application/json

{
  "displayName": "Updated Name",
  "role": "editor",
  "permissions": ["read_content", "write_content"],
  "isActive": true
}
```

#### Delete Admin User
```http
DELETE /api/admin/users/{uid}
```

#### Toggle User Status
```http
PATCH /api/admin/users/{uid}
Content-Type: application/json

{
  "isActive": false
}
```

## Setup Instructions

### 1. Environment Configuration

Ensure your `.env.local` file contains the Firebase Admin SDK configuration:

```bash
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=goaventura-web
FIREBASE_CLIENT_EMAIL=your-service-account@goaventura-web.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Client Configuration (already exists)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=goaventura-web
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB1W3UhchQeohnlBTuAd_YAjJlPOyOI96w
NEXT_PUBLIC_FIREBASE_APP_ID=1:172319170728:web:854211790cb334dd2fa29d
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=goaventura-web.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=goaventura-web.firebasestorage.app
```

### 2. Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `goaventura-web`
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Copy the values to your `.env.local` file

### 3. Run Initial Setup

#### Option A: Command Line Script
```bash
# Using npm script (recommended)
npm run setup-admin

# Or directly with Node
node scripts/setup-admin.ts

# With parameters
npm run setup-admin -- email="admin@example.com" displayName="Admin User"
```

#### Option B: API Endpoint
```bash
# First, authenticate to get a Firebase ID token
# Then call the API with the token
curl -X POST http://localhost:9002/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <id_token>" \
  -d '{
    "email": "admin@example.com",
    "displayName": "Admin User",
    "role": "admin"
  }'
```

### 4. Access Admin Panel

Once the admin user is created:

1. If it was a new user: Check email for password reset link
2. If it was an existing user: Log in with existing credentials
3. Access the admin panel at: `http://localhost:9002/admin`

## Security Features

### Input Validation
- All user inputs are sanitized using DOMPurify
- Zod schemas validate request data
- SQL injection prevention for database queries

### Authentication & Authorization
- Firebase ID token verification
- Role-based permission checking
- Custom claims for user roles and permissions

### Audit Logging
All admin operations are logged to Firestore:
- User creation, updates, deletion
- Permission changes
- Login/logout events
- Failed authentication attempts

### Rate Limiting
- Built-in rate limiting for API endpoints
- Protection against brute force attacks

## Data Schema

### Users Collection
```typescript
interface AdminUser {
  uid: string;           // Firebase Auth UID
  email: string;         // User email
  displayName: string;   // Display name
  role: UserRole;        // admin | editor | viewer
  permissions: Permission[]; // Array of permissions
  isActive: boolean;     // Account status
  createdAt: Date;       // Creation timestamp
  updatedAt?: Date;      // Last update timestamp
  lastLoginAt?: Date;    // Last login timestamp
  createdBy?: string;    // UID of creator
  updatedBy?: string;    // UID of updater
  notes?: string;        // Admin notes
  metadata?: {           // Additional metadata
    source: 'manual' | 'import' | 'api';
    version: number;
  };
}
```

### Audit Logs Collection
```typescript
interface AdminAuditLog {
  id: string;            // Unique log ID
  userId: string;        // UID of user performing action
  action: string;        // Action type
  targetUserId?: string; // Target user (if applicable)
  details: Record<string, any>; // Action details
  ipAddress?: string;   // Client IP address
  userAgent?: string;    // Client user agent
  timestamp: Date;       // Event timestamp
  environment: string;   // dev | staging | prod
}
```

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Additional error details"]
}
```

## Development Guidelines

### Code Style
- Follow TypeScript strict mode
- Use proper error handling with try-catch
- Sanitize all user inputs
- Log important events for debugging
- Use environment variables for configuration

### Testing
- Test all API endpoints
- Verify permission checks
- Test error scenarios
- Validate input sanitization

### Security Best Practices
- Never expose sensitive data in responses
- Use HTTPS in production
- Implement proper CORS configuration
- Regular security audits
- Keep dependencies updated

## Troubleshooting

### Common Issues

#### "Missing required Firebase configuration"
- Verify environment variables are set correctly
- Check Firebase project ID matches
- Ensure service account has proper permissions

#### "Invalid ID token"
- Verify token is not expired
- Check token format (Bearer <token>)
- Ensure token is from correct Firebase project

#### "Insufficient permissions"
- Check user role in Firestore
- Verify custom claims are set
- Ensure user is active

#### "User not found"
- Verify user exists in Firebase Auth
- Check user document in Firestore
- Ensure user UID is correct

### Debug Commands
```bash
# Check Firebase connection
npm run typecheck && npm run lint

# Test admin setup
node scripts/setup-admin.ts --email="test@example.com" --displayName="Test Admin"

# Verify Firebase Admin SDK
node -e "console.log(require('./src/lib/firebase-admin.js'))"
```

## Production Deployment

### Environment Setup
1. Set all required environment variables in production
2. Configure proper CORS settings
3. Set up monitoring and logging
4. Configure backup strategy

### Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] Audit logging enabled
- [ ] CORS properly configured
- [ ] Dependencies updated
- [ ] Security headers configured
- [ ] Firebase rules configured

## Support

For issues or questions about the admin user management system:

1. Check this documentation first
2. Review audit logs for error details
3. Verify Firebase configuration
4. Check environment variables
5. Review browser console for client-side errors

## Future Enhancements

Planned improvements:
- Multi-factor authentication (MFA)
- Password policies enforcement
- Session management
- Advanced audit reporting
- User impersonation capabilities
- Integration with external identity providers