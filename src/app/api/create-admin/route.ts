import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders } from '@/lib/security';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Create test admin user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Sign out immediately after creation
    await signOut(auth);

    return NextResponse.json(
      { 
        success: true,
        message: 'Test admin user created successfully',
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        },
        instructions: {
          login: 'Use the credentials to login at /login',
          note: 'This is a temporary solution for testing'
        }
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error: any) {
    console.error('Create admin user error:', error);
    
    let errorMessage = 'Failed to create admin user';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'User already exists. Try logging in directly.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    }

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        code: error.code
      },
      { status: 400, headers: getSecurityHeaders() }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Create admin user endpoint',
      method: 'POST',
      body: {
        email: 'string',
        password: 'string (min 6 characters)'
      }
    },
    { headers: getSecurityHeaders() }
  );
}