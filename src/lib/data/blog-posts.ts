
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { BlogPost } from '@/lib/types';
import { mockBlogPosts } from './blog';

const jsonFilePath = path.resolve(process.cwd(), 'public/data/blog-posts.json');

async function initializeJsonFile() {
    try {
        await fs.access(jsonFilePath);
    } catch {
        // If the file doesn't exist, create it with mock data
        const postsWithStatus = mockBlogPosts.map(p => ({...p, status: 'published' as const}));
        await fs.writeFile(jsonFilePath, JSON.stringify(postsWithStatus, null, 2), 'utf8');
    }
}

// This function now handles getting data from the JSON file
export async function getBlogPosts(): Promise<(BlogPost & {status: string})[]> {
    await initializeJsonFile();
    try {
        const fileContents = await fs.readFile(jsonFilePath, 'utf8');
        const posts = JSON.parse(fileContents);
        return posts;
    } catch (error) {
        console.error("Error reading or parsing blog posts JSON file:", error);
        // Fallback to mocks if reading/parsing fails
        return mockBlogPosts.map(p => ({ ...p, status: 'published' as const }));
    }
}

// New function to save posts to the JSON file
export async function saveBlogPosts(posts: (BlogPost & {status: string})[]): Promise<void> {
    try {
        await fs.writeFile(jsonFilePath, JSON.stringify(posts, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing blog posts to JSON file:", error);
    }
}
