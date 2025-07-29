
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import GoogleAnalytics from '@/components/google-analytics';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goaventura.com.ar';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Go aventura - Tu Agencia de Viajes en La Rioja',
    template: '%s | Go aventura',
  },
  description: 'Reserva tu próxima aventura con Go aventura. Excursiones, transfers, y alojamientos en La Rioja y el noroeste argentino. Leg. 20019.',
  openGraph: {
    title: {
      default: 'Go aventura - Tu Agencia de Viajes en La Rioja',
      template: '%s | Go aventura',
    },
    description: 'Reserva tu próxima aventura con Go aventura. Excursiones, transfers, y alojamientos en La Rioja y el noroeste argentino.',
    url: siteUrl, 
    siteName: 'Go aventura',
    images: [
      {
        url: '/og-image.png', // Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: 'Go aventura - Aventura en el noroeste argentino',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: { 
    card: 'summary_large_image',
    title: 'Go aventura - Tu Agencia de Viajes en La Rioja',
    description: 'Reserva tu próxima aventura con Go aventura: excursiones, transfers y más.',
    // creator: '@goaventura_twitter', // Replace with your Twitter handle
    images: ['/og-image.png'], // Replace with your actual OG image path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Go aventura',
    description: 'Agencia de viajes y turismo en La Rioja, especializada en excursiones, transfers y alojamientos en el noroeste argentino.',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/og-image.png`,
    telephone: '+5493825582955', // IMPORTANT: Replace with the real phone number
    email: 'goaventura.vya@gmail.com', // IMPORTANT: Replace with the real email
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Joaquín V. González 125',
      addressLocality: 'Villa Unión',
      addressRegion: 'La Rioja',
      postalCode: 'F5350',
      addressCountry: 'AR',
    },
    openingHours: 'Mo,Tu,We,Th,Fr,Sa,Su 08:00-22:00', // Example, adjust as needed
    sameAs: [
      // "https://www.facebook.com/goaventura", // Add your social media links
      // "https://www.instagram.com/goaventura"
    ],
    priceRange: '$$',
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
