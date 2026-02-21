export interface AccommodationImage {
  src: string;
  alt: string;
  hint: string;
}

export interface Accommodation {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  shortDescription: string;
  location: string;
  mapUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  capacity: string;
  bedrooms: number;
  bathrooms: number;
  services: string[];
  whatsapp: string;
  booking?: string;
  images: AccommodationImage[];
  highlights: string[];
}

export const accommodations: Accommodation[] = [
  {
    id: 'loft-centro',
    slug: 'loft-centro',
    name: 'Loft Centro',
    tagline: 'Tu refugio perfecto en el corazón de Villa Unión',
    description:
      'Departamento moderno y acogedor en pleno centro de la ciudad. Ideal para parejas, amigos o compañeros de viaje que buscan comodidad y proximidad a todo.',
    longDescription: `
🏙️ **Ubicación Imbatible**
Estás a pasos de los principales restaurantes, comercios y atractivos de Villa Unión. Sin necesidad de auto, podés explorar todo lo que la ciudad ofrece.

🛋️ **Confort Moderno**
El departamento cuenta con todas las comodidades que necesitás para una estadía placentera: aire acondicionado para el calor riojano, calefacción para las noches frescas, y cochera privada para tu vehículo.

👨‍👩‍👧 **Ideal para Compartir**
Perfecto para matrimonios, amigos o compañeros de trabajo que desean descansar juntos. Espacio  distribuidos para mayor comfort.

📶 **Conectado Siempre**
WiFi de alta velocidad para que estés conectado con tus seres queridos o trabajes remotamente si es necesario.
    `,
    shortDescription:
      'Departamento en pleno centro de Villa Unión, ideal para parejas y amigos.',
    location: 'Villa Unión, La Rioja',
    mapUrl: 'https://maps.google.com/maps?q=-29.31720449181527,%20-68.22681317352131&t=m&z=17&output=embed&iwloc=near',
    coordinates: {
      lat: -29.31720449181527,
      lng: -68.22681317352131,
    },
    capacity: '2-4 personas',
    bedrooms: 1,
    bathrooms: 1,
    services: [
      '🛁 Baño Privado',
      '🛏️ Ropa de Cama',
      '🔥 Calefacción',
      '❄️ Aire Acondicionado',
      '📶 WiFi',
      '📺 TV',
      '🚗 Cochera',
    ],
    whatsapp: '5493825526275',
    booking: 'https://www.booking.com/hotel/ar/loft-centro-villa-union.en.html?aid=1623356&no_rooms=1&group_adults=2',
    images: [
      { src: '/images/alojamientos/loft-centro-1.jpg', alt: 'Loft Centro - Sala principal', hint: 'loft centro sala' },
      { src: '/images/alojamientos/loft-centro-2.jpg', alt: 'Loft Centro - Habitación cómoda', hint: 'loft centro habitacion' },
      { src: '/images/alojamientos/loft-centro-3.jpg', alt: 'Loft Centro - Baño privado', hint: 'loft centro bano' },
      { src: '/images/alojamientos/loft-centro-4.jpg', alt: 'Loft Centro - Cocina equipada', hint: 'loft centro cocina' },
      { src: '/images/alojamientos/loft-centro-5.jpg', alt: 'Loft Centro - Comedor', hint: 'loft centro comedor' },
      { src: '/images/alojamientos/loft-centro-6.jpg', alt: 'Loft Centro - Estar', hint: 'loft centro estar' },
      { src: '/images/alojamientos/loft-centro-7.jpg', alt: 'Loft Centro - Dormitorio', hint: 'loft centro dormitorio' },
      { src: '/images/alojamientos/loft-centro-8.jpg', alt: 'Loft Centro - Patio exterior', hint: 'loft centro patio' },
      { src: '/images/alojamientos/loft-centro-9.jpg', alt: 'Loft Centro - Baño', hint: 'loft centro bano' },
      { src: '/images/alojamientos/loft-centro-10.jpg', alt: 'Loft Centro - Cocina', hint: 'loft centro cocina' },
      { src: '/images/alojamientos/loft-centro-11.jpg', alt: 'Loft Centro - Cocina', hint: 'loft centro cocina' },
      { src: '/images/alojamientos/loft-centro-12.jpg', alt: 'Loft Centro - Comedor', hint: 'loft centro comedor' },
      { src: '/images/alojamientos/loft-centro-13.jpg', alt: 'Loft Centro - Dormitorio', hint: 'loft centro dormitorio' },
      { src: '/images/alojamientos/loft-centro-14.jpg', alt: 'Loft Centro - Dormitorio', hint: 'loft centro dormitorio' },
      { src: '/images/alojamientos/loft-centro-15.jpg', alt: 'Loft Centro - Dormitorio', hint: 'loft centro dormitorio' },
      { src: '/images/alojamientos/loft-centro-16.jpg', alt: 'Loft Centro - Dormitorio', hint: 'loft centro dormitorio' },
      { src: '/images/alojamientos/loft-centro-17.jpg', alt: 'Loft Centro - Baño', hint: 'loft centro bano' },
      { src: '/images/alojamientos/loft-centro-18.jpg', alt: 'Loft Centro - Baño', hint: 'loft centro bano' },
      { src: '/images/alojamientos/loft-centro-19.jpg', alt: 'Loft Centro - Baño', hint: 'loft centro bano' },
      { src: '/images/alojamientos/loft-centro-20.jpg', alt: 'Loft Centro - Estar', hint: 'loft centro estar' },
      { src: '/images/alojamientos/loft-centro-21.jpg', alt: 'Loft Centro - Estar', hint: 'loft centro estar' },
      { src: '/images/alojamientos/loft-centro-22.jpg', alt: 'Loft Centro - Estar', hint: 'loft centro estar' },
      { src: '/images/alojamientos/loft-centro-23.jpg', alt: 'Loft Centro - Estar', hint: 'loft centro estar' },
      { src: '/images/alojamientos/loft-centro-24.jpg', alt: 'Loft Centro - Comedor', hint: 'loft centro comedor' },
      { src: '/images/alojamientos/loft-centro-25.jpg', alt: 'Loft Centro - Comedor', hint: 'loft centro comedor' },
      { src: '/images/alojamientos/loft-centro-26.jpg', alt: 'Loft Centro - Comedor', hint: 'loft centro comedor' },
      { src: '/images/alojamientos/loft-centro-27.jpg', alt: 'Loft Centro - Comedor', hint: 'loft centro comedor' },
      { src: '/images/alojamientos/loft-centro-28.jpg', alt: 'Loft Centro - Baño', hint: 'loft centro bano' },
      { src: '/images/alojamientos/loft-centro-29.jpg', alt: 'Loft Centro - Baño', hint: 'loft centro bano' },
      { src: '/images/alojamientos/loft-centro-30.jpg', alt: 'Loft Centro - Baño', hint: 'loft centro bano' },
      { src: '/images/alojamientos/loft-centro-31.jpg', alt: 'Loft Centro - Baño', hint: 'loft centro bano' },
      { src: '/images/alojamientos/loft-centro-32.jpg', alt: 'Loft Centro - Cocina', hint: 'loft centro cocina' },
      { src: '/images/alojamientos/loft-centro-33.jpg', alt: 'Loft Centro - Cocina', hint: 'loft centro cocina' },
      { src: '/images/alojamientos/loft-centro-34.jpg', alt: 'Loft Centro - Dormitorio', hint: 'loft centro dormitorio' },
      { src: '/images/alojamientos/loft-centro-35.jpg', alt: 'Loft Centro - Dormitorio', hint: 'loft centro dormitorio' },
      { src: '/images/alojamientos/loft-centro-36.jpg', alt: 'Loft Centro - Dormitorio', hint: 'loft centro dormitorio' },
      { src: '/images/alojamientos/loft-centro-37.jpg', alt: 'Loft Centro - Dormitorio', hint: 'loft centro dormitorio' },
      { src: '/images/alojamientos/loft-centro-38.jpg', alt: 'Loft Centro - Dormitorio', hint: 'loft centro dormitorio' },
    ],
    highlights: [
      '📍 En el centro de Villa Unión',
      '🚗 Cochera privada incluida',
      '❄️ Aires acondicionado y calefacción',
      '📶 WiFi de alta velocidad',
    ],
  },
  {
    id: 'altos-del-talampaya-casa',
    slug: 'altos-del-talampaya-casa',
    name: 'Altos del Talampaya Casa',
    tagline: 'Espacio familiar con jardín y vistas a la montaña',
    description:
      'Casa completa con 3 habitaciones, ideal para familias o grupos. Disfrutá de un hermoso patio con jardín y impresionantes vistas a la montaña.',
    longDescription: `
🌄 **Vistas Spectaculares**
Despertá cada mañana con una vista increíble de las montañas riojanas. Nuestro jardín te invita a relajarte y conectar con la naturaleza.

👨‍👩‍👧‍👦 **Espacio para Toda la Familia**
Con 3 habitaciones y 2 baños, hay lugar para todos. La sala de estar es el punto de encuentro perfecto para compartir momentos en familia.

🍳 **Cocina Completa**
Cocina-comedor totalmente equipada con todo lo que necesitás: hornalla, horno, heladera, vajilla y utensilios. Prepará tus comidas favoritas.

🌳 **Jardín y Exterior**
El hermoso patio con jardín es ideal para niños, mascotas o simplemente para relajarte al aire libre. Asados, mates o lectura... lo que vos quieras.

🛣️ **Cerca de Todo**
A solo minutos del centro de Villa Unión y en la entrada de la ciudad, fácil acceso para explorar la región.
    `,
    shortDescription:
      'Casa completa con 3 habitaciones, ideal para familias. Patio con jardín y vistas a la montaña.',
    location: 'Villa Unión, La Rioja',
    mapUrl: 'https://www.google.com/maps?q=-29.327004271198664,-68.22305917749192&z=17&output=embed&iwloc=near',
    coordinates: {
      lat: -29.327004271198664,
      lng: -68.22305917749192,
    },
    capacity: '6-8 personas',
    bedrooms: 3,
    bathrooms: 2,
    services: [
      '🛁 2 Baños Privados',
      '🛏️ Ropa de Cama',
      '🔥 Calefacción',
      '❄️ Aire Acondicionado',
      '📶 WiFi',
      '📺 TV',
      '🚗 Cochera',
      '🌳 Jardín',
      '🏔️ Vistas a la Montaña',
      '🛋️ Sala de Estar',
      '🍳 Cocina Equipada',
    ],
    whatsapp: '5493825575566',
    booking: 'https://www.booking.com/hotel/ar/la-hacienda-villa-union.en.html?aid=1623356&no_rooms=1&group_adults=2',
    images: [
      { src: '/images/alojamientos/casa-1.jpg', alt: 'Casa - Exterior con patio', hint: 'casa exterior patio' },
      { src: '/images/alojamientos/casa-2.jpg', alt: 'Casa - Sala de estar', hint: 'casa interior sala' },
      { src: '/images/alojamientos/casa-3.jpg', alt: 'Casa - Habitación cómoda', hint: 'casa habitacion' },
      { src: '/images/alojamientos/casa-4.jpg', alt: 'Casa - Patio con jardín', hint: 'casa patio jardin' },
      { src: '/images/alojamientos/casa-5.jpg', alt: 'Casa - Cocina equipada', hint: 'casa cocina equipada' },
      { src: '/images/alojamientos/casa-6.jpg', alt: 'Casa - Habitación', hint: 'casa habitacion' },
      { src: '/images/alojamientos/casa-7.jpg', alt: 'Casa - Baño', hint: 'casa bano' },
      { src: '/images/alojamientos/casa-8.jpg', alt: 'Casa - Sala', hint: 'casa sala' },
      { src: '/images/alojamientos/casa-9.jpg', alt: 'Casa - Dormitorio', hint: 'casa dormitorio' },
      { src: '/images/alojamientos/casa-10.jpg', alt: 'Casa - Habitación', hint: 'casa habitacion' },
      { src: '/images/alojamientos/casa-11.jpg', alt: 'Casa - Baño', hint: 'casa bano' },
      { src: '/images/alojamientos/casa-12.jpg', alt: 'Casa - Cocina', hint: 'casa cocina' },
      { src: '/images/alojamientos/casa-13.jpg', alt: 'Casa - Interior', hint: 'casa interior' },
      { src: '/images/alojamientos/casa-14.jpg', alt: 'Casa - Dormitorio', hint: 'casa dormitorio' },
      { src: '/images/alojamientos/casa-15.jpg', alt: 'Casa - Habitación', hint: 'casa habitacion' },
      { src: '/images/alojamientos/casa-16.jpg', alt: 'Casa - Baño', hint: 'casa bano' },
      { src: '/images/alojamientos/casa-17.jpg', alt: 'Casa - Cocina', hint: 'casa cocina' },
      { src: '/images/alojamientos/casa-18.jpg', alt: 'Casa - Interior', hint: 'casa interior' },
      { src: '/images/alojamientos/casa-19.jpg', alt: 'Casa - Habitación', hint: 'casa habitacion' },
      { src: '/images/alojamientos/casa-20.jpg', alt: 'Casa - Sala de estar', hint: 'casa estar' },
      { src: '/images/alojamientos/casa-21.jpg', alt: 'Casa - Dormitorio', hint: 'casa dormitorio' },
      { src: '/images/alojamientos/casa-22.jpg', alt: 'Casa - Habitación', hint: 'casa habitacion' },
      { src: '/images/alojamientos/casa-23.jpg', alt: 'Casa - Baño', hint: 'casa bano' },
      { src: '/images/alojamientos/casa-24.jpg', alt: 'Casa - Cocina', hint: 'casa cocina' },
      { src: '/images/alojamientos/casa-25.jpg', alt: 'Casa - Interior', hint: 'casa interior' },
      { src: '/images/alojamientos/casa-26.jpg', alt: 'Casa - Habitación', hint: 'casa habitacion' },
      { src: '/images/alojamientos/casa-27.jpg', alt: 'Casa - Dormitorio', hint: 'casa dormitorio' },
      { src: '/images/alojamientos/casa-28.jpg', alt: 'Casa - Baño', hint: 'casa bano' },
      { src: '/images/alojamientos/casa-29.jpg', alt: 'Casa - Cocina', hint: 'casa cocina' },
      { src: '/images/alojamientos/casa-30.jpg', alt: 'Casa - Interior', hint: 'casa interior' },
      { src: '/images/alojamientos/casa-31.jpg', alt: 'Casa - Habitación', hint: 'casa habitacion' },
      { src: '/images/alojamientos/casa-32.jpg', alt: 'Casa - Exterior', hint: 'casa exterior' },
    ],
    highlights: [
      '🏔️ Vistas a la montaña',
      '🌳 Jardín con patio',
      '👨‍👩‍👧‍👦 3 habitaciones - hasta 8 personas',
      '🍳 Cocina completa',
      '🚗 Cochera para varios vehículos',
    ],
  },
  {
    id: 'altos-del-talampaya-casa-ii',
    slug: 'altos-del-talampaya-casa-ii',
    name: 'Altos del Talampaya Casa II',
    tagline: 'Escapada romántica para dos',
    description:
      'Casa acogedora diseñada especialmente para parejas. Ambiente íntimo, cocina completa y cochera privada. Perfecta para una escapada romántica.',
    longDescription: `
💑 **Diseñado para Parejas**
Cada detalle pensado para crear un ambiente romántico y íntimo. Espacio perfecto para celebrar aniversarios, luna de miel o simplemente escapar de la rutina.

🍳 **Cocina de Chef**
Cocina totalmente equipada con horno, microondas, heladera y todos los utensilios. Prepará una cena especial para dos y compartila en el comedor.

🚗 **Cochera Privada**
Tu vehículo seguro y protegido. Entrada independiente para mayor privacidad y tranquilidad durante tu estadía.

❄️ **Confort Total**
Aire acondicionado frío/calor para cualquier época del año. La Rioja tiene veranos intensos y noches frescas... estás preparado para todo.

📍 **Ubicación Perfecta**
Cerca del centro pero en un entorno tranquilo. Fácil acceso a restaurantes, supermarkets y attractions turísticos.
    `,
    shortDescription:
      'Casa acogedora para dos personas. Cocina completa y cochera privada.',
    location: 'Villa Unión, La Rioja',
    mapUrl: 'https://www.google.com/maps?q=-29.32156271227418,-68.22527481842684&z=17&output=embed&iwloc=near',
    coordinates: {
      lat: -29.32156271227418,
      lng: -68.22527481842684,
    },
    capacity: '2 personas',
    bedrooms: 1,
    bathrooms: 1,
    services: [
      '🛁 Baño Privado',
      '🛏️ Ropa de Cama',
      '🧴 Toallas',
      '🔥 Calefacción',
      '❄️ Aire Acondicionado',
      '📶 WiFi',
      '📺 TV',
      '🚗 Cochera Privada',
      '🔥 Cocina con Horno',
      '📟 Microondas',
      '🧊 Heladera',
    ],
    whatsapp: '5493825410538',
    images: [
      { src: '/images/alojamientos/casa-ii-1.jpg', alt: 'Casa II - Fachada', hint: 'casa ii exterior' },
      { src: '/images/alojamientos/casa-ii-2.jpg', alt: 'Casa II - Interior acogedor', hint: 'casa ii interior' },
      { src: '/images/alojamientos/casa-ii-3.jpg', alt: 'Casa II - Habitación romántica', hint: 'casa ii habitacion' },
      { src: '/images/alojamientos/casa-ii-4.jpg', alt: 'Casa II - Cocina equipada', hint: 'casa ii cocina' },
      { src: '/images/alojamientos/casa-ii-5.jpg', alt: 'Casa II - Baño moderno', hint: 'casa ii bano' },
      { src: '/images/alojamientos/casa-ii-6.jpg', alt: 'Casa II - Habitación', hint: 'casa ii habitacion' },
      { src: '/images/alojamientos/casa-ii-7.jpg', alt: 'Casa II - Sala de estar', hint: 'casa ii estar' },
      { src: '/images/alojamientos/casa-ii-8.jpg', alt: 'Casa II - Cocina', hint: 'casa ii cocina' },
      { src: '/images/alojamientos/casa-ii-9.jpg', alt: 'Casa II - Baño', hint: 'casa ii bano' },
      { src: '/images/alojamientos/casa-ii-10.jpg', alt: 'Casa II - Dormitorio', hint: 'casa ii dormitorio' },
      { src: '/images/alojamientos/casa-ii-11.jpg', alt: 'Casa II - Cocina', hint: 'casa ii cocina' },
      { src: '/images/alojamientos/casa-ii-12.jpg', alt: 'Casa II - Habitación', hint: 'casa ii habitacion' },
      { src: '/images/alojamientos/casa-ii-13.jpg', alt: 'Casa II - Baño', hint: 'casa ii bano' },
      { src: '/images/alojamientos/casa-ii-14.jpg', alt: 'Casa II - Exterior', hint: 'casa ii exterior' },
    ],
    highlights: [
      '💑 Ideal para parejas',
      '🚗 Cochera privada',
      '🍳 Cocina con horno y microondas',
      '📍 Cerca del centro',
      '❄️ Aire acondicionado y calefacción',
    ],
  },
];

export const getAccommodationBySlug = (slug: string): Accommodation | undefined => {
  return accommodations.find((accommodation) => accommodation.slug === slug);
};

export const getAccommodationById = (id: string): Accommodation | undefined => {
  return accommodations.find((accommodation) => accommodation.id === id);
};
