# GoAventura Production Deployment Guide

## 🚀 Overview

This guide provides comprehensive instructions for deploying GoAventura to production with enterprise-grade security, monitoring, and reliability.

## 📋 Prerequisites

### Infrastructure Requirements
- Node.js 18.0.0 or higher
- NPM 8.0.0 or higher
- Firebase Project with Admin SDK configured
- Redis server for rate limiting (production)
- CDN or static asset hosting (recommended)
- SSL certificate (production)

### Required Services
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Firebase Admin SDK service account
- Email service (Gmail SMTP or similar)

## 🔧 Environment Configuration

### 1. Copy Production Environment File
```bash
cp .env.production .env.local
```

### 2. Update Required Values
Edit `.env.local` and replace ALL placeholder values:

#### Critical Security Settings
```bash
# Generate new secrets for production
JWT_SECRET=GENERATE_NEW_32_CHARACTER_SECRET_FOR_PRODUCTION
NEXTAUTH_SECRET=GENERATE_NEW_NEXTAUTH_SECRET_FOR_PRODUCTION
REFRESH_TOKEN_SECRET=GENERATE_NEW_REFRESH_TOKEN_SECRET_FOR_PRODUCTION
```

#### Firebase Admin SDK
```bash
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
REPLACE_WITH_ACTUAL_PRIVATE_KEY_FROM_FIREBASE_CONSOLE
-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=service-account@your-project.iam.gserviceaccount.com
```

#### Production URLs
```bash
NEXT_PUBLIC_SITE_URL=https://goaventura.com.ar
NEXTAUTH_URL=https://goaventura.com.ar
ALLOWED_ORIGINS=https://goaventura.com.ar,https://www.goaventura.com.ar
```

#### Email Configuration
```bash
SMTP_USER=your-production-email@goaventura.com.ar
SMTP_PASS=your-production-app-password
CONTACT_EMAIL_RECIPIENT=info@goaventura.com.ar
```

## 🛠️ Build Process

### 1. Install Dependencies
```bash
npm install --production
```

### 2. Type Check
```bash
npm run typecheck
```

### 3. Security Audit
```bash
npm audit --audit-level=moderate
```

### 4. Production Build
```bash
npm run build:production
```

### 5. Bundle Analysis (Optional)
```bash
npm run build:analyze
```

## 🚀 Deployment Options

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Environment Variables in Vercel**
- Add all variables from `.env.local` to Vercel dashboard
- Ensure sensitive values are encrypted

### Option B: Docker Deployment

1. **Build Docker Image**
```bash
docker build -t goaventura:production .
```

2. **Run Container**
```bash
docker run -d \
  --name goaventura \
  -p 3000:3000 \
  --env-file .env.local \
  goaventura:production
```

### Option C: Traditional Server

1. **Build Application**
```bash
npm run build:production
```

2. **Start Production Server**
```bash
npm run start:production
```

## 🔒 Security Configuration

### 1. SSL/HTTPS Setup
- Ensure HTTPS is enabled
- Configure SSL certificates
- Redirect HTTP to HTTPS

### 2. Firebase Security Rules
```javascript
// Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users only
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public data
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.role in ['admin', 'editor'];
    }
  }
}
```

### 3. Storage Security
```javascript
// Firebase Storage rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.role in ['admin', 'editor'];
    }
  }
}
```

## 📊 Monitoring Setup

### 1. Health Checks
Monitor: `https://your-domain.com/api/monitoring`

### 2. Error Tracking
- Configure Sentry DSN
- Set up error webhooks
- Monitor security events

### 3. Performance Monitoring
- Track API response times
- Monitor database performance
- Alert on high latency

## 🔧 Admin Configuration

### 1. Create Admin Users
```bash
# Create initial admin user
curl -X POST https://your-domain.com/api/admin/roles \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@goaventura.com.ar",
    "role": "admin",
    "status": "active"
  }'
```

### 2. Test Authentication
1. Visit `https://your-domain.com/login`
2. Login with admin credentials
3. Verify access to `/admin`

## 🔍 Testing Production

### 1. Security Tests
```bash
# Run security audit
npm run security-test:production
```

### 2. Load Testing
```bash
# Test with your preferred load testing tool
# Example with Apache Bench:
ab -n 1000 -c 10 https://your-domain.com/
```

### 3. Manual Testing Checklist
- [ ] User registration and login
- [ ] Admin access and permissions
- [ ] File uploads and security
- [ ] Email functionality
- [ ] Contact forms
- [ ] Mobile responsiveness
- [ ] Browser compatibility
- [ ] Performance benchmarks

## 🔄 Ongoing Maintenance

### Daily Tasks
- Monitor error logs
- Check backup status
- Review security events

### Weekly Tasks
- Update dependencies
- Review performance metrics
- Clean up old backups

### Monthly Tasks
- Security audit
- Performance optimization
- Backup verification

## 🚨 Emergency Procedures

### 1. Security Incident
1. Identify affected accounts
2. Revoke all sessions
3. Force password resets
4. Review access logs
5. Patch vulnerabilities

### 2. Data Recovery
1. Access backup system: `/api/admin/backup`
2. Download latest backup
3. Restore to Firebase
4. Verify data integrity

### 3. Service Outage
1. Check health endpoints
2. Review error logs
3. Restart services if needed
4. Monitor recovery

## 📞 Support

### Documentation Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Security Best Practices](https://owasp.org/)

### Emergency Contacts
- Technical Lead: [Contact Information]
- DevOps Team: [Contact Information]
- Security Team: [Contact Information]

## 📈 Performance Optimization

### 1. Caching Strategy
- Static assets: 1 year
- API responses: 5 minutes
- Database queries: Redis layer

### 2. CDN Configuration
- Distribute static assets globally
- Enable compression
- Configure cache headers

### 3. Database Optimization
- Use indexes on queries
- Implement pagination
- Monitor query performance

## ✅ Production Readiness Checklist

### Security
- [ ] All secrets replaced with production values
- [ ] HTTPS/SSL configured
- [ ] Firebase security rules updated
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] CSRF protection enabled
- [ ] Input validation implemented

### Performance
- [ ] Build optimized for production
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Caching configured
- [ ] CDN deployed
- [ ] Compression enabled

### Monitoring
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Health checks working
- [ ] Backup system tested
- [ ] Alerts configured
- [ ] Logging implemented

### Functionality
- [ ] All user flows tested
- [ ] Admin functions working
- [ ] Email sending verified
- [ ] File uploads secure
- [ ] Database connections stable
- [ ] API endpoints functional

---

## 🎉 Deployment Complete

Once all steps are completed and verified, your GoAventura application is ready for production use!

**Next Steps:**
1. Monitor the first 24 hours closely
2. Collect user feedback
3. Plan iterative improvements
4. Regular security reviews

**Success Metrics:**
- 99.9% uptime
- <2s page load time
- Zero security incidents
- Positive user feedback

Good luck with your production deployment! 🚀