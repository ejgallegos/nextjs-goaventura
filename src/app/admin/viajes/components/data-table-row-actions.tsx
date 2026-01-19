
"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row, Table } from "@tanstack/react-table"
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Product } from "@/lib/types";
import { getProducts, saveProducts } from "@/lib/data/products";
import { useToast } from "@/hooks/use-toast";

const generateSlug = (text: string) => {
    return text
        .toString()
        .normalize('NFD') // split an accented letter into the base letter and the accent
        .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // replace spaces with -
        .replace(/[^\w-]+/g, '') // remove all non-word chars
        .replace(/--+/g, '-'); // replace multiple - with single -
};

const availableTags = [
    { value: 'Aventura', label: 'Aventura' },
    { value: '4x4', label: '4x4' },
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Fauna', label: 'Fauna' },
    { value: 'Cordillera', label: 'Cordillera' },
];

interface DataTableRowActionsProps<TData extends { slug: string; id: string; name: string, tags?: string[], isFeatured?: boolean }> {
  row: Row<TData>,
  table: Table<TData>
}

export function DataTableRowActions<TData extends { slug: string; id: string; name: string, tags?: string[], isFeatured?: boolean }>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    const slug = row.original.slug;
    router.push(`/admin/viajes/editor?slug=${slug}`);
  };

  const handleCopy = async () => {
    try {
        const allTrips = await getProducts();
        const originalTrip = row.original;

        const newTrip: Product = {
            ...originalTrip,
            id: `prod_${Date.now()}`,
            name: `${originalTrip.name} (Copia)`,
            slug: generateSlug(`${originalTrip.name} (Copia)`),
            status: 'draft',
            isFeatured: false,
            description: originalTrip.description || '',
            imageUrl: originalTrip.imageUrl || '',
            imageHint: originalTrip.imageHint || '',
            category: originalTrip.category || 'Excursion',
            tags: originalTrip.tags || [],
            imageGallery: originalTrip.imageGallery || [],
        };

        const updatedTrips = [...allTrips, newTrip];
        await saveProducts(updatedTrips);

        toast({
            title: "Viaje Duplicado",
            description: `Se creó una copia de "${originalTrip.name}".`,
        });

        // Redirect to the new copy's editor page
        router.push(`/admin/viajes/editor?slug=${newTrip.slug}`);
        router.refresh();

    } catch (error) {
        toast({
            title: "Error",
            description: "No se pudo duplicar el viaje.",
            variant: "destructive",
        });
    }
  };

  const handleToggleFeatured = async () => {
      try {
        const allTrips = await getProducts();
        const updatedTrips = allTrips.map(trip => 
            trip.id === row.original.id ? { ...trip, isFeatured: !trip.isFeatured } : trip
        );
        await saveProducts(updatedTrips);

        // Optimistic UI update
        table.options.meta?.updateData(row.index, 'isFeatured', !row.original.isFeatured)

        toast({
            title: "Viaje Actualizado",
            description: `"${row.original.name}" ahora ${!row.original.isFeatured ? 'es' : 'no es'} un viaje destacado.`,
        });
      } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo actualizar el estado de destacado.",
            variant: "destructive",
        });
      }
  };

  const handleSetTag = async (tag: string) => {
    try {
        const allTrips = await getProducts();
        const updatedTrips = allTrips.map(trip => {
            if (trip.id === row.original.id) {
                // Ensure tags array exists and add tag if it's not already there
                const currentTags = trip.tags || [];
                const newTags = currentTags.includes(tag) ? currentTags : [...currentTags, tag];
                return { ...trip, tags: newTags };
            }
            return trip;
        });

        await saveProducts(updatedTrips);

        // Optimistic UI update
        const updatedTags = [...(row.original.tags || []), tag];
        table.options.meta?.updateData(row.index, 'tags', updatedTags);
        
        toast({
            title: "Etiqueta Añadida",
            description: `Se añadió la etiqueta "${tag}" a "${row.original.name}".`,
        });
    } catch (error) {
         toast({
            title: "Error",
            description: "No se pudo añadir la etiqueta.",
            variant: "destructive",
        });
    }
  }

  const handleDelete = async () => {
    try {
      const allTrips = await getProducts();
      const updatedTrips = allTrips.filter(trip => trip.id !== row.original.id);
      await saveProducts(updatedTrips); 
      
      toast({
        title: "Viaje Eliminado",
        description: `El viaje "${row.original.name}" ha sido eliminado exitosamente.`,
      });

      // Refresh page to reflect changes from persistent storage
      window.location.reload();

    } catch (error) {
       toast({
        title: "Error",
        description: "No se pudo eliminar el viaje.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
  };


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>Hacer una copia</DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleFeatured}>
            {row.original.isFeatured ? 'Quitar de Destacados' : 'Marcar como Destacado'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Etiquetas</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={row.original.tags?.join(',') || ''}>
                {availableTags.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value} onSelect={() => handleSetTag(label.value)}>
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-destructive">
            Eliminar
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el viaje
              de tus datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
