
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { statuses } from "../../blog/data/data"
import { HeroSlide } from "@/lib/types" 
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import Image from "next/image"
import { SafeHTML } from "@/components/ui/safe-html"

export const columns: ColumnDef<HeroSlide>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "order",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Orden" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-12 text-center">
          <span className="font-medium">
            {row.getValue("order")}
          </span>
        </div>
      )
    },
  },
   {
    accessorKey: "imageUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Imagen" />
    ),
    cell: ({ row }) => {
        const imageUrl = row.getValue("imageUrl") as string;
      return (
        <div className="flex items-center">
            {imageUrl ? (
                 <Image src={imageUrl} alt="Slide image" width={120} height={68} className="rounded-md object-cover aspect-video" />
            ) : (
                <div className="w-24 h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                    No Image
                </div>
            )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <SafeHTML
            html={row.getValue("title")}
            tagName="span"
            className="max-w-[500px] truncate font-medium"
          />
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
