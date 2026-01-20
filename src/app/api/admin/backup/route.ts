import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { createSecureResponse } from '@/lib/security-production';
import { logger } from '@/lib/logger';

interface BackupConfig {
  collections: string[];
  includeMetadata: boolean;
  compress: boolean;
  format: 'json' | 'csv';
}

interface BackupJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  config: BackupConfig;
  result?: {
    fileUrl: string;
    size: number;
    recordCount: number;
    collections: string[];
  };
  error?: string;
}

// Store backup jobs in memory (in production, use Redis/DB)
const backupJobs = new Map<string, BackupJob>();

// Create backup job
export async function POST(request: NextRequest) {
  try {
    const config: BackupConfig = await request.json();
    
    // Validate config
    if (!config.collections || config.collections.length === 0) {
      return createSecureResponse(
        { error: 'At least one collection must be specified' },
        400
      );
    }

    const jobId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: BackupJob = {
      id: jobId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      config
    };

    backupJobs.set(jobId, job);

    // Start backup process asynchronously
    startBackupJob(jobId).catch(error => {
      logger.error('Backup job failed', error as Error, { jobId });
      const failedJob = backupJobs.get(jobId);
      if (failedJob) {
        failedJob.status = 'failed';
        failedJob.error = error instanceof Error ? error.message : 'Unknown error';
        failedJob.completedAt = new Date().toISOString();
      }
    });

    logger.info('Backup job created', { jobId, config });

    return createSecureResponse({
      success: true,
      jobId,
      message: 'Backup job started',
      estimatedTime: '2-5 minutes'
    });

  } catch (error) {
    logger.error('Failed to create backup job', error as Error);
    return createSecureResponse(
      { error: 'Failed to create backup job' },
      500
    );
  }
}

// Get backup job status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (jobId) {
      // Get specific job
      const job = backupJobs.get(jobId);
      if (!job) {
        return createSecureResponse(
          { error: 'Backup job not found' },
          404
        );
      }

      return createSecureResponse({
        success: true,
        job
      });
    } else {
      // Get all jobs
      const jobs = Array.from(backupJobs.values())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return createSecureResponse({
        success: true,
        jobs,
        summary: {
          total: jobs.length,
          pending: jobs.filter(j => j.status === 'pending').length,
          running: jobs.filter(j => j.status === 'running').length,
          completed: jobs.filter(j => j.status === 'completed').length,
          failed: jobs.filter(j => j.status === 'failed').length
        }
      });
    }

  } catch (error) {
    logger.error('Failed to get backup status', error as Error);
    return createSecureResponse(
      { error: 'Failed to get backup status' },
      500
    );
  }
}

// Download backup file
export async function PUT(request: NextRequest) {
  try {
    const { jobId } = await request.json();

    const job = backupJobs.get(jobId);
    if (!job) {
      return createSecureResponse(
        { error: 'Backup job not found' },
        404
      );
    }

    if (job.status !== 'completed') {
      return createSecureResponse(
        { error: 'Backup not completed yet' },
        400
      );
    }

    if (!job.result?.fileUrl) {
      return createSecureResponse(
        { error: 'Backup file not available' },
        404
      );
    }

    // Return download URL
    return createSecureResponse({
      success: true,
      downloadUrl: job.result.fileUrl,
      filename: `goaventura_backup_${jobId}.json`,
      size: job.result.size,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    });

  } catch (error) {
    logger.error('Failed to get download URL', error as Error);
    return createSecureResponse(
      { error: 'Failed to get download URL' },
      500
    );
  }
}

// Delete backup job
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return createSecureResponse(
        { error: 'Job ID is required' },
        400
      );
    }

    const job = backupJobs.get(jobId);
    if (!job) {
      return createSecureResponse(
        { error: 'Backup job not found' },
        404
      );
    }

    // Delete backup file from storage if exists
    if (job.result?.fileUrl) {
      try {
        await deleteBackupFile(job.result.fileUrl);
      } catch (error) {
        logger.warn('Failed to delete backup file', error as Error);
      }
    }

    // Remove from memory
    backupJobs.delete(jobId);

    logger.info('Backup job deleted', { jobId });

    return createSecureResponse({
      success: true,
      message: 'Backup job deleted successfully'
    });

  } catch (error) {
    logger.error('Failed to delete backup job', error as Error);
    return createSecureResponse(
      { error: 'Failed to delete backup job' },
      500
    );
  }
}

