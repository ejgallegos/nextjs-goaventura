'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Mountain, MapPin, Footprints } from 'lucide-react';
import { YouTubeShortsLogo } from './youtube-shorts-logo';
import { VideoGridSkeleton } from './video-skeleton';
import { Button } from '@/components/ui/button';
import type { YouTubeVideo } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ShortsApiResponse {
  videos: YouTubeVideo[];
  lastUpdated: string;
}

const INITIAL_COUNT = 20;
const LOAD_MORE_COUNT = 20;

// Mobile Fullscreen Modal Component
function VideoModal({ video, onClose }: { video: YouTubeVideo; onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
        aria-label="Cerrar"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Video */}
      <div className="flex-1 flex items-center justify-center">
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full max-w-lg aspect-[9/16]"
        />
      </div>

      {/* Video info */}
      <div className="p-4 text-white bg-slate-900">
        <h2 className="text-lg font-semibold line-clamp-2">{video.title}</h2>
        <p className="text-slate-400 mt-1">{video.channelTitle}</p>
      </div>
    </div>
  );
}

export function ShortsFeed() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch videos
  useEffect(() => {
    async function loadVideos() {
      try {
        const response = await fetch('/api/shorts');
        if (!response.ok) throw new Error('Failed to fetch');
        const data: ShortsApiResponse = await response.json();
        setVideos(data.videos);
      } catch (err) {
        setError('Error al cargar los videos');
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + LOAD_MORE_COUNT);
  };

  // On mobile, open in modal
  const handleVideoClick = (video: YouTubeVideo) => {
    if (isMobile) {
      setSelectedVideo(video);
    } else {
      // Desktop: set selected and scroll to video
      setSelectedVideo(video);
    }
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const visibleVideos = videos.slice(0, visibleCount);
  const hasMore = visibleCount < videos.length;

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row h-full">
        <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0">
          <div className="aspect-video lg:aspect-auto lg:h-full bg-slate-800 animate-pulse" />
        </div>
        <div className="w-full lg:w-1/2 overflow-y-auto">
          <VideoGridSkeleton count={12} />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <>
      {/* Desktop Layout - Not visible on mobile */}
      <div className="hidden lg:flex lg:flex-row h-full min-h-[calc(100vh-57px)]">
        {/* Left Panel - Hero or Video */}
        <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 lg:flex lg:flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {selectedVideo ? (
            <div className="relative flex-1 flex flex-col">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="relative w-full max-w-md aspect-[9/16] lg:max-w-none lg:aspect-video lg:h-full max-lg:max-h-[70vh] rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="p-4 lg:p-6 text-white border-t border-slate-700">
                <h2 className="text-lg font-semibold line-clamp-2">{selectedVideo.title}</h2>
                <p className="text-slate-400 mt-1">{selectedVideo.channelTitle}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 lg:p-8 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)`,
                }} />
              </div>
              <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="relative z-10 max-w-lg mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                  <YouTubeShortsLogo className="w-16 h-16" />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Explora el Valle del Bermejo en <span className="text-amber-400">Shorts</span>
                </h1>
                <p className="text-slate-300 mb-8 max-w-lg">Descubre los destinos más incrível del Valle del Bermejo en videos cortos.</p>
                <div className="flex justify-center gap-6 text-slate-400">
                  <div><div className="text-2xl font-bold text-white">{videos.length}</div><div className="text-xs">Videos</div></div>
                  <div><div className="text-2xl font-bold text-white">10</div><div className="text-xs">Destinos</div></div>
                  <div><div className="text-2xl font-bold text-white">∞</div><div className="text-xs">Aventura</div></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Feed */}
        <div className="w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto p-3 bg-background">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {visibleVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className={cn(
                  "group relative aspect-[9/12] rounded-lg overflow-hidden cursor-pointer",
                  selectedVideo?.videoId === video.videoId
                    ? 'ring-2 ring-amber-500'
                    : 'hover:ring-2 hover:ring-amber-400/50'
                )}
              >
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90">
                  <h3 className="text-white text-xs line-clamp-2">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="py-6 text-center">
              <Button onClick={handleLoadMore} variant="default" size="lg">
                Cargar más ({videos.length - visibleCount} restantes)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout - Fullscreen Grid + Modal */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="p-4 bg-slate-900 text-white text-center">
          <div className="inline-flex items-center justify-center">
            <YouTubeShortsLogo className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold mt-2">
            Valle del Bermejo <span className="text-amber-400">Shorts</span>
          </h1>
        </div>

        {/* Mobile Grid */}
        <div className="grid grid-cols-2 gap-1 p-1">
          {visibleVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className="relative aspect-[9/12] rounded overflow-hidden cursor-pointer"
            >
              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/90">
                <h3 className="text-white text-[10px] line-clamp-2">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="py-4 text-center">
            <Button onClick={handleLoadMore} variant="default" size="default">
              Cargar más
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Modal */}
      {isMobile && selectedVideo && (
        <VideoModal video={selectedVideo} onClose={handleCloseModal} />
      )}
    </>
  );
}