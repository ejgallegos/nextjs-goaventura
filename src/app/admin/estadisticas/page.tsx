
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Eye, MessageSquare, Calendar as CalendarIcon } from 'lucide-react';
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
import { getStatistics, type StatisticsData, type ProductStat } from '@/lib/data/statistics';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, startOfDay } from 'date-fns';

type FilteredProductStat = {
  id: string;
  name: string;
  views: number;
  whatsappClicks: number;
};


export default function StatisticsPage() {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const data = await getStatistics();
      setStats(data);
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  const getFilteredStats = (): FilteredProductStat[] => {
    if (!stats?.products) return [];

    const productArray = Object.values(stats.products);

    if (!date?.from || !date?.to) {
      // If no date range, return total stats
      return productArray.map(p => ({
        id: p.id,
        name: p.name,
        views: p.views || 0,
        whatsappClicks: p.whatsappClicks || 0,
      })).sort((a,b) => b.views - a.views);
    }
    
    const interval = { start: startOfDay(date.from), end: startOfDay(date.to) };

    const filtered = productArray.map(product => {
      const viewsInRange = Object.entries(product.viewsByDate || {})
        .filter(([dateStr]) => isWithinInterval(startOfDay(new Date(dateStr)), interval))
        .reduce((sum, [, count]) => sum + count, 0);

      const clicksInRange = Object.entries(product.whatsappClicksByDate || {})
        .filter(([dateStr]) => isWithinInterval(startOfDay(new Date(dateStr)), interval))
        .reduce((sum, [, count]) => sum + count, 0);

      return {
        id: product.id,
        name: product.name,
        views: viewsInRange,
        whatsappClicks: clicksInRange,
      };
    });

    return filtered.sort((a,b) => b.views - a.views);
  };
  
  const sortedProducts = getFilteredStats();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!stats || sortedProducts.length === 0) {
      return <p className="text-center text-muted-foreground py-8">No hay estadísticas para mostrar en el rango seleccionado.</p>;
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
                  const conversionRate = (product.views > 0)
                    ? (product.whatsappClicks / product.views) * 100
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
             <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className="w-[300px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Seleccionar un rango de fechas</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                 <Button onClick={() => setDate(undefined)} variant="ghost" disabled={!date}>Resetear</Button>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
