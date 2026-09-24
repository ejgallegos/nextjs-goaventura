import { WHATSAPP_NUMBER } from '@/lib/constants';

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
  coordinates?: {
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
Perfecto para matrimonios, amigos o compañeros de trabajo que desean descansar juntos. Espacio distribuido para mayor confort.

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
    booking: 'https://www.booking.com/hotel/ar/loft-centro-villa-union.es-ar.html',
    images: [
      { src: '/images/alojamientos/loft-centro-1.jpg', alt: 'Vista general del dormitorio, la sala de estar y el comedor integrados', hint: 'loft sala dormitorio comedor' },
      { src: '/images/alojamientos/loft-centro-2.jpg', alt: 'Dormitorio con cama doble y mesas de luz', hint: 'loft dormitorio cama doble' },
      { src: '/images/alojamientos/loft-centro-6.jpg', alt: 'Dos butacas y mesa baja en el espacio de estar', hint: 'loft estar butacas mesa' },
      { src: '/images/alojamientos/loft-centro-8.jpg', alt: 'Baño con ventana y paredes revestidas', hint: 'loft bano ventana revestimiento' },
      { src: '/images/alojamientos/loft-centro-10.jpg', alt: 'Cocina con heladera, mesada y mesa auxiliar', hint: 'loft cocina heladera mesada' },
      { src: '/images/alojamientos/loft-centro-11.jpg', alt: 'Espacio de cocina con mesa y sillas', hint: 'loft cocina mesa sillas' },
      { src: '/images/alojamientos/loft-centro-12.jpg', alt: 'Mesa de comedor con sillas', hint: 'loft comedor mesa sillas' },
      { src: '/images/alojamientos/loft-centro-16.jpg', alt: 'Vista lateral de la cama doble y las mesas de luz', hint: 'loft dormitorio cama mesas luz' },
      { src: '/images/alojamientos/loft-centro-17.jpg', alt: 'Baño con inodoro y lavatorio', hint: 'loft bano inodoro lavatorio' },
      { src: '/images/alojamientos/loft-centro-20.jpg', alt: 'Butacas y mesa baja en el área de estar', hint: 'loft sala estar butacas' },
      { src: '/images/alojamientos/loft-centro-24.jpg', alt: 'Mesa de madera y sillas en el comedor', hint: 'loft comedor mesa madera' },
      { src: '/images/alojamientos/loft-centro-25.jpg', alt: 'Mesada, alacenas y electrodomésticos de cocina', hint: 'loft cocina mesada alacenas' },
      { src: '/images/alojamientos/loft-centro-28.jpg', alt: 'Baño con ducha e inodoro', hint: 'loft bano ducha inodoro' },
      { src: '/images/alojamientos/loft-centro-32.jpg', alt: 'Comedor y cocina con espacio de guardado', hint: 'loft cocina comedor' },
      { src: '/images/alojamientos/loft-centro-34.jpg', alt: 'Dormitorio con cama doble y respaldo', hint: 'loft dormitorio cama doble' },
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
🌄 **Vistas Espectaculares**
Despertá cada mañana con una vista increíble de las montañas riojanas. Nuestro jardín te invita a relajarte y conectar con la naturaleza.

👨‍👩‍👧‍👦 **Espacio para Toda la Familia**
Con 3 habitaciones y 2 baños, hay lugar para todos. La sala de estar es el punto de encuentro perfecto para compartir momentos en familia.

🍳 **Cocina Equipada**
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
      '🏔️ Vistas a la montaña',
      '🛋️ Sala de Estar',
      '🍳 Cocina Equipada',
    ],
    whatsapp: '5493825575566',
    booking: 'https://www.booking.com/hotel/ar/la-hacienda-villa-union.es-ar.html',
    images: [
      { src: '/images/alojamientos/casa-altos-i-pileta-1.jpg', alt: 'Vista de la pileta, las reposeras y la casa', hint: 'casa altos i pileta casa reposeras' },
      { src: '/images/alojamientos/casa-altos-i-fachada.jpg', alt: 'Fachada y acceso vehicular de la casa', hint: 'casa altos i fachada acceso' },
      { src: '/images/alojamientos/casa-altos-i-pileta-2.jpg', alt: 'Pileta con sector de hidromasaje y reposeras', hint: 'casa altos i pileta hidromasaje' },
      { src: '/images/alojamientos/casa-altos-i-patio-1.jpg', alt: 'Patio cubierto con mesa y vista al jardín', hint: 'casa altos i patio mesa jardin' },
      { src: '/images/alojamientos/casa-altos-i-patio-3.jpg', alt: 'Vista amplia del jardín junto a la pileta', hint: 'casa altos i jardin pileta' },
      { src: '/images/alojamientos/casa-altos-i-interior-patio.jpg', alt: 'Ambiente interior con salida al jardín', hint: 'casa altos i interior salida jardin' },
      { src: '/images/alojamientos/casa-5.jpg', alt: 'Dormitorio con cama individual y mesa auxiliar', hint: 'casa altos i dormitorio cama' },
      { src: '/images/alojamientos/casa-7.jpg', alt: 'Dormitorio con cama y puertas vidriadas al exterior', hint: 'casa altos i dormitorio puertas vidriadas' },
      { src: '/images/alojamientos/casa-18.jpg', alt: 'Dormitorio con cama doble junto a la ventana', hint: 'casa altos i dormitorio cama ventana' },
      { src: '/images/alojamientos/casa-10.jpg', alt: 'Sala de estar con sofá, sillones y televisor', hint: 'casa altos i sala sofa televisor' },
      { src: '/images/alojamientos/casa-13.jpg', alt: 'Sala de estar con televisor y mesa', hint: 'casa altos i sala televisor mesa' },
      { src: '/images/alojamientos/casa-14.jpg', alt: 'Comedor junto a la cocina equipada', hint: 'casa altos i comedor cocina' },
      { src: '/images/alojamientos/casa-15.jpg', alt: 'Baño con inodoro y lavatorio', hint: 'casa altos i bano inodoro lavatorio' },
      { src: '/images/alojamientos/casa-17.jpg', alt: 'Baño con ducha y lavatorio', hint: 'casa altos i bano ducha lavatorio' },
      { src: '/images/alojamientos/casa-19.jpg', alt: 'Cocina con mesada, alacenas y heladera', hint: 'casa altos i cocina mesada alacenas' },
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
Cerca del centro pero en un entorno tranquilo. Fácil acceso a restaurantes, supermarkets y atracciones turísticas.
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
    booking: 'https://www.booking.com/hotel/ar/altos-del-talampaya-ii.es-ar.html',
    images: [
      { src: '/images/alojamientos/casa-ii-3.jpg', alt: 'Fachada iluminada de Casa Altos del Talampaya II', hint: 'casa ii fachada iluminada' },
      { src: '/images/alojamientos/casa-ii-1.jpg', alt: 'Sala de estar con sofá y sillones', hint: 'casa ii sala sofa sillones' },
      { src: '/images/alojamientos/casa-ii-9.jpg', alt: 'Cocina con mesada y alacenas', hint: 'casa ii cocina mesada alacenas' },
      { src: '/images/alojamientos/casa-ii-4.jpg', alt: 'Baño con inodoro y lavatorio', hint: 'casa ii bano inodoro lavatorio' },
      { src: '/images/alojamientos/casa-ii-12.jpg', alt: 'Dormitorio con cama doble y luz de lectura', hint: 'casa ii dormitorio cama doble' },
      { src: '/images/alojamientos/casa-ii-6.jpg', alt: 'Vista exterior de la fachada y el acceso', hint: 'casa ii fachada acceso exterior' },
      { src: '/images/alojamientos/casa-ii-10.jpg', alt: 'Sala de estar con sofá y televisor', hint: 'casa ii sala sofa televisor' },
      { src: '/images/alojamientos/casa-ii-2.jpg', alt: 'Dormitorio con cama doble y televisor', hint: 'casa ii dormitorio cama televisor' },
      { src: '/images/alojamientos/casa-ii-11.jpg', alt: 'Baño con ducha y lavatorio', hint: 'casa ii bano ducha lavatorio' },
      { src: '/images/alojamientos/casa-ii-5.jpg', alt: 'Dormitorio con cama doble y mesas de luz', hint: 'casa ii dormitorio cama mesas luz' },
      { src: '/images/alojamientos/casa-ii-8.jpg', alt: 'Sala de estar con sillones y mesa baja', hint: 'casa ii sala sillones mesa' },
      { src: '/images/alojamientos/casa-ii-14.jpg', alt: 'Dormitorio con cama y mesa auxiliar', hint: 'casa ii dormitorio cama auxiliar' },
      { src: '/images/alojamientos/casa-ii-13.jpg', alt: 'Dormitorio con cama doble y mesa de luz', hint: 'casa ii dormitorio cama mesa' },
      { src: '/images/alojamientos/casa-ii-7.jpg', alt: 'Dormitorio con cama y televisor', hint: 'casa ii dormitorio cama televisor' },
    ],
    highlights: [
      '💑 Ideal para parejas',
      '🚗 Cochera privada',
      '🍳 Cocina con horno y microondas',
      '📍 Cerca del centro',
      '❄️ Aire acondicionado y calefacción',
    ],
  },
  {
    id: 'casa-altos-del-talampaya-iii',
    slug: 'casa-altos-del-talampaya-iii',
    name: 'Casa Altos del Talampaya III',
    tagline: 'Una casa completa para descansar en Villa Unión',
    description:
      'Casa completa en Villa Unión para hasta 4 personas, con 2 dormitorios, cocina, aire acondicionado, Wi-Fi y estacionamiento privado gratuito. Se admiten mascotas.',
    longDescription: `
🏠 Tu espacio en Villa Unión
Disfrutá de una casa para vos y tu grupo, con espacios para descansar y compartir después de recorrer la región.

🍳 Cocina y estar
Prepará tus comidas en la cocina y compartí el día en el comedor y la sala de estar. La casa cuenta con TV de pantalla plana.

🚗 Comodidades para tu viaje
Contás con aire acondicionado, Wi-Fi gratis y estacionamiento privado gratuito en el alojamiento. Se admiten mascotas.
    `,
    shortDescription:
      'Casa completa para 4 personas con 2 dormitorios, cocina y estacionamiento privado.',
    location: 'Verne Costa, Villa Unión, La Rioja',
    mapUrl: 'https://www.google.com/maps?q=Verne+Costa%2C+Villa+Uni%C3%B3n%2C+La+Rioja&z=16&output=embed',
    capacity: '4 personas',
    bedrooms: 2,
    bathrooms: 1,
    services: [
      '🛏️ 2 Dormitorios',
      '🍳 Cocina',
      '❄️ Aire Acondicionado',
      '📶 Wi-Fi gratis',
      '📺 TV de pantalla plana',
      '🚗 Estacionamiento privado gratuito',
      '🐾 Se admiten mascotas',
    ],
    whatsapp: WHATSAPP_NUMBER,
    booking: 'https://www.booking.com/hotel/ar/casa-del-talampaya-iii.es-ar.html',
    images: [
      { src: '/images/alojamientos/casa-iii-1.jpg', alt: 'Fachada principal y acceso vehicular de Casa Altos del Talampaya III', hint: 'casa iii fachada acceso vehicular' },
      { src: '/images/alojamientos/casa-iii-4.jpg', alt: 'Vista desde la galería hacia el patio exterior', hint: 'casa iii galeria patio' },
      { src: '/images/alojamientos/casa-iii-5.jpg', alt: 'Sala de estar con sillones, mesa y televisor', hint: 'casa iii sala estar sillones' },
      { src: '/images/alojamientos/casa-iii-6.jpg', alt: 'Espacio de estar con mesa y acceso a la cocina', hint: 'casa iii estar cocina' },
      { src: '/images/alojamientos/casa-iii-8.jpg', alt: 'Cocina integrada con mesa de comedor', hint: 'casa iii cocina comedor' },
      { src: '/images/alojamientos/casa-iii-9.jpg', alt: 'Mesa de comedor junto a la cocina', hint: 'casa iii comedor cocina' },
      { src: '/images/alojamientos/casa-iii-10.jpg', alt: 'Cocina y comedor con mesada amplia', hint: 'casa iii cocina comedor mesada' },
      { src: '/images/alojamientos/casa-iii-11.jpg', alt: 'Comedor y cocina vistos desde el acceso', hint: 'casa iii comedor cocina acceso' },
      { src: '/images/alojamientos/casa-iii-12.jpg', alt: 'Comedor con acceso al pasillo de los dormitorios', hint: 'casa iii comedor pasillo dormitorios' },
      { src: '/images/alojamientos/casa-iii-13.jpg', alt: 'Dormitorio con dos camas individuales', hint: 'casa iii dormitorio camas individuales' },
      { src: '/images/alojamientos/casa-iii-14.jpg', alt: 'Dormitorio con cama doble junto a la ventana', hint: 'casa iii dormitorio cama ventana' },
      { src: '/images/alojamientos/casa-iii-15.jpg', alt: 'Dormitorio con cama doble y aire acondicionado', hint: 'casa iii dormitorio cama aire' },
      { src: '/images/alojamientos/casa-iii-17.jpg', alt: 'Baño con ducha, inodoro y lavatorio', hint: 'casa iii bano ducha inodoro lavatorio' },
      { src: '/images/alojamientos/casa-iii-18.jpg', alt: 'Detalle del lavatorio y la ducha del baño', hint: 'casa iii bano lavatorio ducha' },
      { src: '/images/alojamientos/casa-iii-19.jpg', alt: 'Vista exterior de la fachada y el acceso', hint: 'casa iii fachada acceso exterior' },
    ],
    highlights: [
      '🏠 Casa completa para 4 personas',
      '🛏️ 2 dormitorios',
      '🚗 Estacionamiento privado gratuito',
      '📶 Wi-Fi gratis',
      '🐾 Se admiten mascotas',
    ],
  },
];

export const getAccommodationBySlug = (slug: string): Accommodation | undefined => {
  return accommodations.find((accommodation) => accommodation.slug === slug);
};

export const getAccommodationById = (id: string): Accommodation | undefined => {
  return accommodations.find((accommodation) => accommodation.id === id);
};
