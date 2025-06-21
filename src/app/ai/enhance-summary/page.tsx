
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { enhanceSummary, EnhanceSummaryInput, EnhanceSummaryOutput } from '@/ai/flows/enhance-summary';
import { Sparkles, FileText, CheckCircle } from 'lucide-react';
// No Metadata for client components this way, title set in return
// export const metadata: Metadata = {
//   title: 'Mejorador de Resúmenes IA',
//   description: 'Utiliza inteligencia artificial para mejorar tus resúmenes añadiendo detalles importantes.',
// };

const summarySchema = z.object({
  originalText: z.string().min(50, { message: "El texto original debe tener al menos 50 caracteres." }),
  userSummary: z.string().min(10, { message: "Tu resumen debe tener al menos 10 caracteres." }),
});

type SummaryFormValues = z.infer<typeof summarySchema>;

export default function EnhanceSummaryPage() {
  const [enhancedSummaryResult, setEnhancedSummaryResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      originalText: '',
      userSummary: '',
    }
  });

  const onSubmit: SubmitHandler<SummaryFormValues> = async (data) => {
    setIsLoading(true);
    setEnhancedSummaryResult(null);
    try {
      const input: EnhanceSummaryInput = {
        originalText: data.originalText,
        userSummary: data.userSummary,
      };
      const result: EnhanceSummaryOutput = await enhanceSummary(input);
      setEnhancedSummaryResult(result.enhancedSummary);
      toast({
        title: "Resumen Mejorado",
        description: "El resumen ha sido procesado exitosamente.",
        variant: "default",
        action: <CheckCircle className="text-green-500" />,
      });
    } catch (error) {
      console.error("Error enhancing summary:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al mejorar el resumen. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <title>Mejorador de Resúmenes IA | Go aventura</title>
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="inline-block p-3 bg-primary/10 rounded-full mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl sm:text-4xl text-foreground">Mejorador de Resúmenes con IA</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Pega un texto original y tu resumen. Nuestra IA lo analizará y añadirá detalles importantes que podrías haber omitido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="originalText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-primary" />
                        Texto Original Completo
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Pega aquí el texto completo que quieres resumir..."
                          {...field}
                          rows={10}
                          className="text-base"
                        />
                      </FormControl>
                      <FormDescription>
                        Este es el material fuente para la IA.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userSummary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-primary" />
                        Tu Resumen Actual
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Pega aquí el resumen que has creado..."
                          {...field}
                          rows={6}
                          className="text-base"
                        />
                      </FormControl>
                      <FormDescription>
                        La IA intentará mejorar este resumen.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full text-lg" disabled={isLoading}>
                  {isLoading ? (
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? 'Procesando...' : 'Mejorar Resumen'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {enhancedSummaryResult && (
          <Card className="mt-10 shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-foreground flex items-center">
                <CheckCircle className="mr-2 h-7 w-7 text-green-500" />
                Resumen Mejorado por IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-secondary rounded-md prose prose-base max-w-none">
                <p>{enhancedSummaryResult}</p>
              </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(enhancedSummaryResult).then(() => toast({title: "Copiado!", description: "Resumen mejorado copiado al portapapeles."}))}>
                    Copiar Resumen
                </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
    </>
  );
}
