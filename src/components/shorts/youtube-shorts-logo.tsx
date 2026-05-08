import Image from 'next/image';
import { cn } from '@/lib/utils';

// YouTube Shorts logo - from public/images
export function YouTubeShortsLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={cn("flex-shrink-0", className)}>
      <Image
        src="/images/youtube-shorts-1.svg"
        alt="YouTube Shorts"
        width={48}
        height={48}
        className="w-full h-full"
        unoptimized
      />
    </div>
  );
}