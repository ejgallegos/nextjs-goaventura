
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { FeaturedAccommodation } from '@/lib/types';

const jsonFilePath = path.resolve(process.cwd(), 'public/data/featured-accommodation.json');

const mockData: FeaturedAccommodation = {
    title: "Altos del Talampaya",
    description: "Disfruta de una estadía inolvidable en nuestras cabañas con vistas impresionantes al Parque Nacional Talampaya. Comodidad, naturaleza y aventura te esperan.",
    imageUrl: "/images/alojamientos/loft-centro-1.jpg",
    imageHint: "cabin mountains talampaya",
    buttonText: "Ver Alojamientos",
    buttonLink: "/alojamientos"
};

async function initializeJsonFile() {
    try {
        const dataPath = path.resolve(process.cwd(), 'public/data');
        await fs.mkdir(dataPath, { recursive: true });
        await fs.access(jsonFilePath);
    } catch {
        await fs.writeFile(jsonFilePath, JSON.stringify(mockData, null, 2), 'utf8');
    }
}

export async function getFeaturedAccommodation(): Promise<FeaturedAccommodation> {
    await initializeJsonFile();
    try {
        const fileContents = await fs.readFile(jsonFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Error reading or parsing featured accommodation JSON file:", error);
        return mockData;
    }
}

export async function saveFeaturedAccommodation(data: FeaturedAccommodation): Promise<void> {
    try {
        await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing featured accommodation to JSON file:", error);
    }
}
