import type { YouTubeVideo, CategorySlug } from '@/lib/types';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

const CATEGORY_KEYWORDS: Record<CategorySlug, string[]> = {
  'talampaya': [
    'Parque Nacional Talampaya',
    'Talampaya La Rioja',
    'Cañón de Talampaya',
    'Talampaya Argentina',
    'Talampaya drone',
    'Talampaya shorts',
    'Talampaya turismo'
  ],
  'laguna-brava': [
    'Laguna Brava La Rioja',
    'Reserva Laguna Brava',
    'Laguna Brava Vinchina',
    'Laguna Brava 4x4',
    'Laguna Brava nieve',
    'Laguna Brava flamencos',
    'Laguna Brava turismo'
  ],
  'vinchina': [
    'Vinchina La Rioja',
    'Vinchina turismo',
    'Vinchina 4x4',
    'Cordillera Vinchina',
    'Vinchina drone',
    'Río Bermejo Vinchina',
    'Vinchina aventura'
  ],
  'villa-union': [
    'Villa Unión La Rioja',
    'Villa Unión turismo',
    'Villa Unión Talampaya',
    'Villa Unión drone',
    'Villa Unión vacaciones',
    'Villa Unión Argentina'
  ],
  'villa-castelli': [
    'Villa Castelli La Rioja',
    'Villa Castelli turismo',
    'Villa Castelli cordillera',
    'Villa Castelli drone',
    'Villa Castelli paisajes',
    'Villa Castelli aventura'
  ],
  'chilecito': [
    'Chilecito La Rioja',
    'Chilecito turismo',
    'Cuesta de Miranda',
    'Cable Carril Chilecito',
    'Chilecito drone',
    'Chilecito aventura',
    'Chilecito Argentina'
  ],
  'triasico': [
    'Triásico La Rioja',
    'Cañón del Triásico',
    'Parque Triásico',
    'Triásico Vinchina',
    'Triásico Talampaya',
    'Triásico Argentina'
  ],
  'corona-del-inca': [
    'Corona del Inca',
    'Corona del Inca La Rioja',
    'Corona del Inca 4x4',
    'Corona del Inca cordillera',
    'Corona del Inca turismo'
  ],
  'cuesta-miranda': [
    'Cuesta de Miranda',
    'Cuesta de Miranda La Rioja',
    'Miranda Chilecito',
    'Ruta 40 Miranda',
    'Cuesta de Miranda drone'
  ],
  'aventura-4x4': [
    '4x4 La Rioja',
    'Turismo aventura La Rioja',
    'Cordillera La Rioja',
    'Expedición La Rioja',
    'Overland Argentina',
    '4x4 Vinchina',
    'Ruta cordillerana La Rioja'
  ],
  'naturaleza': [
    'Paisajes La Rioja Argentina',
    'Naturaleza La Rioja',
    'Drone La Rioja',
    'Turismo La Rioja',
    'Atardecer La Rioja',
    'Montañas La Rioja'
  ],
};

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: { url: string };
        high?: { url: string };
        default?: { url: string };
      };
      channelTitle: string;
      publishedAt: string;
    };
  }>;
  nextPageToken?: string;
}

function getYouTubeApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn('YOUTUBE_API_KEY not configured - using mock data');
    return '';
  }
  return apiKey;
}

export async function searchVideos(
  category: CategorySlug,
  maxResults: number = 10
): Promise<YouTubeVideo[]> {
  const apiKey = getYouTubeApiKey();
  
  // If no API key, return empty array (will use cached data)
  if (!apiKey) {
    console.log('No YouTube API key - returning empty array');
    return [];
  }

  const keywords = CATEGORY_KEYWORDS[category];
  const allVideos: YouTubeVideo[] = [];

  // Search with multiple keywords per category - add "short" for Shorts filtering
  for (const keyword of keywords.slice(0, 2)) {
    try {
      const url = new URL(`${YOUTUBE_API_BASE}/search`);
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('q', `${keyword} shorts`);
      url.searchParams.set('type', 'video');
      url.searchParams.set('videoDuration', 'short');
      url.searchParams.set('videoEmbeddable', 'true');
      url.searchParams.set('maxResults', '15');
      url.searchParams.set('key', apiKey);
      url.searchParams.set('regionCode', 'AR');
      url.searchParams.set('relevanceLanguage', 'es');
      url.searchParams.set('safeSearch', 'moderate');
      url.searchParams.set('order', 'date');
      
      // Filtro para solo videos de los últimos 2 años
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      url.searchParams.set('publishedAfter', twoYearsAgo.toISOString());

      const response = await fetch(url.toString(), {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        console.error(`YouTube API error: ${response.status}`);
        continue;
      }

      const data: YouTubeSearchResponse = await response.json();

      const videos: YouTubeVideo[] = (data.items || []).map((item) => ({
        id: `yt-${item.id.videoId}`,
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        // Use high quality thumbnail (640x360) instead of medium (320x180)
        thumbnailUrl: item.snippet.thumbnails.high?.url || 
                     item.snippet.thumbnails.medium?.url || 
                     item.snippet.thumbnails.default?.url || '',
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        category: category,
      }));

      allVideos.push(...videos);
    } catch (error) {
      console.error(`Error searching YouTube for "${keyword}":`, error);
    }
  }

  // Remove duplicates by videoId
  const uniqueVideos = allVideos.filter(
    (video, index, self) => index === self.findIndex((v) => v.videoId === video.videoId)
  );

  return uniqueVideos;
}

export function isCacheStale(lastUpdated: string): boolean {
  const lastUpdateTime = new Date(lastUpdated).getTime();
  const now = Date.now();
  return now - lastUpdateTime > CACHE_TTL_MS;
}

export function shouldRefreshCache(lastUpdated: string | undefined): boolean {
  if (!lastUpdated) return true;
  return isCacheStale(lastUpdated);
}

export { CATEGORY_KEYWORDS };