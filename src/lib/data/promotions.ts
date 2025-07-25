
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { Promotion } from '@/lib/types';

const jsonFilePath = path.resolve(process.cwd(), 'public/data/promotions.json');

const mockPromotions: Promotion[] = [
  {
    id: 'promo_1722542400000',
    slug: 'paquete-talampaya-aventura',
    title: 'Paquete Talampaya Aventura',
    description: 'Una experiencia completa de 3 días y 2 noches para descubrir la magia de Talampaya y sus alrededores. Incluye alojamiento, excursiones y más.',
    price: 150000,
    currency: 'ARS',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'talampaya canyon adventure',
    status: 'published',
    isFeatured: true,
    included: [
      '2 Noches de alojamiento en Villa Unión',
      'Excursión al Parque Nacional Talampaya (Cañón)',
      'Excursión al Cañón del Triásico',
      'Guía profesional',
    ],
    validity: 'Válido para viajar hasta el 31/12/2024',
  }
];

async function initializeJsonFile() {
    try {
        await fs.access(jsonFilePath);
    } catch {
        // If the file doesn't exist, create it with mock data
        await fs.writeFile(jsonFilePath, JSON.stringify(mockPromotions, null, 2), 'utf8');
    }
}

export async function getPromotions(): Promise<Promotion[]> {
    await initializeJsonFile();
    try {
        const fileContents = await fs.readFile(jsonFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Error reading or parsing promotions JSON file:", error);
        return mockPromotions;
    }
}

export async function savePromotions(promotions: Promotion[]): Promise<void> {
    try {
        await fs.writeFile(jsonFilePath, JSON.stringify(promotions, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing promotions to JSON file:", error);
    }
}
