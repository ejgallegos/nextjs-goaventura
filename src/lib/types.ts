

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price?: number;
  currency?: string;
  imageUrl: string;
  imageHint?: string; // For AI placeholder image search
  category: 'Excursion' | 'Transfer';
  tags?: string[];
  imageGallery?: { src: string; alt: string; hint: string; }[];
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  featuredOrder?: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string; // ISO string date
  author: string;
  excerpt: string;
  content: string; // Markdown or full HTML content
  imageUrl?: string;
  imageHint?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  destination: string;
  avatarUrl?: string; // Optional avatar for the author
  avatarHint?: string; // Optional hint for AI avatar image
}

export interface HeroSlide {
  id: string;
  slug: string;
  title: string;
  subtitle?: string; // Make subtitle optional
  imageUrl: string;
  imageHint?: string;
  buttonText?: string;
  buttonLink?: string;
  status: 'draft' | 'published';
  order?: number;
}

export interface FeaturedAccommodation {
  title: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
  buttonText: string;
  buttonLink: string;
}

export interface Promotion {
  id: string;
  slug: string;
  title: string;
  description: string;
  price?: number;
  currency?: string;
  imageUrl: string;
  imageHint?: string;
  status: 'draft' | 'published';
  isFeatured?: boolean;
  included?: string[];
  validity?: string;
  accommodationName?: string;
  accommodationLink?: string;
  accommodationImageUrl?: string;
  accommodationImageHint?: string;
}

// YouTube Shorts types
export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  category: string;
  tags?: string[];
}

export interface ShortsCache {
  lastUpdated: string;
  videos: YouTubeVideo[];
  categories: Record<string, YouTubeVideo[]>;
}

export type CategorySlug =
  | 'talampaya'
  | 'laguna-brava'
  | 'vinchina'
  | 'villa-union'
  | 'villa-castelli'
  | 'chilecito'
  | 'triasico'
  | 'corona-del-inca'
  | 'cuesta-miranda'
  | 'aventura-4x4'
  | 'naturaleza';

export const VALID_CATEGORIES: CategorySlug[] = [
  'talampaya',
  'laguna-brava',
  'vinchina',
  'villa-union',
  'villa-castelli',
  'chilecito',
  'triasico',
  'corona-del-inca',
  'cuesta-miranda',
  'aventura-4x4',
  'naturaleza',
];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'talampaya': 'Talampaya',
  'laguna-brava': 'Laguna Brava',
  'vinchina': 'Vinchina',
  'villa-union': 'Villa Unión',
  'villa-castelli': 'Villa Castelli',
  'chilecito': 'Chilecito',
  'triasico': 'Triásico',
  'corona-del-inca': 'Corona del Inca',
  'cuesta-miranda': 'Cuesta de Miranda',
  'aventura-4x4': 'Aventura 4x4',
  'naturaleza': 'Naturaleza',
};
