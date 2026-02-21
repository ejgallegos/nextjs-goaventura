import { Metadata } from 'next';
import Link from 'next/link';
import { accommodations } from '@/lib/data/accommodations';
import ImageSlider from '@/components/image-slider';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

			{/* Alojamientos List */}
			<div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 md:py-12">
				<div className="space-y-8 md:space-y-12">
					{accommodations.map((accommodation) => (
						<div
							key={accommodation.id}
							className="bg-card rounded-xl overflow-hidden shadow-lg border"
						>
							{/* Mobile: Image on top, Desktop: Image on left */}
							<div className="flex flex-col md:flex-row">
								{/* Image */}
								<div className="relative w-full md:w-1/2 h-56 sm:h-64 md:h-auto md:min-h-[400px]">
									<ImageSlider
										images={accommodation.images}
										className="absolute inset-0"
									/>
								</div>

								{/* Content */}
								<div className="p-5 sm:p-6 md:p-8 flex flex-col flex-1">
									<Link
										href={`/alojamientos/${accommodation.slug}`}
										className="group"
									>
										<h2 className="font-headline text-2xl md:text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
											{accommodation.name}
										</h2>
									</Link>

									<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mb-4">
										<span className="flex items-center gap-1">
											<MapPin className="h-3.5 w-3.5" />
											{accommodation.location}
										</span>
										<span>•</span>
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

									<p className="text-sm text-muted-foreground mb-6 line-clamp-3">
										{accommodation.description}
									</p>

									{/* Services */}
									<div className="mb-6">
										<h3 className="font-semibold text-sm text-foreground mb-3">
											Servicios:
										</h3>
										<div className="flex flex-wrap gap-2">
											{accommodation.services.slice(0, 6).map((service) => (
												<span
													key={service}
													className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary"
												>
													{service}
												</span>
											))}
											{accommodation.services.length > 6 && (
												<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-muted text-muted-foreground">
													+{accommodation.services.length - 6}
												</span>
											)}
										</div>
									</div>

									{/* Actions */}
									<div className="flex flex-col sm:flex-row gap-3 mt-auto">
										<WhatsAppCtaButton
											predefinedText={`Hola, me interesa el alojamiento ${accommodation.name}. ¿Qué disponibilidad tienen?`}
											buttonText="Consultar por WhatsApp"
											phoneNumber={accommodation.whatsapp}
											variant="whatsapp"
											size="lg"
											className="w-full sm:flex-1"
										/>
										{accommodation.booking && (
											<a
												href={accommodation.booking}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-booking text-booking-foreground hover:bg-booking/90 h-11 px-6 w-full sm:w-auto sm:flex-1"
											>
												Reservar en Booking
											</a>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Contact CTA */}
				<div className="mt-12 md:mt-16 text-center bg-muted rounded-xl p-8">
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
			</div>
		</div>
  );
};

export default AlojamientosPage;
