
import type { HeroSlide } from '@/lib/types';

const SLIDES_STORAGE_KEY = 'goaventura_slides';

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
  },
  {
    id: 'slide002',
    slug: 'paisaje-de-aventura-inspirador-2',
    title: 'Aventura en la <span>Naturaleza</span>',
    subtitle: 'Explora paisajes que te dejarán sin aliento.',
    imageUrl: '/slider/lb-slider-3.png',
    imageHint: 'serene beach sunset',
    buttonText: 'Ver Excursiones',
    buttonLink: '/viajes/excursiones',
    status: 'published',
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
  },
];


export async function getSlides(): Promise<HeroSlide[]> {
    if (typeof window !== 'undefined') {
        const storedSlides = localStorage.getItem(SLIDES_STORAGE_KEY);
        if (storedSlides) {
            try {
                return JSON.parse(storedSlides);
            } catch (e) {
                console.error("Failed to parse slides from localStorage", e);
            }
        } else {
             localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(mockSlides));
             return mockSlides;
        }
    }
    return mockSlides;
}

export async function saveSlides(slides: HeroSlide[]): Promise<void> {
    if (typeof window !== 'undefined') {
        localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(slides));
    }
}
