#!/usr/bin/env node

/**
 * Initial Admin Setup Script for GoAventura
 * 
 * This script creates the first admin user for the GoAventura project.
 * It should be run once during initial setup or when you need to create
 * a new admin user from the command line.
 * 
 * Usage:
 *   npm run setup-admin -- email="admin@example.com" displayName="Admin User"
 *   node scripts/setup-admin.ts email="admin@example.com" displayName="Admin User"
 */

import { adminUserService } from '../src/lib/admin-user-service';
import { UserRole, Permission } from '../src/lib/auth-rbac';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Parse command line arguments
function parseArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const params: Record<string, string> = {};
  
  for (const arg of args) {
    if (arg.includes('=')) {
      const [key, value] = arg.split('=');
      params[key] = value.replace(/['"]/g, ''); // Remove quotes
    }
  }
  
  return params;
}

// Validate required environment variables
function validateEnvironment(): void {
  const required = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL', 
    'FIREBASE_PRIVATE_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease set up your Firebase Admin credentials in .env.local');
    process.exit(1);
  }
}

// Display success message with instructions
function displaySuccessResult(user: any, requiresAction?: string): void {
  console.log('\n🎉 Admin user created successfully!');
  console.log('=====================================');
  console.log(`📧 Email: ${user.email}`);
  console.log(`👤 Name: ${user.displayName}`);
  console.log(`🔑 Role: ${user.role}`);
  console.log(`🔐 Permissions: ${user.permissions.join(', ')}`);
  console.log(`✅ Status: ${user.isActive ? 'Active' : 'Inactive'}`);
  console.log(`🆔 UID: ${user.uid}`);
  
  if (requiresAction === 'invitation_sent') {
    console.log('\n📧 Next Steps:');
    console.log('1. Check your email for a password reset link');
    console.log('2. Set your password to activate the account');
    console.log('3. Log in at /admin to access the admin panel');
  } else if (requiresAction === 'manual_setup') {
    console.log('\n🔧 Next Steps:');
    console.log('1. User already existed in Firebase Auth');
    console.log('2. Admin privileges have been granted');
    console.log('3. User can now log in at /admin');
  }
  
  console.log('\n🌐 Admin Panel: http://localhost:9002/admin');
  console.log('=====================================\n');
}

// Main setup function
async function setupInitialAdmin(): Promise<void> {
  try {
    console.log('🚀 Starting GoAventura Admin Setup\n');
    
    // Validate environment
    validateEnvironment();
    
    // Parse command line arguments
    const params = parseArgs();
    
    // Get user input from command line or interactive prompt
    let email = params.email;
    let displayName = params.displayName;
    
    // Interactive prompts if not provided
    if (!email || !displayName) {
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const question = (prompt: string): Promise<string> => {
        return new Promise((resolve) => {
          rl.question(prompt, (answer) => resolve(answer.trim()));
        });
      };
      
      if (!email) {
        email = await question('Enter admin email: ');
      }
      
      if (!displayName) {
        displayName = await question('Enter admin display name: ');
      }
      
      rl.close();
    }
    
    // Validate input
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address');
      process.exit(1);
    }
    
    if (!displayName || displayName.length < 2) {
      console.error('❌ Display name must be at least 2 characters');
      process.exit(1);
    }
    
    console.log(`📝 Creating admin user for: ${email} (${displayName})\n`);
    
    // Create admin user with full permissions
    const result = await adminUserService.createAdminUser({
      email: email.toLowerCase(),
      displayName: displayName.trim(),
      role: UserRole.ADMIN,
      permissions: [
        Permission.READ_CONTENT,
        Permission.WRITE_CONTENT,
        Permission.DELETE_CONTENT,
        Permission.MANAGE_USERS,
        Permission.VIEW_ANALYTICS
      ],
      isActive: true,
      createdBy: 'setup-script',
      notes: 'Initial admin user created via setup script'
    });
    
    if (result.success) {
      displaySuccessResult(result.user, result.requiresAction);
      
      // Update package.json with setup command if not exists
      try {
        const packageJsonPath = join(projectRoot, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        
        if (!packageJson.scripts?.['setup-admin']) {
          packageJson.scripts = packageJson.scripts || {};
          packageJson.scripts['setup-admin'] = 'node scripts/setup-admin.js';
          
          require('fs').writeFileSync(
            packageJsonPath, 
            JSON.stringify(packageJson, null, 2)
          );
          
          console.log('💡 Added "setup-admin" script to package.json');
          console.log('   You can now run: npm run setup-admin\n');
        }
      } catch (error) {
        // Ignore package.json update errors
      }
      
    } else {
      console.error('❌ Failed to create admin user:');
      console.error(`   ${result.error}`);
      
      if (result.requiresAction) {
        console.log('\n💡 Suggested action:');
        switch (result.requiresAction) {
          case 'user_exists':
            console.log('   User already has admin privileges');
            console.log('   Try logging in at /admin');
            break;
          case 'invitation_sent':
            console.log('   Check email for password reset link');
            break;
          case 'manual_setup':
            console.log('   User was updated manually');
            console.log('   Try logging in at /admin');
            break;
        }
      }
      
      process.exit(1);
    }
    
  } catch (error: any) {
    console.error('❌ Setup failed:');
    console.error(`   ${error.message}`);
    
    if (error.message.includes('Firebase')) {
      console.error('\n🔧 Firebase Troubleshooting:');
      console.error('1. Ensure Firebase Admin credentials are correctly set');
      console.error('2. Check that the service account has admin privileges');
      console.error('3. Verify the project ID matches your Firebase project');
      console.error('4. Make sure Firestore is in Native mode');
    }
    
    process.exit(1);
  }
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupInitialAdmin();
}

export { setupInitialAdmin };