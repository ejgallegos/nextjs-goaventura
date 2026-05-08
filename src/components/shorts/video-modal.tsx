'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { YouTubeVideo } from '@/lib/types';

interface VideoModalProps {
  video: YouTubeVideo | null;
  videos: YouTubeVideo[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (video: YouTubeVideo) => void;
}

export function VideoModal({ video, videos, isOpen, onClose, onNavigate }: VideoModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Find current index
  const currentIndex = video ? videos.findIndex(v => v.videoId === video.videoId) : -1;
  const hasNext = currentIndex < videos.length - 1;
  const hasPrev = currentIndex > 0;

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || !video) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasNext) {
        const nextVideo = videos[currentIndex + 1];
        onNavigate(nextVideo);
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        const prevVideo = videos[currentIndex - 1];
        onNavigate(prevVideo);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, video, hasNext, hasPrev, currentIndex, videos, onClose, onNavigate]);

  // Reset state when video changes
  useEffect(() => {
    if (video) {
      setIsLoaded(false);
    }
  }, [video?.videoId]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(videos[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      onNavigate(videos[currentIndex - 1]);
    }
  };

  if (!isOpen || !video) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={handleOverlayClick}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className={cn(
          'absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-all',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
        aria-label="Cerrar"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation arrows */}
      {hasPrev && (
        <button
          onClick={handlePrev}
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-all',
            showControls ? 'opacity-100' : 'opacity-0'
          )}
          aria-label="Video anterior"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}
      
      {hasNext && (
        <button
          onClick={handleNext}
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-all',
            showControls ? 'opacity-100' : 'opacity-0'
          )}
          aria-label="Siguiente video"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Video container */}
      <div className="relative w-full max-w-2xl mx-4">
        {/* Facade: Thumbnail with play button (before iframe loads) */}
        {!isLoaded && (
          <div className="relative aspect-[9/16] w-full bg-slate-900 rounded-xl overflow-hidden group cursor-pointer" onClick={() => setIsLoaded(true)}>
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-slate-900 fill-slate-900 ml-2" />
              </div>
            </div>
          </div>
        )}

        {/* YouTube iframe (lazy loaded) */}
        {isLoaded && (
          <div className="aspect-[9/16] w-full rounded-xl overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* Video info */}
        <div className="mt-4 text-white">
          <h2 className="text-lg font-semibold line-clamp-2">{video.title}</h2>
          <p className="text-slate-400 mt-1">{video.channelTitle}</p>
        </div>
      </div>
    </div>
  );
}