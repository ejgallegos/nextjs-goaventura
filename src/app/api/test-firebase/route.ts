import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders } from '@/lib/security';
import { auth } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    // Test Firebase client initialization
    const firebaseConfig = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    };

    // Test environment variables
    const envStatus = {
      firebaseClientConfig: {
        projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      },
      firebaseAdminConfig: {
        projectId: !!process.env.FIREBASE_PROJECT_ID,
        clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: !!process.env.FIREBASE_PRIVATE_KEY && !process.env.FIREBASE_PRIVATE_KEY.includes('placeholder'),
        databaseUrl: !!process.env.FIREBASE_DATABASE_URL,
      },
      auth: {
        initialized: !!auth,
      }
    };

    return NextResponse.json(
      { 
        success: true,
        message: 'Firebase test endpoint',
        config: firebaseConfig,
        envStatus: envStatus,
        timestamp: new Date().toISOString()
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error: any) {
    console.error('Firebase test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}