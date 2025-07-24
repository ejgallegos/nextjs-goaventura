
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mountain, BookOpen, Images } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Selecciona qué sección de contenido quieres gestionar.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-6 w-6" />
              Gestor de Viajes
            </CardTitle>
            <CardDescription>
              Añade, edita o elimina excursiones y transfers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/viajes">Ir a Viajes</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Gestor de Blog
            </CardTitle>
            <CardDescription>
              Crea, edita y publica artículos en el blog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/blog">Ir al Blog</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Images className="h-6 w-6" />
              Gestor de Slider
            </CardTitle>
            <CardDescription>
              Gestiona las diapositivas del carrusel principal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/slider">Ir al Slider</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
