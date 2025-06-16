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
