import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShortsFeed } from '@/components/shorts/shorts-feed';
import { VideoSkeleton } from '@/components/shorts/video-skeleton';

export const metadata: Metadata = {
  title: 'Shorts Turísticos de La Rioja - Go Aventura',
  description: 'Descubre los mejores shorts turísticos de La Rioja Argentina. Videos cortos de destinos como Talampaya, Laguna Brava, Famatina y más.',
  openGraph: {
    title: 'Shorts Turísticos de La Rioja - Go Aventura',
    description: 'Descubre los mejores shorts turísticos de La Rioja Argentina.',
    type: 'website',
    url: '/shorts',
    siteName: 'Go Aventura',
    locale: 'es_AR',
  },
  alternates: {
    canonical: '/shorts',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShortsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex flex-col lg:flex-row h-full">
            <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto lg:h-screen bg-slate-800 animate-pulse" />
            <div className="w-full lg:w-1/2 p-4">
              <VideoSkeleton />
            </div>
          </div>
        }
      >
        <ShortsFeed />
      </Suspense>
    </main>
  );
}