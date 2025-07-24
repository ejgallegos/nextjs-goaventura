
import { Suspense } from 'react';
import SlideEditorForm from './slide-editor-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function EditorPageContent() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-5xl flex-1 auto-rows-max gap-4">
                 <div className="flex items-center gap-4">
                     <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                         <Link href="/admin/slider">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Volver</span>
                         </Link>
                     </Button>
                     <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                         Editor de Diapositivas
                     </h1>
                 </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Detalles de la Diapositiva</CardTitle>
                        <CardDescription>
                            Completa los detalles para añadir o editar una diapositiva. Haz clic en guardar cuando termines.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SlideEditorForm />
                    </CardContent>
                </Card>
            </div>
        </main>
      </div>
    </div>
  );
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div>Cargando editor...</div>}>
            <EditorPageContent />
        </Suspense>
    )
}
