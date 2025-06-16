
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
		<footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border">
			<div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
					{/* Logo and About */}
					<div className="md:col-span-1 lg:col-span-1">
						<Link href="/" className="inline-block mb-4">
							<Image
								src="/logo.png"
								alt="GoAventura Logo"
								width={183}
								height={40}
								className="h-15 w-auto"
							/>
						</Link>
						<p className="text-sm text-sidebar-foreground/80">
							Tu agencia de viajes de confianza. Exploramos el
							mundo contigo.
						</p>
						<p className="text-xs text-sidebar-foreground/70 mt-2">
							Leg. 20019
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-headline font-medium text-sidebar-primary mb-4">
							Enlaces Rápidos
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/nosotros"
									className="text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
								>
									Nosotros
								</Link>
							</li>
							<li>
								<Link
									href="/viajes/excursiones"
									className="text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
								>
									Excursiones
								</Link>
							</li>
							<li>
								<Link
									href="/viajes/transfers"
									className="text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
								>
									Transfers
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="/contacto"
									className="text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
								>
									Contacto
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className="text-lg font-headline font-medium text-sidebar-primary mb-4">
							Legal
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/legal/terminos-y-condiciones"
									className="text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
								>
									Términos y Condiciones
								</Link>
							</li>
							<li>
								<Link
									href="/legal/politica-de-privacidad"
									className="text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
								>
									Política de Privacidad
								</Link>
							</li>
							<li>
								<Link
									href="/legal/politica-de-cookies"
									className="text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
								>
									Política de Cookies
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact & Social */}
					<div>
						<h3 className="text-lg font-headline font-medium text-sidebar-primary mb-4">
							Síguenos
						</h3>
						<div className="flex space-x-4 mb-4">
							<Link
								href="#"
								aria-label="Facebook"
								className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
							>
								<Facebook size={24} />
							</Link>
							<Link
								href="#"
								aria-label="Instagram"
								className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
							>
								<Instagram size={24} />
							</Link>
							<Link
								href="#"
								aria-label="Twitter"
								className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
							>
								<Twitter size={24} />
							</Link>
							<Link
								href="#"
								aria-label="YouTube"
								className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
							>
								<Youtube size={24} />
							</Link>
						</div>
						<p className="text-sm text-sidebar-foreground/80 mt-4">
							Suscríbete a nuestro newsletter para ofertas
							exclusivas.
						</p>
						<form className="mt-2 flex">
							<input
								type="email"
								placeholder="Tu email"
								className="w-full p-2 rounded-l-md border border-input bg-background text-foreground placeholder:text-sidebar-foreground/60 focus:ring-primary focus:border-primary text-sm"
							/>
							<button
								type="submit"
								className="bg-sidebar-primary text-sidebar-primary-foreground p-2 rounded-r-md hover:bg-sidebar-primary/90 text-sm"
							>
								Suscribir
							</button>
						</form>
					</div>
				</div>

				<div className="mt-12 border-t border-sidebar-border/50 pt-8 text-center">
					<p className="text-sm text-sidebar-foreground/80">
						&copy; {currentYear} GoAventura. Todos los derechos
						reservados.
					</p>
				</div>
			</div>
		</footer>
  );
};

export default Footer;
