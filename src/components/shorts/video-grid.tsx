import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VideoGridProps {
  children: ReactNode;
  className?: string;
}

export function VideoGrid({ children, className }: VideoGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:gap-6',
        // Mobile: 2 columns for vertical videos (more natural on mobile)
        'grid-cols-2',
        // Tablet (768px+): 3 columns
        'sm:grid-cols-3',
        // Desktop (1024px+): 4 columns
        'lg:grid-cols-4',
        // Large desktop (1280px+): 5 columns
        'xl:grid-cols-5',
        className
      )}
    >
      {children}
    </div>
  );
}