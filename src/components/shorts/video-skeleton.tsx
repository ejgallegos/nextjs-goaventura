import { Skeleton } from '@/components/ui/skeleton';

export function VideoSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-slate-900">
      {/* Thumbnail skeleton - 9:16 aspect ratio */}
      <Skeleton className="aspect-[9/16] w-full rounded-t-xl" />
      
      {/* Info skeleton */}
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function VideoGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <VideoSkeleton key={i} />
      ))}
    </div>
  );
}