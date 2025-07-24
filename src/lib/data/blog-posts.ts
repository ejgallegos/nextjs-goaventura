
import type { BlogPost } from '@/lib/types';
import { mockBlogPosts } from './blog';

const BLOG_POSTS_STORAGE_KEY = 'goaventura_blog_posts';

// This function handles getting data from localStorage or falling back to mocks
export async function getBlogPosts(): Promise<(BlogPost & {status: string})[]> {
    // If on the client-side, try to use localStorage
    if (typeof window !== 'undefined') {
        const storedPosts = localStorage.getItem(BLOG_POSTS_STORAGE_KEY);
        if (storedPosts) {
            try {
                // If we have data in localStorage, use it
                return JSON.parse(storedPosts);
            } catch (e) {
                console.error("Failed to parse blog posts from localStorage", e);
                // Fallback to mocks if parsing fails
            }
        }
    }
    
    // On the server OR if localStorage is empty/corrupt, use mock data
    const postsWithStatus = mockBlogPosts.map(p => ({...p, status: 'published'}));
    
    // If on client, save initial mock data to localStorage if it wasn't there
    if (typeof window !== 'undefined' && !localStorage.getItem(BLOG_POSTS_STORAGE_KEY)) {
        localStorage.setItem(BLOG_POSTS_STORAGE_KEY, JSON.stringify(postsWithStatus));
    }

    return postsWithStatus;
}

// New function to save posts to localStorage
export async function saveBlogPosts(posts: (BlogPost & {status: string})[]): Promise<void> {
    if (typeof window !== 'undefined') {
        localStorage.setItem(BLOG_POSTS_STORAGE_KEY, JSON.stringify(posts));
    }
}
