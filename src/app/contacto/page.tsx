"use client"; // Required for form handling

import { Metadata } from 'next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';

// export const metadata: Metadata = { // Metadata needs to be exported from server components
//   title: 'Contacto',
//   description: 'Ponte en contacto con GoAventura. Estamos listos para ayudarte a planificar tu próxima aventura.',
// };
// For client components, handle title/meta differently or in a parent server component.
// For now, we'll rely on the default title template or set it in a parent if this were a real app needing dynamic metadata here.


const contactFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  subject: z.string().min(5, { message: "El asunto debe tener al menos 5 caracteres." }),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    }
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    // In a real app, you would send this data to a backend API
    console.log(data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Mensaje Enviado",
      description: "Gracias por contactarnos. Te responderemos pronto.",
      variant: "default", // 'default' as it's not an error
    });
    form.reset(); // Reset form after successful submission
  };

  return (
    <>
    {/* Hack to set title since this is a client component */}
    <title>Contacto | GoAventura</title> 
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">Ponte en Contacto</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes preguntas o estás listo para planificar tu aventura? ¡Estamos aquí para ayudarte!
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact Form */}
          <div className="bg-card p-6 sm:p-8 rounded-lg shadow-xl">
            <h2 className="font-headline text-2xl font-semibold text-foreground mb-6">Envíanos un Mensaje</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="tu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asunto</FormLabel>
                      <FormControl>
                        <Input placeholder="Motivo de tu consulta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Escribe tu mensaje aquí..." {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Info & WhatsApp */}
          <div className="space-y-8">
            <div>
              <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">Información de Contacto</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-primary shrink-0" />
                  <span>Calle Falsa 123, Ciudad, Provincia, Argentina (Placeholder)</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-primary shrink-0" />
                  <Link href="tel:+5491122334455" className="hover:text-primary">+54 9 11 2233-4455 (Placeholder)</Link>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-primary shrink-0" />
                  <Link href="mailto:info@goaventura.com.ar" className="hover:text-primary">info@goaventura.com.ar (Placeholder)</Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-secondary p-6 sm:p-8 rounded-lg shadow-lg text-center">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-headline text-xl font-semibold text-foreground mb-3">¿Prefieres un Contacto Directo?</h3>
              <p className="text-muted-foreground mb-6">
                Haz clic abajo para enviarnos un mensaje por WhatsApp. ¡Es rápido y fácil!
              </p>
              <WhatsAppCtaButton
                predefinedText="Hola GoAventura, tengo una consulta."
                buttonText="Chatea con Nosotros en WhatsApp"
                size="lg"
                className="w-full"
              />
            </div>

            {/* Placeholder for Map */}
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground shadow-md">
                <span>Mapa de ubicación (Placeholder)</span>
                 <Image src="https://placehold.co/600x300.png?text=Mapa" alt="Mapa de ubicación" width={600} height={300} className="w-full h-full object-cover rounded-lg" data-ai-hint="map location" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ContactPage;
