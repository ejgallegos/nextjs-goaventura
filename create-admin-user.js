import { getApps, getApp, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Initialize Firebase with existing config
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Create admin user function
async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user...');
    
    // Check if admin user already exists
    const adminEmail = 'admin@goaventura.com.ar';
    let adminUid = null;
    
    try {
      // Try to sign in as admin to get UID
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, 'admin123456');
      adminUid = userCredential.user.uid;
      console.log('✅ Found existing admin user with UID:', adminUid);
      
      // Set custom claims for admin role
      await fetch('http://localhost:9002/api/admin/users/set-claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        'Authorization': `Bearer ${await userCredential.user.getIdToken(true)}`
        },
        body: JSON.stringify({
          uid: adminUid,
          claims: {
            role: 'admin',
            permissions: ['read_content', 'write_content', 'delete_content', 'manage_users', 'view_analytics', 'view_site_settings']
          }
        })
      });
      
      console.log('✅ Admin user setup completed');
      return adminUid;
      
    } catch (error) {
      console.log('ℹ Admin user not found, creating new one...');
      
      // Create new admin user
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, 'admin123456');
      const newAdminUid = userCredential.user.uid;
      
      console.log('✅ New admin user created with UID:', newAdminUid);
      
      // Set custom claims for new admin user
      const token = await userCredential.user.getIdToken(true);
      
      const response = await fetch('http://localhost:9002/api/admin/users/set-claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uid: newAdminUid,
          claims: {
            role: 'admin',
            permissions: ['read_content', 'write_content', 'delete_content', 'manage_users', 'view_analytics', 'view_site_settings']
          }
        })
      });
      
      if (response.ok) {
        console.log('✅ Admin user claims set successfully');
        return newAdminUid;
      } else {
        console.log('❌ Failed to set admin claims:', await response.text());
        return null;
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return null;
  }
}

// Create additional test users
async function createTestUsers() {
  const testUsers = [
    { email: 'editor@goaventura.com.ar', password: 'editor123456', role: 'editor' },
    { email: 'viewer@goaventura.com.ar', password: 'viewer123456', role: 'viewer' }
  ];
  
  for (const testUser of testUsers) {
    try {
      console.log(`Creating test user: ${testUser.email}`);
      
      const userCredential = await createUserWithEmailAndPassword(auth, testUser.email, testUser.password);
      const uid = userCredential.user.uid;
      const token = await userCredential.user.getIdToken(true);
      
      const response = await fetch('http://localhost:9002/api/admin/users/set-claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uid: uid,
          claims: {
            role: testUser.role,
            permissions: testUser.role === 'editor' 
              ? ['read_content', 'write_content', 'view_analytics']
              : ['read_content', 'view_analytics']
          }
        })
      });
      
      if (response.ok) {
        console.log(`✅ Test user created: ${testUser.email}`);
      } else {
        console.log(`❌ Failed to create test user: ${testUser.email}`);
      }
    } catch (error) {
      console.error(`❌ Error creating test user ${testUser.email}:`, error);
    }
  }
}

// Main execution
async function main() {
  console.log('🔧 Firebase Admin Setup Tool');
  console.log('========================================');
  
  try {
    // Test Firebase connection
    await auth.signInAnonymously();
    console.log('✅ Firebase connection successful');
    
    // Create admin user
    const adminUid = await createAdminUser();
    
    if (adminUid) {
      // Create additional test users
      await createTestUsers();
      
      console.log('✅ Setup completed!');
      console.log('========================================');
      console.log('🎯 Created Users:');
      console.log('  - admin@goaventura.com.ar (admin)');
      console.log('  - editor@goaventura.com.ar (editor)');
      console.log('  - viewer@goaventura.com.ar (viewer)');
      console.log('========================================');
      console.log('🔑 Login Credentials:');
      console.log('  Email: admin@goaventura.com.ar');
      console.log('  Password: admin123456');
      console.log('========================================');
      console.log('🌐 Access URLs:');
      console.log('  Login: http://localhost:9002/login');
      console.log('  Admin: http://localhost:9002/admin');
      console.log('========================================');
      
    } else {
      console.error('❌ Failed to setup admin user');
    }
    
  } catch (error) {
    console.error('❌ Firebase setup error:', error);
  }
}

main();