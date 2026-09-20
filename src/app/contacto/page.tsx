'use client';

import { Metadata } from 'next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  subject: z.string().min(5, { message: 'El asunto debe tener al menos 5 caracteres.' }),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres.' }),
  recaptchaToken: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    if (!executeRecaptcha) {
      toast({ title: 'Error', description: 'No se pudo verificar reCAPTCHA. Inténtalo de nuevo.', variant: 'destructive' });
      return;
    }
    try {
      const token = await executeRecaptcha('contact_form');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptchaToken: token }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to send message');
      toast({ title: 'Mensaje Enviado', description: 'Gracias por contactarnos. Te responderemos pronto.' });
      form.reset();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Ocurrió un error al enviar el mensaje.', variant: 'destructive' });
    }
  };

  return (
    <>
      <title>Contacto | Go Aventura</title>
      <div className="bg-background">
        <section className="section-padding bg-secondary/30">
          <div className="section-container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">Ponte en Contacto</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                ¿Tenés preguntas o estás listo para planificar tu aventura? ¡Estamos aquí para ayudarte!
              </p>
            </div>
          </div>
        </section>

        <section className="section-container py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Form */}
            <div className="rounded-2xl border p-6 sm:p-8">
              <h2 className="font-headline text-2xl font-bold text-foreground mb-6">Envíanos un Mensaje</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl><Input placeholder="Tu nombre" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="tu@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asunto</FormLabel>
                      <FormControl><Input placeholder="Motivo de tu consulta" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje</FormLabel>
                      <FormControl><Textarea placeholder="Escribe tu mensaje aquí..." {...field} rows={5} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="rounded-2xl border p-6 sm:p-8 space-y-4">
                <h3 className="font-headline text-xl font-bold text-foreground">Información de Contacto</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-accent shrink-0" />
                    <a href="tel:+5493825575566" className="hover:text-accent transition-colors">+549 3825 575566</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-accent shrink-0" />
                    <a href="mailto:info@goaventura.com.ar" className="hover:text-accent transition-colors">info@goaventura.com.ar</a>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border p-6 sm:p-8 text-center space-y-4">
                <MessageSquare className="h-10 w-10 text-accent mx-auto" />
                <h3 className="font-headline text-xl font-bold text-foreground">¿Preferís un Contacto Directo?</h3>
                <p className="text-sm text-muted-foreground">Hacé clic abajo para enviarnos un mensaje por WhatsApp. ¡Es rápido y fácil!</p>
                <WhatsAppCtaButton
                  predefinedText="Hola Go Aventura, tengo una consulta."
                  buttonText="Chateá con Nosotros"
                  size="lg"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
