
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { HeroSlide } from '@/lib/types';

const jsonFilePath = path.resolve(process.cwd(), 'public/data/slides.json');

const mockSlides: HeroSlide[] = [
  {
    id: 'slide001',
    slug: 'reserva-tu-proxima-go-aventura',
    title: 'Reserva tu próxima <span>¡Go aventura!</span>',
    subtitle: 'Descubre excursiones emocionantes, transfers confiables y los mejores alojamientos con Go aventura. Tu viaje soñado comienza aquí.',
    imageUrl: '/slider/slider-0.png',
    imageHint: 'adventure landscape mountains',
    buttonText: 'Explorar Viajes',
    buttonLink: '/viajes',
    status: 'published',
    order: 1,
  },
  {
    id: 'slide002',
    slug: 'paisaje-de-aventura-inspirador-2',
    title: 'Aventura en la <span>Naturaleza</span>',
    subtitle: 'Explora paisajes que te dejarán sin aliento.',
    imageUrl: '/slider/lb-slider-3.png',
    imageHint: 'serene beach sunset',
    buttonText: 'Ver Excursiones',
    buttonLink: '/viajes',
    status: 'published',
    order: 2,
  },
    {
    id: 'slide003',
    slug: 'canon-talampaya',
    title: 'Cañon del <span>Talampaya</span>',
    subtitle: 'Una maravilla natural que tienes que conocer.',
    imageUrl: '/slider/canon.png',
    imageHint: 'talampaya canyon',
    buttonText: 'Contáctanos',
    buttonLink: '/contacto',
    status: 'published',
    order: 3,
  },
  {
    id: 'slide004',
    slug: 'fauna-autoctona',
    title: 'Conoce nuestra <span>Fauna</span>',
    subtitle: 'La Rioja es hogar de una gran diversidad de especies.',
    imageUrl: '/slider/zorro.png',
    imageHint: 'fox desert',
    buttonText: '',
    buttonLink: '',
    status: 'published',
    order: 4,
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
