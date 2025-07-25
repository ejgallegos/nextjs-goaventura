
'use server';

import { promises as fs } from 'fs';
import path from 'path';

export interface ProductStat {
    id: string;
    name: string;
    views: number;
    whatsappClicks: number;
}

export interface StatisticsData {
    products: {
        [productId: string]: ProductStat;
    };
    summary: {
        totalViews: number;
        totalWhatsappClicks: number;
    }
}

const jsonFilePath = path.resolve(process.cwd(), 'public/data/statistics.json');

const initialData: StatisticsData = {
    products: {},
    summary: {
        totalViews: 0,
        totalWhatsappClicks: 0
    }
};

async function initializeJsonFile() {
    try {
        await fs.access(jsonFilePath);
    } catch {
        await fs.writeFile(jsonFilePath, JSON.stringify(initialData, null, 2), 'utf8');
    }
}

export async function getStatistics(): Promise<StatisticsData> {
    await initializeJsonFile();
    try {
        const fileContents = await fs.readFile(jsonFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Error reading or parsing statistics JSON file:", error);
        return initialData;
    }
}

async function saveStatistics(data: StatisticsData): Promise<void> {
    try {
        await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing statistics to JSON file:", error);
    }
}

// --- Tracking Functions ---

export async function trackView(productId: string, productName: string) {
    try {
        const stats = await getStatistics();
        
        // Product specific
        if (!stats.products[productId]) {
            stats.products[productId] = { id: productId, name: productName, views: 0, whatsappClicks: 0 };
        }
        stats.products[productId].name = productName; // Update name in case it changes
        stats.products[productId].views = (stats.products[productId].views || 0) + 1;
        
        // Summary
        stats.summary.totalViews = (stats.summary.totalViews || 0) + 1;
        
        await saveStatistics(stats);
    } catch (error) {
        console.error(`Failed to track view for product ${productId}:`, error);
    }
}

export async function trackWhatsappClick(productId: string, productName: string) {
     try {
        const stats = await getStatistics();

        // Product specific
        if (!stats.products[productId]) {
            stats.products[productId] = { id: productId, name: productName, views: 0, whatsappClicks: 0 };
        }
        stats.products[productId].name = productName;
        stats.products[productId].whatsappClicks = (stats.products[productId].whatsappClicks || 0) + 1;

        // Summary
        stats.summary.totalWhatsappClicks = (stats.summary.totalWhatsappClicks || 0) + 1;
        
        await saveStatistics(stats);
    } catch (error) {
        console.error(`Failed to track WhatsApp click for product ${productId}:`, error);
    }
}
