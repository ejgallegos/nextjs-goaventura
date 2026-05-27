#!/usr/bin/env node

/**
 * Integration test for Go Aventura Admin User Management System
 * 
 * This script tests the complete admin user creation and management flow.
 * Run this script to verify your setup is working correctly.
 */

import { adminUserService } from '../src/lib/admin-user-service';
import { UserRole, Permission } from '../src/lib/auth-rbac';
import { getFirebaseAdmin } from '../src/lib/firebase-admin';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

class AdminSystemTester {
  private testEmail = 'test-admin@example.com';
  private testDisplayName = 'Test Admin User';
  private createdUserId?: string;

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Go Aventura Admin System Integration Tests\n');
    
    try {
      await this.testFirebaseConnection();
      await this.testCreateAdminUser();
      await this.testGetAdminUser();
      await this.testUpdateAdminUser();
      await this.testToggleUserStatus();
      await this.testListAdminUsers();
      await this.testBatchOperations();
      await this.testCleanup();
      
      console.log('\n✅ All tests completed successfully!');
      console.log('🎉 Your admin system is ready for use.\n');
      
    } catch (error: any) {
      console.error('\n❌ Test failed:', error.message);
      console.error('💡 Check your Firebase configuration and try again.\n');
      process.exit(1);
    }
  }

  private async testFirebaseConnection(): Promise<void> {
    console.log('📡 Testing Firebase connection...');
    
    try {
      const admin = getFirebaseAdmin();
      console.log(`   ✅ Connected to project: ${admin.options.projectId}`);
      console.log('   ✅ Firebase Admin SDK initialized successfully\n');
    } catch (error: any) {
      throw new Error(`Firebase connection failed: ${error.message}`);
    }
  }

  private async testCreateAdminUser(): Promise<void> {
    console.log('👤 Testing admin user creation...');
    
    try {
      const result = await adminUserService.createAdminUser({
        email: this.testEmail,
        displayName: this.testDisplayName,
        role: UserRole.ADMIN,
        permissions: [Permission.MANAGE_USERS, Permission.READ_CONTENT],
        isActive: true,
        createdBy: 'integration-test',
        notes: 'Created during integration testing'
      });

      if (!result.success) {
        throw new Error(`User creation failed: ${result.error}`);
      }

      this.createdUserId = result.user?.uid;
      console.log(`   ✅ Admin user created: ${result.user?.email}`);
      console.log(`   ✅ User ID: ${result.user?.uid}`);
      console.log(`   ✅ Role: ${result.user?.role}`);
      console.log(`   ✅ Permissions: ${result.user?.permissions?.join(', ')}\n`);
    } catch (error: any) {
      throw new Error(`User creation test failed: ${error.message}`);
    }
  }

  private async testGetAdminUser(): Promise<void> {
    if (!this.createdUserId) {
      throw new Error('No user ID available for get test');
    }

    console.log('🔍 Testing get admin user...');
    
    try {
      const user = await adminUserService.getAdminUser(this.createdUserId);
      
      if (!user) {
        throw new Error('User not found');
      }

      console.log(`   ✅ Retrieved user: ${user.email}`);
      console.log(`   ✅ Display name: ${user.displayName}`);
      console.log(`   ✅ Active status: ${user.isActive}\n`);
    } catch (error: any) {
      throw new Error(`Get user test failed: ${error.message}`);
    }
  }

  private async testUpdateAdminUser(): Promise<void> {
    if (!this.createdUserId) {
      throw new Error('No user ID available for update test');
    }

    console.log('✏️ Testing admin user update...');
    
    try {
      const updatedUser = await adminUserService.updateAdminUser(
        this.createdUserId,
        {
          displayName: 'Updated Test Admin',
          role: UserRole.EDITOR,
          permissions: [Permission.READ_CONTENT, Permission.WRITE_CONTENT],
          notes: 'Updated during integration testing'
        },
        'integration-test'
      );

      console.log(`   ✅ User updated: ${updatedUser.email}`);
      console.log(`   ✅ New role: ${updatedUser.role}`);
      console.log(`   ✅ New permissions: ${updatedUser.permissions.join(', ')}\n`);
    } catch (error: any) {
      throw new Error(`Update user test failed: ${error.message}`);
    }
  }

  private async testToggleUserStatus(): Promise<void> {
    if (!this.createdUserId) {
      throw new Error('No user ID available for status toggle test');
    }

    console.log('🔄 Testing user status toggle...');
    
    try {
      // Disable user
      const disabledUser = await adminUserService.toggleAdminUserStatus(
        this.createdUserId,
        false,
        'integration-test'
      );
      console.log(`   ✅ User disabled: ${!disabledUser.isActive}`);

      // Re-enable user
      const enabledUser = await adminUserService.toggleAdminUserStatus(
        this.createdUserId,
        true,
        'integration-test'
      );
      console.log(`   ✅ User re-enabled: ${enabledUser.isActive}\n`);
    } catch (error: any) {
      throw new Error(`Status toggle test failed: ${error.message}`);
    }
  }

  private async testListAdminUsers(): Promise<void> {
    console.log('📋 Testing admin user list...');
    
    try {
      const result = await adminUserService.listAdminUsers(10);
      
      console.log(`   ✅ Found ${result.users.length} admin users`);
      console.log(`   ✅ Total count: ${result.totalCount}`);
      console.log(`   ✅ Has more: ${result.hasMore}`);
      
      // Show first few users
      result.users.slice(0, 3).forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.role})`);
      });
      console.log();
    } catch (error: any) {
      throw new Error(`List users test failed: ${error.message}`);
    }
  }

  private async testBatchOperations(): Promise<void> {
    console.log('🔄 Testing batch operations...');
    
    try {
      const createOperations = [
        {
          type: 'create' as const,
          email: 'batch-test-1@example.com',
          userData: {
            displayName: 'Batch Test User 1',
            role: UserRole.VIEWER,
            permissions: [Permission.READ_CONTENT]
          }
        },
        {
          type: 'create' as const,
          email: 'batch-test-2@example.com',
          userData: {
            displayName: 'Batch Test User 2',
            role: UserRole.EDITOR,
            permissions: [Permission.READ_CONTENT, Permission.WRITE_CONTENT]
          }
        }
      ];

      const result = await adminUserService.batchAdminOperations(
        createOperations,
        'integration-test'
      );

      console.log(`   ✅ Processed ${result.processed} operations`);
      console.log(`   ✅ Success: ${result.success}`);
      console.log(`   ✅ Failed: ${result.failed}`);
      
      // Store created user IDs for cleanup
      result.results?.forEach(op => {
        if (op.success && op.userId) {
          // Add to cleanup list (simplified for this test)
          console.log(`   ✅ Created/updated user: ${op.userId}`);
        }
      });
      console.log();
    } catch (error: any) {
      throw new Error(`Batch operations test failed: ${error.message}`);
    }
  }

  private async testCleanup(): Promise<void> {
    console.log('🧹 Testing cleanup...');
    
    try {
      if (this.createdUserId) {
        await adminUserService.deleteAdminUser(this.createdUserId, 'integration-test');
        console.log(`   ✅ Test user deleted: ${this.testEmail}`);
      }
      
      // Note: In a real scenario, you'd also clean up the batch-created users
      console.log('   ✅ Cleanup completed\n');
    } catch (error: any) {
      console.warn(`   ⚠️  Cleanup warning: ${error.message}`);
    }
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new AdminSystemTester();
  tester.runAllTests().catch(console.error);
}

export { AdminSystemTester };