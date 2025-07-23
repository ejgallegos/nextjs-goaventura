
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      router.replace('/admin/viajes');
    }
  }, [router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate API call
    console.log("Login attempt with:", data.email);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you'd verify credentials against a backend.
    // Here, we'll just simulate a successful login for any valid input.
    
    // Simulate success
    localStorage.setItem('isAuthenticated', 'true');
    toast({
      title: "Inicio de Sesión Exitoso",
      description: "¡Bienvenido de nuevo!",
    });
    router.push('/admin/viajes');

    // Example of error handling (can be implemented with a real backend)
    /*
    toast({
      title: "Error de Inicio de Sesión",
      description: "Las credenciales son incorrectas. Por favor, inténtalo de nuevo.",
      variant: "destructive",
    });
    */
    
    setIsLoading(false);
  };

  return (
    <>
      <title>Iniciar Sesión | Admin Go aventura</title>
      <div className="flex min-h-screen items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-sm shadow-2xl">
          <CardHeader className="text-center">
              <Link href="/" className="mb-4 inline-block">
                <Image
                  src="/logo.png"
                  alt="Go aventura Logo"
                  width={183}
                  height={40}
                  className="h-10 w-auto mx-auto dark:hidden"
                />
                 <Image
                  src="/logo-white.png"
                  alt="Go aventura Logo"
                  width={183}
                  height={40}
                  className="h-10 w-auto mx-auto hidden dark:block"
                />
              </Link>
            <CardTitle className="font-headline text-2xl">Acceso de Administración</CardTitle>
            <CardDescription>
              Introduce tus credenciales para acceder al panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@goaventura.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Ingresando...' : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Ingresar
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
