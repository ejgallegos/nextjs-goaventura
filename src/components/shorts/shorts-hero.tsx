import { Mountain, MapPin, Footprints } from 'lucide-react';
import { YouTubeShortsLogo } from './youtube-shorts-logo';

export function ShortsHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-28">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #f59e0b 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)`,
        }} />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
            <YouTubeShortsLogo className="w-14 h-14" />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Explora el Valle del Bermejo en{' '}
            <span className="text-amber-400">Shorts</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Descubre los destinos más incrível del Valle del Bermejo en videos cortos.
            Desde Talampaya hasta Villa Unión.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-slate-400">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">11</div>
              <div className="text-sm">Categorías</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">∞</div>
              <div className="text-sm">Aventura</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}