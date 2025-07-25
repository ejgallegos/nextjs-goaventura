
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { Product } from '@/lib/types';
import { mockExcursions } from './excursions';
import { mockTransfers } from './transfers';

const jsonFilePath = path.resolve(process.cwd(), 'public/data/products.json');

async function initializeJsonFile() {
    try {
        await fs.access(jsonFilePath);
    } catch {
        // If the file doesn't exist, create it with mock data
        const allProducts = [...mockExcursions, ...mockTransfers];
        allProducts.sort((a, b) => a.name.localeCompare(b.name));
        const tasks = allProducts.map(p => ({...p, status: 'published' as const}));
        await fs.writeFile(jsonFilePath, JSON.stringify(tasks, null, 2), 'utf8');
    }
}

// This function now handles getting data from the JSON file
export async function getProducts(): Promise<(Product & {status: string})[]> {
    await initializeJsonFile();
    try {
        const fileContents = await fs.readFile(jsonFilePath, 'utf8');
        const products = JSON.parse(fileContents);
        return products;
    } catch (error) {
        console.error("Error reading or parsing products JSON file:", error);
        // Fallback to mocks if reading/parsing fails
        const allProducts = [...mockExcursions, ...mockTransfers];
        allProducts.sort((a, b) => a.name.localeCompare(b.name));
        return allProducts.map(p => ({ ...p, status: 'published' as const }));
    }
}

// New function to save products to the JSON file
export async function saveProducts(products: (Product & {status: string})[]): Promise<void> {
    try {
        await fs.writeFile(jsonFilePath, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing products to JSON file:", error);
    }
}
