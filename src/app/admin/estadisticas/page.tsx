
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Eye, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStatistics, type StatisticsData } from '@/lib/data/statistics';
import { Badge } from '@/components/ui/badge';

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const data = await getStatistics();
      setStats(data);
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  const sortedProducts = stats?.products 
    ? Object.values(stats.products).sort((a, b) => (b.views || 0) - (a.views || 0))
    : [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!stats || sortedProducts.length === 0) {
      return <p className="text-center text-muted-foreground py-8">No hay estadísticas para mostrar.</p>;
    }

    return (
      <Card>
        <CardHeader>
            <CardTitle>Estadísticas por Viaje</CardTitle>
            <CardDescription>
                Un resumen de las interacciones de los usuarios con cada producto.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Nombre del Viaje</TableHead>
                <TableHead className="text-center">Vistas</TableHead>
                <TableHead className="text-center">Consultas WhatsApp</TableHead>
                <TableHead className="text-center">Ratio de Conversión</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map(product => {
                  const conversionRate = (product.views && product.views > 0)
                    ? ((product.whatsappClicks || 0) / product.views) * 100
                    : 0;
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant="outline" className="gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            {product.views || 0}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant="secondary" className="gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {product.whatsappClicks || 0}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {conversionRate.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-5xl flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Volver</span>
                </Link>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Estadísticas de Viajes
              </h1>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
