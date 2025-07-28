
import { Metadata } from 'next';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { Users, Target, ShieldCheck, Mountain, BedDouble, Car, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce más sobre Go aventura, nuestra misión, visión y el equipo que hace posibles tus aventuras en La Rioja.',
};

const AboutUsPage = () => {
  return (
		<div className="bg-background py-12 md:py-16">
			<div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				<header className="text-center mb-12 md:mb-16">
					<h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">
						Go aventura
					</h1>
					<p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
						Tu puerta de entrada a la aventura en la Región del
						Bermejo
					</p>
				</header>

				<section className="mb-12 md:mb-16 ">
					<div className="grid md:grid-cols-5 gap-8 lg:gap-12 items-center">
						<div className="md:col-span-5 text-muted-foreground leading-relaxed space-y-4">
							<Image
								src="/nosotros.png"
								alt="Paisaje de aventura en La Rioja"
								width={400}
								height={200}
								className="rounded-lg shadow-xl object-cover"
								data-ai-hint="canyon landscape riojas"
							/>
							<div>
								<p className="text-lg">
									Somos{" "}
									<strong className="font-semibold text-foreground">
										Go aventura
									</strong>{" "}
									(Agencia de Viajes- Leg. 20019), un
									emprendimiento familiar apasionado por
									brindar experiencias auténticas y memorables
									en Villa Unión, La Rioja. Nos dedicamos a
									ofrecerte no solo un viaje, sino una
									aventura inolvidable, combinando comodidad,
									seguridad y emoción en cada servicio que
									brindamos.
								</p>
							</div>
							<Card className="bg-muted/50">
								<CardHeader>
									<CardTitle className="flex items-center gap-3 font-headline text-2xl">
										<Target className="h-8 w-8 text-primary" />
										Nuestra Misión
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										Queremos que tu visita a nuestra región
										sea más que un simple recorrido
										turístico: buscamos que te sumerjas en
										la cultura, los paisajes y la esencia de
										este destino único. Nos esforzamos en
										proporcionar alojamientos confortables,
										excursiones emocionantes y traslados
										seguros para que disfrutes sin
										preocupaciones.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section className="mb-12 md:mb-16">
					<div className="text-center mb-10">
						<h2 className="font-headline text-3xl font-semibold text-foreground">
							¿Qué ofrecemos?
						</h2>
					</div>
					<div className="grid md:grid-cols-3 gap-8 text-left">
						<div className="flex items-start gap-4">
							<div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
								<Mountain className="h-8 w-8 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-lg text-foreground mb-1">
									Excursiones en 4x4
								</h3>
								<p className="text-sm text-muted-foreground">
									Explora paisajes inaccesibles y maravíllate
									con la belleza natural de la región,
									acompañado por nuestros guías expertos.
								</p>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
								<BedDouble className="h-8 w-8 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-lg text-foreground mb-1">
									Alojamiento
								</h3>
								<p className="text-sm text-muted-foreground">
									Espacios diseñados para tu comodidad,
									garantizando un descanso reparador después
									de un día de exploración.
								</p>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
								<Car className="h-8 w-8 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-lg text-foreground mb-1">
									Transfers
								</h3>
								<p className="text-sm text-muted-foreground">
									Te llevamos a donde necesites con un
									servicio de traslado seguro y confiable.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-secondary p-8 md:p-12 rounded-lg shadow-md text-center">
					<ShieldCheck className="h-12 w-12 text-secondary-foreground mx-auto mb-4" />
					<h2 className="font-headline text-3xl font-semibold text-secondary-foreground mb-4">
						Nuestra Promesa
					</h2>
					<p className="text-secondary-foreground mb-6 max-w-2xl mx-auto">
						En Go aventura, trabajamos día a día para mejorar y
						ampliar nuestros servicios, asegurándonos de que vivas
						una experiencia sin igual en Villa Unión y sus
						alrededores. Cada detalle de tu viaje importa, y estamos
						aquí para que disfrutes cada momento al máximo.
					</p>
					<div className="text-secondary-foreground font-semibold">
						<p>
							🌍 Déjanos ser tu guía en esta emocionante travesía.
							¡Te esperamos con los brazos abiertos para explorar
							juntos!
						</p>
					</div>
				</section>
			</div>
		</div>
  );
};

export default AboutUsPage;
