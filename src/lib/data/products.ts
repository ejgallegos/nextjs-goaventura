
import type { Product } from '@/lib/types';
import { mockExcursions } from './excursions';
import { mockTransfers } from './transfers';

const PRODUCTS_STORAGE_KEY = 'goaventura_products';

// This function now handles getting data from localStorage or falling back to mocks
export async function getProducts(): Promise<(Product & {status: string})[]> {
    // If on the client-side, try to use localStorage
    if (typeof window !== 'undefined') {
        const storedTasks = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (storedTasks) {
            try {
                // If we have data in localStorage, use it
                return JSON.parse(storedTasks);
            } catch (e) {
                console.error("Failed to parse products from localStorage", e);
                // Fallback to mocks if parsing fails
            }
        }
    }
    
    // On the server OR if localStorage is empty/corrupt, use mock data
    const allProducts = [...mockExcursions, ...mockTransfers];
    allProducts.sort((a, b) => a.name.localeCompare(b.name));
    const tasks = allProducts.map(p => ({...p, status: 'published'}));
    
    // If on client, save initial mock data to localStorage if it wasn't there
    if (typeof window !== 'undefined' && !localStorage.getItem(PRODUCTS_STORAGE_KEY)) {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(tasks));
    }

    return tasks;
}

// New function to save tasks to localStorage
export async function saveProducts(tasks: (Product & {status: string})[]): Promise<void> {
    if (typeof window !== 'undefined') {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(tasks));
    }
}
