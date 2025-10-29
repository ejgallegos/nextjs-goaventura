
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { RecaptchaProvider } from './recaptcha-provider';
import Script from 'next/script';
import { Roboto, Montserrat } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goaventura.com.ar';

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default:
			"Go aventura - Tu Agencia de Viajes en Villa Unión del Talampaya",
		template: "%s | Go aventura",
	},
	description:
		"Reserva tu próxima aventura con Go aventura. Excursiones, transfers, y alojamientos en Villa Unión del Talampaya",
	openGraph: {
		title: {
			default:
				"Go aventura - Tu Agencia de Viajes en Villa Unión del Talampaya",
			template: "%s | Go aventura",
		},
		description:
			"Reserva tu próxima aventura con Go aventura. Excursiones, transfers, y alojamientos en Villa Unión del Talampaya",
		url: siteUrl,
		siteName: "Go aventura",
		images: [
			{
				url: "/logo-goaventura.png", // Replace with your actual OG image path
				width: 1200,
				height: 630,
				alt: "Go aventura - Agencia de Viajes en Villa Unión del Talampaya",
			},
		],
		locale: "es_AR",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		card: "summary_large_image",
		title: "Go aventura - Tu Agencia de Viajes en Villa Unión del Talampaya",
		description:
			"Reserva tu próxima aventura con Go aventura: excursiones, transfers y más.",
		// creator: '@goaventura_twitter', // Replace with your Twitter handle
		images: ["/logo-goaventura.png"], // Replace with your actual OG image path
	},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
		"@context": "https://schema.org",
		"@type": "TravelAgency",
		name: "Go aventura",
		description:
			"Agencia de viajes y turismo en Villa Unión del Talampaya, especializada en excursiones, transfers y alojamientos en la Pcia. de La Rioja",
		url: siteUrl,
		logo: `${siteUrl}/logo.png`,
		image: `${siteUrl}/logo-goaventura.png`,
		telephone: "+5493825405976",
		email: "info@goaventura.com.ar",
		address: {
			"@type": "PostalAddress",
			streetAddress: "San Martín S/N",
			addressLocality: "Villa Unión",
			addressRegion: "La Rioja",
			postalCode: "F5350",
			addressCountry: "AR",
		},
		openingHours: "Mo,Tu,We,Th,Fr,Sa,Su 24:00", 
    sameAs: ["https://www.instagram.com/goaventura.ok"],
		priceRange: "$$",
    makesOffer: [
      {
        "@type": "Offer",
        "name": "Excursiones en 4x4",
        "description": "Explora paisajes únicos como Laguna Brava y el Cañón del Triásico con nuestros guías expertos.",
        "url": `${siteUrl}/viajes?filter=Excursion`
      },
      {
        "@type": "Offer",
        "name": "Transfers Privados",
        "description": "Servicios de traslado seguros y confiables desde y hacia aeropuertos o puntos de interés.",
        "url": `${siteUrl}/viajes?filter=Transfer`
      },
      {
        "@type": "Offer",
        "name": "Alojamientos",
        "description": "Gestionamos y recomendamos los mejores alojamientos para asegurar tu confort.",
        "url": `${siteUrl}/alojamientos`
      }
    ],
  };

  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="es" suppressHydrationWarning className={`${roboto.variable} ${montserrat.variable}`}>
       <head>
        <link rel="preload" href="/slider/slider-0.png" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {gaMeasurementId && (
          <>
            <Script 
              strategy="afterInteractive" 
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
          <RecaptchaProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Toaster />
          </RecaptchaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
