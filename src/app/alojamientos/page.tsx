import { Metadata } from 'next';
import Link from 'next/link';
import { accommodations } from '@/lib/data/accommodations';
import ImageSlider from '@/components/image-slider';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Alojamientos - Altos del Talampaya',
  description:
    'Encuentra el alojamiento perfecto en Villa Unión. Loft Centro, Casa y Casa II. Excelentes opciones para tu estadía en La Rioja.',
};

const AlojamientosPage = () => {
  return (
		<div className="bg-background py-12 md:py-16">
			<div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground mb-4">
						Altos del Talampaya
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra selección de
						alojamientos y elige el que mejor se adapte a tus
						necesidades. Te invitamos a conocernos y ponerte en
						contacto con nuestro equipo para que podamos ayudarte a
						planificar tu próxima estancia. Sumérgete en una
						experiencia única en Villa Unión del Talampaya, ubicada
						en el corazón de la Provincia de La Rioja, Argentina.
						¡Te esperamos para que disfrutes de un viaje
						inolvidable!
					</p>
				</div>

				<div className="grid gap-12">
					{accommodations.map((accommodation) => (
						<div
							key={accommodation.id}
							className="bg-card rounded-xl overflow-hidden shadow-lg"
						>
							<div className="grid md:grid-cols-2 gap-0">
								<div className="aspect-[4/3] md:aspect-auto">
									<ImageSlider
										images={accommodation.images}
										className="w-full h-full"
									/>
								</div>

								<div className="p-6 md:p-8 flex flex-col">
									<Link
										href={`/alojamientos/${accommodation.slug}`}
										className="group"
									>
										<h2 className="font-headline text-2xl md:text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
											{accommodation.name}
										</h2>
									</Link>

									<div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
										<span>{accommodation.location}</span>
										<span>•</span>
										<span>{accommodation.capacity}</span>
										{accommodation.bedrooms > 0 && (
											<>
												<span>•</span>
												<span>
													{accommodation.bedrooms} hab
												</span>
											</>
										)}
										{accommodation.bathrooms > 0 && (
											<>
												<span>•</span>
												<span>
													{accommodation.bathrooms}{" "}
													baño
													{accommodation.bathrooms > 1
														? "s"
														: ""}
												</span>
											</>
										)}
									</div>

									<p className="text-muted-foreground mb-2 flex-grow">
										{accommodation.description}
									</p>

									<Link
										href={`/alojamientos/${accommodation.slug}`}
										className="text-primary font-medium mb-6 hover:underline flex items-center gap-1"
									>
										Ver todos los detalles{" "}
										<ArrowRight className="h-4 w-4" />
									</Link>

									<div className="mb-6">
										<h3 className="font-semibold text-sm text-foreground mb-3">
											Servicios:
										</h3>
										<div className="flex flex-wrap gap-2">
											{accommodation.services.map(
												(service) => (
													<span
														key={service}
														className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary"
													>
														{service}
													</span>
												),
											)}
										</div>
									</div>

									<div className="flex flex-col sm:flex-row gap-3">
										<WhatsAppCtaButton
											predefinedText={`Hola, me interesa el alojamiento ${accommodation.name}. ¿Qué disponibilidad tienen?`}
											buttonText="Consultar por WhatsApp"
											phoneNumber={accommodation.whatsapp}
											variant="whatsapp"
											size="lg"
											className="flex-1"
										/>
										{accommodation.booking && (
											<a
												href={accommodation.booking}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-booking text-booking-foreground hover:bg-booking/90 h-11 px-8"
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

				<div className="mt-16 text-center">
					<p className="text-muted-foreground mb-4">
						¿Necesitás más información? Nuestro equipo está
						disponible para ayudarte.
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
