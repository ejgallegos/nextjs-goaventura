'use client';

import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { YouTubeVideo } from '@/lib/types';

interface VideoCardProps {
  video: YouTubeVideo;
  onClick: (video: YouTubeVideo) => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  // Calculate aspect ratio for 9:16 vertical video
  // Using 16:9 container with adjusted styling
  return (
    <button
      onClick={() => onClick(video)}
      className="group relative w-full overflow-hidden rounded-xl bg-slate-900 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
    >
      {/* Thumbnail container - 9:16 aspect ratio */}
      <div className="relative aspect-[9/16] w-full overflow-hidden">
        {/* Image */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Play button overlay - appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-6 h-6 text-slate-900 fill-slate-900 ml-1" />
          </div>
        </div>
        
        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-xs font-medium">
            {video.duration}
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-amber-500/90 text-white text-xs font-medium capitalize">
          {video.category.replace('-', ' ')}
        </div>
      </div>
      
      {/* Video info */}
      <div className="p-3 bg-slate-900">
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-amber-400 transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1 truncate">
          {video.channelTitle}
        </p>
      </div>
    </button>
  );
}