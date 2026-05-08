import { NextRequest, NextResponse } from 'next/server';
import { getShorts, refreshShorts, getCacheStatus } from '@/lib/data/shorts';
import { getSecurityHeaders } from '@/lib/security';
import type { CategorySlug, VALID_CATEGORIES } from '@/lib/types';

// Valid category slugs for validation
const validCategories = [
  'talampaya',
  'laguna-brava',
  'vinchina',
  'villa-union',
  'villa-castelli',
  'chilecito',
  'triasico',
  'corona-del-inca',
  'cuesta-miranda',
  'aventura-4x4',
  'naturaleza',
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');
    const refresh = searchParams.get('refresh') === 'true';

    // Validate category parameter if provided
    let category: CategorySlug | undefined;
    if (categoryParam) {
      if (!validCategories.includes(categoryParam)) {
        return NextResponse.json(
          {
            error: 'Invalid category',
            message: `Category must be one of: ${validCategories.join(', ')}`,
          },
          {
            status: 400,
            headers: getSecurityHeaders(),
          }
        );
      }
      category = categoryParam as CategorySlug;
    }

    // Check cache status
    const cacheStatus = await getCacheStatus();

    // If cache is stale, attempt to refresh in background
    if (cacheStatus.isStale && !refresh) {
      // Fire and forget - don't wait for refresh
      refreshShorts().catch((err) => {
        console.error('Background cache refresh failed:', err);
      });
    }

    // If refresh is explicitly requested, try to refresh
    if (refresh) {
      const refreshResult = await refreshShorts();
      if (!refreshResult.success) {
        // Return stale data if refresh failed
        const staleData = await getShorts(category);
        return NextResponse.json(
          {
            videos: staleData.videos,
            lastUpdated: staleData.lastUpdated,
            category: category || 'all',
            stale: true,
            refreshError: refreshResult.error,
          },
          {
            status: 200,
            headers: {
              ...getSecurityHeaders(),
              'Cache-Control': 'no-store, must-revalidate',
              'Warning': '113 - Stale cache (refresh failed)',
            },
          }
        );
      }
      
      // Return freshly fetched data
      return NextResponse.json(
        {
          videos: refreshResult.videos,
          lastUpdated: refreshResult.lastUpdated,
          category: category || 'all',
          stale: false,
        },
        {
          status: 200,
          headers: {
            ...getSecurityHeaders({ maxAge: 300 }),
            'Cache-Control': 'public, max-age=300',
          },
        }
      );
    }

    // Get data from cache (may be stale)
    const data = await getShorts(category);

    // Generate ETag based on content
    const etag = `"${Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 32)}"`;

    const responseHeaders: Record<string, string> = {
      ...getSecurityHeaders({ maxAge: 300 }),
      'Cache-Control': 'public, max-age=300',
      'ETag': etag,
    };

    // Add stale warning if applicable
    if (data.stale) {
      responseHeaders['Warning'] = '113 - Stale cache (refresh in progress)';
    }

    return NextResponse.json(
      {
        videos: data.videos,
        lastUpdated: data.lastUpdated,
        category: category || 'all',
        stale: data.stale,
      },
      {
        status: 200,
        headers: responseHeaders,
      }
    );
  } catch (error) {
    console.error('Error in GET /api/shorts:', error);
    
    // Return more helpful error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to fetch shorts data',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      {
        status: 500,
        headers: getSecurityHeaders(),
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}