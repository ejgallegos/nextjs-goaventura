import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { accommodations } from '@/lib/data/accommodations';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import AwinBookingBanner from '@/components/awin-booking-banner';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alojamientos - Altos del Talampaya',
  description:
    'Encuentra el alojamiento perfecto en Villa Unión. Loft Centro, Casa y Casa II. Excelentes opciones para tu estadía en La Rioja.',
};

const AlojamientosPage = () => {
  return (
		<div className="bg-background">
			{/* Header */}
			<div className="bg-muted py-10 md:py-16">
				<div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
							Altos del Talampaya
						</h1>
						<p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
							Descubre nuestra selección de alojamientos y elige el que mejor se adapte a tus necesidades. 
							Te esperamos en Villa Unión, La Rioja.
						</p>
					</div>
				</div>
			</div>

			{/* Alojamientos Grid */}
			<div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 md:py-12">
				{/* Grid de cards pequeñas */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
					{accommodations.map((accommodation) => (
						<Link
							key={accommodation.id}
							href={`/alojamientos/${accommodation.slug}`}
							className="group bg-card rounded-xl overflow-hidden shadow-md border hover:shadow-lg transition-shadow"
						>
							{/* Image */}
							<div className="relative aspect-[4/3] bg-muted">
								{accommodation.images[0] && (
									<Image
										src={accommodation.images[0].src}
										alt={accommodation.images[0].alt}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="object-cover"
									/>
								)}
							</div>

							{/* Content */}
							<div className="p-4">
								<h2 className="font-headline text-lg md:text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
									{accommodation.name}
								</h2>

								<div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
									<MapPin className="h-3 w-3 flex-shrink-0" />
									<span className="line-clamp-1">{accommodation.location}</span>
								</div>

								<div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mb-3">
									<span>{accommodation.capacity}</span>
									{accommodation.bedrooms > 0 && (
										<>
											<span>•</span>
											<span>{accommodation.bedrooms} hab</span>
										</>
									)}
									{accommodation.bathrooms > 0 && (
										<>
											<span>•</span>
											<span>{accommodation.bathrooms} baño{accommodation.bathrooms > 1 ? 's' : ''}</span>
										</>
									)}
								</div>

								{/* Services */}
								<div className="flex flex-wrap gap-1.5">
									{accommodation.services.slice(0, 4).map((service) => (
										<span
											key={service}
											className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary"
										>
											{service}
										</span>
									))}
									{accommodation.services.length > 4 && (
										<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground">
											+{accommodation.services.length - 4}
										</span>
									)}
								</div>
							</div>
						</Link>
					))}
				</div>

				{/* Contact CTA */}
				<div className="mt-12 md:mt-16 bg-muted rounded-xl p-8">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="text-center md:text-left">
							<p className="text-muted-foreground mb-4">
								¿Necesitás más información?
							</p>
							<WhatsAppCtaButton
								predefinedText="Hola, necesito información sobre los alojamientos en Villa Unión."
								buttonText="Chatear con nosotros"
								variant="outline"
								size="lg"
							/>
						</div>
						<div className="shrink-0 flex flex-col items-center gap-3">
							<AwinBookingBanner />
							<a
								href="https://tidd.ly/4nGXFth"
								target="_blank"
								rel="sponsored"
								className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
							>
								Conocé tu alojamiento más cercano
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
  );
};

export default AlojamientosPage;
