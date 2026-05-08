'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { YouTubeVideo, ShortsCache, CategorySlug } from '@/lib/types';
import { searchVideos, shouldRefreshCache } from '@/lib/youtube';

// Try multiple possible paths for the cache file - /app is the Docker working directory
const possiblePaths = [
  '/app/public/data/shorts.json',
  path.resolve(process.cwd(), 'public/data/shorts.json'),
  path.resolve(process.cwd(), '.next/standalone/public/data/shorts.json'),
  path.resolve(process.cwd(), '.next/server/public/data/shorts.json'),
];

let jsonFilePath: string;

async function findCacheFile(): Promise<string> {
  for (const p of possiblePaths) {
    try {
      await fs.access(p);
      console.log('Found cache at:', p);
      return p;
    } catch {
      // Continue to next path
    }
  }
  // Return first path as default
  return possiblePaths[0];
}

jsonFilePath = possiblePaths[0]; // Default, will be updated on first call

const defaultCache: ShortsCache = {
  lastUpdated: new Date().toISOString(),
  videos: [],
  categories: {
    'talampaya': [],
    'laguna-brava': [],
  },
};

async function initializeJsonFile(): Promise<void> {
  // Find the correct path for Docker
  jsonFilePath = await findCacheFile();
  console.log('Using cache path:', jsonFilePath);
  
  try {
    const dataPath = path.dirname(jsonFilePath);
    await fs.mkdir(dataPath, { recursive: true });
    await fs.access(jsonFilePath);
  } catch {
    // File doesn't exist, create with default structure
    console.log('Creating new cache file at:', jsonFilePath);
    await fs.writeFile(jsonFilePath, JSON.stringify(defaultCache, null, 2), 'utf8');
  }
}

export async function getShorts(category?: CategorySlug): Promise<{
  videos: YouTubeVideo[];
  lastUpdated: string;
  stale: boolean;
}> {
  // Try to read from cache file, if fails return empty
  let cache: ShortsCache = defaultCache;
  let isStale = false;
  
  try {
    jsonFilePath = await findCacheFile();
    console.log('Reading cache from:', jsonFilePath);
    
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');
    cache = JSON.parse(fileContents);
    console.log('Loaded cache with', cache.videos?.length || 0, 'videos');
    
    if (shouldRefreshCache(cache.lastUpdated)) {
      isStale = true;
    }
  } catch (e) {
    console.error('Failed to read shorts cache:', e);
    // Return empty cache - will need refresh
    return {
      videos: [],
      lastUpdated: new Date().toISOString(),
      stale: true,
    };
  }

  // Filter by category if provided
  let videos: YouTubeVideo[];
  if (category && cache.categories?.[category]) {
    videos = cache.categories[category];
  } else {
    videos = cache.videos || [];
  }

  return {
    videos,
    lastUpdated: cache.lastUpdated,
    stale: isStale,
  };
}

export async function refreshShorts(): Promise<{
  success: boolean;
  videos: YouTubeVideo[];
  lastUpdated: string;
  error?: string;
}> {
  try {
    const categories: CategorySlug[] = [
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

    const newCategories: Record<string, YouTubeVideo[]> = {};
    const allVideos: YouTubeVideo[] = [];

    // Fetch videos for each category
    for (const category of categories) {
      const videos = await searchVideos(category, 10);
      newCategories[category] = videos;
      allVideos.push(...videos);
    }

    const newCache: ShortsCache = {
      lastUpdated: new Date().toISOString(),
      videos: allVideos,
      categories: newCategories,
    };

    // Write to cache file
    await fs.writeFile(jsonFilePath, JSON.stringify(newCache, null, 2), 'utf8');

    return {
      success: true,
      videos: allVideos,
      lastUpdated: newCache.lastUpdated,
    };
  } catch (error) {
    console.error('Error refreshing shorts cache:', error);
    return {
      success: false,
      videos: [],
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getCacheStatus(): Promise<{
  lastUpdated: string;
  isStale: boolean;
}> {
  await initializeJsonFile();
  
  try {
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');
    const cache: ShortsCache = JSON.parse(fileContents);
    
    return {
      lastUpdated: cache.lastUpdated,
      isStale: shouldRefreshCache(cache.lastUpdated),
    };
  } catch {
    return {
      lastUpdated: new Date().toISOString(),
      isStale: true,
    };
  }
}