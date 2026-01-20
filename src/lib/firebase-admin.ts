import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

// Interface for Firebase Admin configuration
export interface FirebaseAdminConfig {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
  databaseURL?: string;
  storageBucket?: string;
}

// Type guard for Firebase Admin app
function isAdminApp(app: any): app is admin.app.App {
  return app && typeof app.credential === 'function';
}

// Firebase Admin singleton
let adminApp: admin.app.App | null = null;

/**
 * Initialize Firebase Admin SDK with service account credentials
 * This should only be called on the server side
 */
export function initializeFirebaseAdmin(config?: FirebaseAdminConfig): admin.app.App {
  // Prevent initialization on client side
  if (typeof window !== 'undefined') {
    throw new Error('Firebase Admin can only be initialized on the server side');
  }

  // Return existing app if already initialized
  if (adminApp && isAdminApp(adminApp)) {
    return adminApp;
  }

  // Use provided config or environment variables
  const firebaseConfig: FirebaseAdminConfig = config || {
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  };

  // Check if Firebase should be mocked (CI/CD or placeholder credentials)
  const shouldMockFirebase = 
    process.env.MOCK_FIREBASE === 'true' ||
    !firebaseConfig.projectId || 
    !firebaseConfig.clientEmail || 
    !firebaseConfig.privateKey || 
    firebaseConfig.privateKey.includes('Your-Private-Key-Here');

  // Validate required configuration
  if (shouldMockFirebase) {
    console.warn('Firebase Admin configuration incomplete or explicitly mocked. Some features may not work properly.');
    console.warn('Using mock Firebase Admin for CI/CD or development with placeholder credentials.');
    return {
      auth: () => ({
        verifyIdToken: async () => ({ uid: 'mock-user', email: 'mock@example.com' }),
        getUser: async () => ({ uid: 'mock-user', email: 'mock@example.com' }),
        createCustomToken: async () => 'mock-token',
        listUsers: async () => ({ users: [] }),
        getUserCount: async () => 0,
      }),
      firestore: () => ({
        collection: () => ({
          doc: () => ({
            get: async () => ({ exists: false }),
            set: async () => {},
            update: async () => {},
            delete: async () => {}
          }),
          get: async () => ({ docs: [] }),
        })
      }),
      storage: () => ({
        bucket: () => ({
          file: () => ({
            save: async () => {},
            delete: async () => {},
            getSignedUrl: async () => ['https://mock-url.com/file']
          })
        })
      })
    } as any;
  }
  
  // Also check in production but warn first (only if not mocked)
  if (process.env.NODE_ENV === 'production' && !shouldMockFirebase) {
    if (!firebaseConfig.projectId || !firebaseConfig.clientEmail || !firebaseConfig.privateKey) {
      throw new Error('Missing required Firebase Admin configuration. Please check your environment variables.');
    }
  }

  try {
    // Initialize Firebase Admin with service account
    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: firebaseConfig.projectId,
        clientEmail: firebaseConfig.clientEmail,
        privateKey: firebaseConfig.privateKey,
      }),
      projectId: firebaseConfig.projectId,
      databaseURL: firebaseConfig.databaseURL,
      storageBucket: firebaseConfig.storageBucket,
    });

    console.log('Firebase Admin initialized successfully for project:', firebaseConfig.projectId);
    return adminApp;
  } catch (error: any) {
    if (error.code === 'app/duplicate-app') {
      // App already exists, get the existing app
      adminApp = admin.app();
      return adminApp;
    }
    console.error('Error initializing Firebase Admin:', error);
    throw new Error(`Failed to initialize Firebase Admin: ${error.message}`);
  }
}

/**
 * Get Firebase Admin app instance
 * Initializes if not already done
 */
export function getFirebaseAdmin(): admin.app.App {
  if (!adminApp) {
    return initializeFirebaseAdmin();
  }
  return adminApp;
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): admin.auth.Auth {
  return getFirebaseAdmin().auth();
}

