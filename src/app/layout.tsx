import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider'; // Added ThemeProvider

export const metadata: Metadata = {
  title: {
    default: 'GoAventura - Tu Agencia de Viajes',
    template: '%s | GoAventura',
  },
  description: 'Reserva tu próxima aventura con GoAventura. Excursiones, transfers, alojamientos y más.',
  openGraph: {
    title: 'GoAventura - Tu Agencia de Viajes',
    description: 'Reserva tu próxima aventura con GoAventura. Excursiones, transfers, alojamientos y más.',
    url: 'https://goaventura.com.ar', // Replace with actual URL
    siteName: 'GoAventura',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=GoAventura', // Replace with actual OG image
        width: 1200,
        height: 630,
        alt: 'GoAventura Logo',
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
  // twitter: { // Add twitter specific card if needed
  //   card: 'summary_large_image',
  //   title: 'GoAventura - Tu Agencia de Viajes',
  //   description: 'Reserva tu próxima aventura con GoAventura.',
  //   creator: '@goaventura', // Replace with actual Twitter handle
  //   images: ['https://placehold.co/1200x630.png?text=GoAventura'], // Replace
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
        {/* Removed Source Code Pro as it's not defined in tailwind.config for body/headline */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "GoAventura",
            "url": "https://goaventura.com.ar", // Replace with actual URL
            "logo": "https://placehold.co/200x60.png?text=GoAventura+Logo", // Replace with actual logo URL
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+54-9-XXX-XXXXXXX", // Replace with actual phone
              "contactType": "Customer Service"
            },
            "address": { // Optional, if you want to specify address
              "@type": "PostalAddress",
              "streetAddress": "Calle Falsa 123",
              "addressLocality": "Ciudad",
              "postalCode": "CP",
              "addressCountry": "AR"
            },
            "sameAs": [ // Optional: links to social media profiles
              // "https://www.facebook.com/goaventura",
              // "https://www.instagram.com/goaventura"
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
