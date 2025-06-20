
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
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  destination: string;
  avatarUrl?: string; // Optional avatar for the author
  avatarHint?: string; // Optional hint for AI avatar image
}