/**
 * Get Firebase Firestore instance
 */
export function getFirebaseFirestore(): admin.firestore.Firestore {
  return getFirebaseAdmin().firestore();
}

/**
 * Get Firebase Storage instance
 */
export function getFirebaseStorage(): admin.storage.Storage {
  return getFirebaseAdmin().storage();
}

/**
 * Verify Firebase ID token
 */
export async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  try {
    const auth = getFirebaseAuth();
    return await auth.verifyIdToken(idToken);
  } catch (error: any) {
    console.error('Error verifying ID token:', error);
    throw new Error(`Failed to verify ID token: ${error.message}`);
  }
}

/**
 * Create custom token for a user
 */
export async function createCustomToken(uid: string, additionalClaims?: object): Promise<string> {
  try {
    const auth = getFirebaseAuth();
    return await auth.createCustomToken(uid, additionalClaims);
  } catch (error: any) {
    console.error('Error creating custom token:', error);
    throw new Error(`Failed to create custom token: ${error.message}`);
  }
}

/**
 * Get user by UID
 */
export async function getUser(uid: string): Promise<admin.auth.UserRecord> {
  try {
    const auth = getFirebaseAuth();
    return await auth.getUser(uid);
  } catch (error: any) {
    console.error('Error getting user:', error);
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
  try {
    const auth = getFirebaseAuth();
    return await auth.getUserByEmail(email);
  } catch (error: any) {
    console.error('Error getting user by email:', error);
    throw new Error(`Failed to get user by email: ${error.message}`);
  }
}

/**
 * Update user claims
 */
export async function updateUserClaims(uid: string, claims: object): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    await auth.setCustomUserClaims(uid, claims);
    console.log(`Updated claims for user ${uid}:`, claims);
  } catch (error: any) {
    console.error('Error updating user claims:', error);
    throw new Error(`Failed to update user claims: ${error.message}`);
  }
}

/**
 * Revoke user tokens
 */
export async function revokeUserTokens(uid: string): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    await auth.revokeRefreshTokens(uid);
    console.log(`Revoked tokens for user ${uid}`);
  } catch (error: any) {
    console.error('Error revoking user tokens:', error);
    throw new Error(`Failed to revoke user tokens: ${error.message}`);
  }
}

/**
 * Disable user account
 */
export async function disableUser(uid: string): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    await auth.updateUser(uid, { disabled: true });
    console.log(`Disabled user ${uid}`);
  } catch (error: any) {
    console.error('Error disabling user:', error);
    throw new Error(`Failed to disable user: ${error.message}`);
  }
}

/**
 * Enable user account
 */
export async function enableUser(uid: string): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    await auth.updateUser(uid, { disabled: false });
    console.log(`Enabled user ${uid}`);
  } catch (error: any) {
    console.error('Error enabling user:', error);
    throw new Error(`Failed to enable user: ${error.message}`);
  }
}

/**
 * Delete user account
 */
export async function deleteUser(uid: string): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    await auth.deleteUser(uid);
    console.log(`Deleted user ${uid}`);
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

/**
 * List users with pagination
 */
export async function listUsers(
  maxResults?: number,
  pageToken?: string
): Promise<{ users: admin.auth.UserRecord[]; nextPageToken?: string }> {
  try {
    const auth = getFirebaseAuth();
    const listUsersResult = await auth.listUsers(maxResults, pageToken);
    return {
      users: listUsersResult.users,
      nextPageToken: listUsersResult.pageToken,
    };
  } catch (error: any) {
    console.error('Error listing users:', error);
    throw new Error(`Failed to list users: ${error.message}`);
  }
}

/**
 * Firestore utilities
 */
