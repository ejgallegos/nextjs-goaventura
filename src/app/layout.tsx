
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: {
    default: 'Go aventua - Tu Agencia de Viajes',
    template: '%s | Go aventua',
  },
  description: 'Reserva tu próxima aventura con Go aventua. Excursiones, transfers, alojamientos y más.',
  openGraph: {
    title: 'Go aventua - Tu Agencia de Viajes',
    description: 'Reserva tu próxima aventura con Go aventua. Excursiones, transfers, alojamientos y más.',
    url: 'https://goaventua.com.ar', 
    siteName: 'Go aventua',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=Go aventua', 
        width: 1200,
        height: 630,
        alt: 'Go aventua Logo',
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
  // twitter: { 
  //   card: 'summary_large_image',
  //   title: 'Go aventua - Tu Agencia de Viajes',
  //   description: 'Reserva tu próxima aventura con Go aventua.',
  //   creator: '@goaventua', 
  //   images: ['https://placehold.co/1200x630.png?text=Go aventua'], 
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "Go aventua",
            "url": "https://goaventua.com.ar", 
            "logo": "https://goaventua.com.ar/logo.png", // Updated logo URL
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+54-9-XXX-XXXXXXX", 
              "contactType": "Customer Service"
            },
            "address": { 
              "@type": "PostalAddress",
              "streetAddress": "Calle Falsa 123",
              "addressLocality": "Ciudad",
              "postalCode": "CP",
              "addressCountry": "AR"
            },
            "sameAs": [ 
              // "https://www.facebook.com/goaventua",
              // "https://www.instagram.com/goaventua"
            ]
          }) }}
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
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
