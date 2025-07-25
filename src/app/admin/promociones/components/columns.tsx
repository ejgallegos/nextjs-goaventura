
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { statuses } from "../../viajes/data/data"
import { Promotion } from "@/lib/types" 
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Star } from "lucide-react"

export const columns: ColumnDef<Promotion>[] = [
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
    accessorKey: "isFeatured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dest." />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-8 justify-center">
            {row.getValue("isFeatured") ? <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> : <Star className="h-4 w-4 text-muted-foreground/40" />}
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[400px] truncate font-medium">
            {row.getValue("title")}
          </span>
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
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.original.price?.toString() ?? "0")
      if (price === 0) return <div className="text-right text-muted-foreground">-</div>;
      
      const currency: string = row.original.currency || 'ARS';
      const formatted = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: currency,
      }).format(price)

      return <div className="font-medium text-right">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
]
