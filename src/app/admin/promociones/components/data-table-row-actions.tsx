
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
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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
import { Promotion } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { getPromotions, savePromotions } from "@/lib/data/promotions";

const generateSlug = (text: string) => {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

interface DataTableRowActionsProps<TData extends { slug: string; id: string; title: string, isFeatured?: boolean }> {
  row: Row<TData>,
  table: Table<TData>
}

export function DataTableRowActions<TData extends { slug: string; id: string; title: string, isFeatured?: boolean }>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    const slug = row.original.slug;
    router.push(`/admin/promociones/editor?slug=${slug}`);
  };

  const handleToggleFeatured = async () => {
      try {
        const allPromos = await getPromotions();
        const updatedPromos = allPromos.map(promo => 
            promo.id === row.original.id ? { ...promo, isFeatured: !promo.isFeatured } : promo
        );
        await savePromotions(updatedPromos);

        table.options.meta?.updateData(row.index, 'isFeatured', !row.original.isFeatured)

        toast({
            title: "Promoción Actualizada",
            description: `"${row.original.title}" ahora ${!row.original.isFeatured ? 'es' : 'no es'} una promoción destacada.`,
        });
      } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo actualizar el estado de destacado.",
            variant: "destructive",
        });
      }
  };

  const handleDelete = async () => {
    try {
      const allPromos = await getPromotions();
      const updatedPromos = allPromos.filter(promo => promo.id !== row.original.id);
      await savePromotions(updatedPromos); 
      
      toast({
        title: "Promoción Eliminada",
        description: `La promoción "${row.original.title}" ha sido eliminada exitosamente.`,
      });

      window.location.reload();

    } catch (error) {
       toast({
        title: "Error",
        description: "No se pudo eliminar la promoción.",
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
          <DropdownMenuItem onClick={handleToggleFeatured}>
            {row.original.isFeatured ? 'Quitar de Destacados' : 'Marcar como Destacado'}
          </DropdownMenuItem>
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente la promoción.
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