export const firestore = {
  /**
   * Get document from Firestore
   */
  async getDocument(collection: string, docId: string): Promise<admin.firestore.DocumentSnapshot> {
    try {
      const db = getFirebaseFirestore();
      return await db.collection(collection).doc(docId).get();
    } catch (error: any) {
      console.error(`Error getting document ${docId} from ${collection}:`, error);
      throw new Error(`Failed to get document: ${error.message}`);
    }
  },

  /**
   * Set document in Firestore
   */
  async setDocument(
    collection: string,
    docId: string,
    data: object,
    options?: any
  ): Promise<void> {
    try {
      const db = getFirebaseFirestore();
      await db.collection(collection).doc(docId).set(data, options);
      console.log(`Set document ${docId} in ${collection}`);
    } catch (error: any) {
      console.error(`Error setting document ${docId} in ${collection}:`, error);
      throw new Error(`Failed to set document: ${error.message}`);
    }
  },

  /**
   * Update document in Firestore
   */
  async updateDocument(collection: string, docId: string, data: object): Promise<void> {
    try {
      const db = getFirebaseFirestore();
      await db.collection(collection).doc(docId).update(data);
      console.log(`Updated document ${docId} in ${collection}`);
    } catch (error: any) {
      console.error(`Error updating document ${docId} in ${collection}:`, error);
      throw new Error(`Failed to update document: ${error.message}`);
    }
  },

  /**
   * Delete document from Firestore
   */
  async deleteDocument(collection: string, docId: string): Promise<void> {
    try {
      const db = getFirebaseFirestore();
      await db.collection(collection).doc(docId).delete();
      console.log(`Deleted document ${docId} from ${collection}`);
    } catch (error: any) {
      console.error(`Error deleting document ${docId} from ${collection}:`, error);
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  },

  /**
   * Query documents from Firestore
   */
  async queryDocuments(
    collection: string,
    queries: Array<{
      field: string;
      operator: admin.firestore.WhereFilterOp;
      value: any;
    }>,
    orderBy?: { field: string; direction: 'asc' | 'desc' },
    limit?: number
  ): Promise<admin.firestore.QuerySnapshot> {
    try {
      const db = getFirebaseFirestore();
      let query: admin.firestore.Query = db.collection(collection);

      // Apply where clauses
      queries.forEach(({ field, operator, value }) => {
        query = query.where(field, operator, value);
      });

      // Apply ordering
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction);
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      return await query.get();
    } catch (error: any) {
      console.error(`Error querying documents from ${collection}:`, error);
      throw new Error(`Failed to query documents: ${error.message}`);
    }
  },
};

/**
 * Storage utilities
 */
export const storage = {
  /**
   * Upload file to Firebase Storage
   */
  async uploadFile(
    bucketName: string,
    filePath: string,
    fileBuffer: Buffer,
    metadata?: any
  ): Promise<string> {
    try {
      const storage = getFirebaseStorage();
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(filePath);

      await file.save(fileBuffer, {
      metadata: {
        contentType: metadata?.contentType || 'application/octet-stream',
        ...metadata,
      },
      });

      // Make file public if needed
      if (metadata?.public) {
        await file.makePublic();
        return file.publicUrl();
      }

      // Generate signed URL for private files
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });

      return url;
    } catch (error: any) {
      console.error(`Error uploading file ${filePath}:`, error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  },

  /**
   * Delete file from Firebase Storage
   */
  async deleteFile(bucketName: string, filePath: string): Promise<void> {
    try {
      const storage = getFirebaseStorage();
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(filePath);

      await file.delete();
      console.log(`Deleted file ${filePath} from bucket ${bucketName}`);
    } catch (error: any) {
      console.error(`Error deleting file ${filePath}:`, error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  },

  /**
   * Get signed URL for file
   */
  async getSignedUrl(
    bucketName: string,
    filePath: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const storage = getFirebaseStorage();
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(filePath);

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresIn * 1000,
      });

      return url;
    } catch (error: any) {
      console.error(`Error getting signed URL for ${filePath}:`, error);
      throw new Error(`Failed to get signed URL: ${error.message}`);
    }
  },
};

// Export the default admin app
export default getFirebaseAdmin();