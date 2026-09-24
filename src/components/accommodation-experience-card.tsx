"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { trackAnalyticsEvent } from '@/lib/analytics';

interface AccommodationExperienceCardProps {
  productId: string;
  productType: 'excursion' | 'transfer' | 'promotion';
  href: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export default function AccommodationExperienceCard({
  productId,
  productType,
  href,
  title,
  description,
  imageUrl,
  imageAlt,
}: AccommodationExperienceCardProps) {
  return (
    <Link
      href={href}
      onClick={() => trackAnalyticsEvent('accommodation_experience_click', {
        experience_id: productId,
        experience_type: productType,
      })}
      className="group flex min-h-20 min-w-0 items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary focus-visible:outline-none"
    >
      <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
        <Image src={imageUrl} alt={imageAlt} fill sizes="80px" className="object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground group-hover:text-accent">{title}</span>
        <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{description}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    </Link>
  );
}
