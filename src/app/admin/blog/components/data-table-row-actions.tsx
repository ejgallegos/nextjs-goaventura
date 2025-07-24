
"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
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

import { useToast } from "@/hooks/use-toast";
import { getBlogPosts, saveBlogPosts } from "@/lib/data/blog-posts";
import type { BlogPost } from "@/lib/types";


interface DataTableRowActionsProps<TData extends { slug: string; id: string; title: string }> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends { slug: string; id: string; title: string }>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    const slug = row.original.slug;
    router.push(`/admin/blog/editor?slug=${slug}`);
  };

  const handleDelete = async () => {
    try {
      const allPosts = await getBlogPosts();
      const updatedPosts = allPosts.filter(post => post.id !== row.original.id);
      await saveBlogPosts(updatedPosts);
      
      toast({
        title: "Artículo Eliminado",
        description: `El artículo "${row.original.title}" ha sido eliminado exitosamente.`,
      });

      // Refresh the page to reflect changes
      window.location.reload();

    } catch (error) {
       toast({
        title: "Error",
        description: "No se pudo eliminar el artículo.",
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
          <DropdownMenuItem>Hacer una copia</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-destructive">
            Eliminar
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo.
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