// Backup execution function
async function startBackupJob(jobId: string) {
  const job = backupJobs.get(jobId);
  if (!job) throw new Error('Job not found');

  job.status = 'running';
  logger.info('Starting backup execution', { jobId });

  try {
    const adminApp = getFirebaseAdmin();
    const db = adminApp.firestore();
    const backup: any = {
      metadata: {
        createdAt: new Date().toISOString(),
        version: '2.0.0',
        environment: process.env.NODE_ENV,
        collections: job.config.collections
      },
      data: {}
    };

    let totalRecords = 0;

    // Backup each collection
    for (const collectionName of job.config.collections) {
      logger.info(`Backing up collection: ${collectionName}`, { jobId });
      
      const snapshot = await db.collection(collectionName).get();
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      backup.data[collectionName] = documents;
      totalRecords += documents.length;

      logger.info(`Collection ${collectionName} backed up`, { 
        jobId, 
        recordCount: documents.length 
      });
    }

    // Create backup file
    const backupData = JSON.stringify(backup, null, 2);
    const buffer = Buffer.from(backupData);
    
    // Upload to Firebase Storage
    const fileName = `backups/${jobId}/backup_${Date.now()}.json`;
    const file = adminApp.storage().bucket().file(fileName);
    
    await file.save(buffer, {
      metadata: {
        contentType: 'application/json',
        metadata: {
          originalSize: buffer.length,
          recordCount: totalRecords,
          collections: job.config.collections.join(','),
          jobId
        }
      }
    });

    // Generate signed URL (valid for 24 hours)
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000
    });

    // Update job result
    job.status = 'completed';
    job.completedAt = new Date().toISOString();
    job.result = {
      fileUrl: url,
      size: buffer.length,
      recordCount: totalRecords,
      collections: job.config.collections
    };

    logger.info('Backup job completed', { 
      jobId, 
      size: buffer.length,
      recordCount: totalRecords 
    });

  } catch (error) {
    job.status = 'failed';
    job.error = error instanceof Error ? error.message : 'Unknown error';
    job.completedAt = new Date().toISOString();
    
    throw error;
  }
}

// Delete backup file from storage
async function deleteBackupFile(fileUrl: string) {
  const adminApp = getFirebaseAdmin();
  
  // Extract file path from URL
  const url = new URL(fileUrl);
  const pathMatch = url.pathname.match(/\/backups\/(.+)/);
  
  if (!pathMatch) {
    throw new Error('Invalid backup file URL');
  }

  const fileName = `backups/${pathMatch[1]}`;
  const file = adminApp.storage().bucket().file(fileName);
  
  await file.delete();
}

// Cleanup old backups (run daily)
async function cleanupOldBackups() {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  const now = Date.now();
  
  for (const [jobId, job] of backupJobs.entries()) {
    const jobAge = now - new Date(job.createdAt).getTime();
    
    if (jobAge > maxAge && (job.status === 'completed' || job.status === 'failed')) {
      // Delete backup file if exists
      if (job.result?.fileUrl) {
        try {
          await deleteBackupFile(job.result.fileUrl);
        } catch (error) {
          logger.warn('Failed to delete old backup file', error as Error);
        }
      }
      
      // Remove from memory
      backupJobs.delete(jobId);
      
      logger.info('Cleaned up old backup job', { jobId });
    }
  }
}

// Health check for backup system
export async function PATCH() {
  try {
    const adminApp = getFirebaseAdmin();
    
    // Test Firebase Storage access
    const testFile = adminApp.storage().bucket().file('backups/health_check');
    await testFile.save(Buffer.from('health check'), { contentType: 'text/plain' });
    await testFile.delete();

    const recentJobs = Array.from(backupJobs.values())
      .filter(job => Date.now() - new Date(job.createdAt).getTime() < 24 * 60 * 60 * 1000);

    return createSecureResponse({
      success: true,
      status: 'healthy',
      backupSystem: {
        storageAccessible: true,
        activeJobs: recentJobs.filter(j => j.status === 'running').length,
        recentBackups: recentJobs.filter(j => j.status === 'completed').length,
        totalJobs: backupJobs.size
      }
    });

  } catch (error) {
    logger.error('Backup system health check failed', error as Error);
    return createSecureResponse(
      { 
        success: false,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Health check failed'
      },
      503
    );
  }
}