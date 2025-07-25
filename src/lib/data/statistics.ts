
'use server';

import { promises as fs } from 'fs';
import path from 'path';

export interface ProductStat {
    id: string;
    name: string;
    views: number;
    whatsappClicks: number;
    viewsByDate: { [date: string]: number };
    whatsappClicksByDate: { [date: string]: number };
}

export interface StatisticsData {
    products: {
        [productId: string]: ProductStat;
    };
    summary: {
        totalViews: number;
        totalWhatsappClicks: number;
        viewsByDate: { [date: string]: number };
        whatsappClicksByDate: { [date: string]: number };
    }
}

const jsonFilePath = path.resolve(process.cwd(), 'public/data/statistics.json');

const initialData: StatisticsData = {
    products: {},
    summary: {
        totalViews: 0,
        totalWhatsappClicks: 0,
        viewsByDate: {},
        whatsappClicksByDate: {}
    }
};

// Helper to get date in YYYY-MM-DD format
const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
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
        const data = JSON.parse(fileContents);
        // Ensure data structure is valid, especially for older data
        if (!data.summary) {
            data.summary = initialData.summary;
        }
        if (!data.products) {
            data.products = initialData.products;
        }
        return data;
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
        const today = getTodayString();
        
        // Product specific
        if (!stats.products[productId]) {
            stats.products[productId] = { 
                id: productId, 
                name: productName, 
                views: 0, 
                whatsappClicks: 0,
                viewsByDate: {},
                whatsappClicksByDate: {}
            };
        }
        stats.products[productId].name = productName; // Update name in case it changes
        stats.products[productId].views = (stats.products[productId].views || 0) + 1;
        stats.products[productId].viewsByDate[today] = (stats.products[productId].viewsByDate[today] || 0) + 1;

        // Summary
        stats.summary.totalViews = (stats.summary.totalViews || 0) + 1;
        stats.summary.viewsByDate[today] = (stats.summary.viewsByDate[today] || 0) + 1;
        
        await saveStatistics(stats);
    } catch (error) {
        console.error(`Failed to track view for product ${productId}:`, error);
    }
}

export async function trackWhatsappClick(productId: string, productName: string) {
     try {
        const stats = await getStatistics();
        const today = getTodayString();

        // Product specific
        if (!stats.products[productId]) {
             stats.products[productId] = { 
                id: productId, 
                name: productName, 
                views: 0, 
                whatsappClicks: 0,
                viewsByDate: {},
                whatsappClicksByDate: {}
            };
        }
        stats.products[productId].name = productName;
        stats.products[productId].whatsappClicks = (stats.products[productId].whatsappClicks || 0) + 1;
        stats.products[productId].whatsappClicksByDate[today] = (stats.products[productId].whatsappClicksByDate[today] || 0) + 1;

        // Summary
        stats.summary.totalWhatsappClicks = (stats.summary.totalWhatsappClicks || 0) + 1;
        stats.summary.whatsappClicksByDate[today] = (stats.summary.whatsappClicksByDate[today] || 0) + 1;

        await saveStatistics(stats);
    } catch (error) {
        console.error(`Failed to track WhatsApp click for product ${productId}:`, error);
    }
}
