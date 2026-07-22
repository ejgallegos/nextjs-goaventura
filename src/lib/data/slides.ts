
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { HeroSlide } from '@/lib/types';

const jsonFilePath = path.resolve(process.cwd(), 'public/data/slides.json');

const mockSlides: HeroSlide[] = [
  {
    id: 'slide001',
    slug: 'alojamientos-premium',
    title: 'Alojamientos Premium en <span>Villa Unión</span>',
    subtitle: 'La base ideal para explorar Talampaya y Laguna Brava con total comodidad y tranquilidad.',
    imageUrl: '/slider/slider-0.png',
    imageHint: 'luxury accommodation landscape',
    buttonText: 'Ver Disponibilidad',
    buttonLink: '/alojamientos',
    status: 'published',
    order: 1,
  },
  {
    id: 'slide002',
    slug: 'aventura-4x4-talampaya',
    title: 'Aventura 4x4 en el <span>Talampaya</span>',
    subtitle: 'Recorré los imponentes paredones rojos y descubrí los secretos de nuestros ancestros con guías expertos.',
    imageUrl: '/slider/canon.png',
    imageHint: 'talampaya canyon 4x4',
    buttonText: 'Consultar por WhatsApp',
    buttonLink: 'https://wa.me/5493825575566?text=Hola!%20Me%20interesa%20la%20excursi%C3%B3n%20al%20Talampaya.',
    status: 'published',
    order: 2,
  },
  {
    id: 'slide003',
    slug: 'mira-la-experiencia',
    title: 'Mirá la <span>experiencia real</span>',
    subtitle: 'Nuestros viajeros ya vivieron la aventura. Mirá sus videos y empezá a planear tu viaje a La Rioja.',
    imageUrl: '/slider/lb-slider-3.png',
    imageHint: 'travelers having fun nature',
    buttonText: 'Ver Shorts',
    buttonLink: '/shorts',
    status: 'published',
    order: 3,
  },
];

async function initializeJsonFile() {
    try {
        const dataPath = path.resolve(process.cwd(), 'public/data');
        await fs.mkdir(dataPath, { recursive: true });
        await fs.access(jsonFilePath);
    } catch {
        await fs.writeFile(jsonFilePath, JSON.stringify(mockSlides, null, 2), 'utf8');
    }
}

export async function getSlides(): Promise<HeroSlide[]> {
    await initializeJsonFile();
    let slides: HeroSlide[] = [];
    try {
        const fileContents = await fs.readFile(jsonFilePath, 'utf8');
        slides = JSON.parse(fileContents);
    } catch (e) {
        console.error("Failed to parse slides from JSON, falling back to mocks", e);
        slides = mockSlides;
    }
    
    slides.sort((a, b) => {
        if (a.order === undefined && b.order === undefined) return 0;
        if (a.order === undefined) return 1;
        if (b.order === undefined) return -1;
        return a.order - b.order;
    });

    return slides;
}

export async function saveSlides(slides: HeroSlide[]): Promise<void> {
    try {
        await fs.writeFile(jsonFilePath, JSON.stringify(slides, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing slides to JSON file:", error);
    }
}
