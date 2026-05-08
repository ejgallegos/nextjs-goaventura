'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { CategorySlug } from '@/lib/types';

interface CategoryFiltersProps {
  activeCategory?: string;
}

const categories: { slug: CategorySlug; label: string; emoji: string }[] = [
  { slug: 'talampaya', label: 'Talampaya', emoji: '🏜️' },
  { slug: 'laguna-brava', label: 'Laguna Brava', emoji: '🌊' },
  { slug: 'vinchina', label: 'Vinchina', emoji: '⛰️' },
  { slug: 'villa-union', label: 'Villa Unión', emoji: '🏘️' },
  { slug: 'villa-castelli', label: 'Villa Castelli', emoji: '🏡' },
  { slug: 'chilecito', label: 'Chilecito', emoji: '🏛️' },
  { slug: 'triasico', label: 'Triásico', emoji: '🦕' },
  { slug: 'corona-del-inca', label: 'Corona del Inca', emoji: '🗿' },
  { slug: 'cuesta-miranda', label: 'Cuesta de Miranda', emoji: '🚙' },
  { slug: 'aventura-4x4', label: 'Aventura 4x4', emoji: '🚙' },
  { slug: 'naturaleza', label: 'Naturaleza', emoji: '🌄' },
];

export function CategoryFilters({ activeCategory }: CategoryFiltersProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 min-w-max">
        {/* All category */}
        <Link
          href="/shorts"
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            !activeCategory
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          <span>🎬</span>
          <span>Todos</span>
        </Link>
        
        {/* Individual categories */}
        {categories.map((category) => {
          const isActive = activeCategory === category.slug;
          
          return (
            <Link
              key={category.slug}
              href={`/shorts?category=${category.slug}`}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                isActive
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}