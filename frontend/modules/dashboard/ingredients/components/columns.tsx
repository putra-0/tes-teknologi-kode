import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Ellipsis } from "lucide-react";

import { DataTableRowAction } from "@/types/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

import { Ingredient } from "../data/type";

interface GetIngredientTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Ingredient> | null>
  >;
}

export function getIngredientTableColumns({
  setRowAction,
}: GetIngredientTableColumnsProps): ColumnDef<Ingredient>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      enableColumnFilter: false,
      enableSorting: true,
      meta: {
        label: "Name",
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="flex justify-end">
          <DataTableColumnHeader column={column} title="Created At" />
        </div>
      ),
      enableSorting: true,
      meta: {
        label: "Created At",
        alignHeader: "end",
        alignCell: "end",
      },
      cell: ({ row }) => {
        const { createdAt } = row.original;
        return <div className="flex justify-end">{formatDate(createdAt)}</div>;
      },
      enableColumnFilter: false,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="min-w-8 rounded-full" asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-2 p-4 m-0 justify-enddata-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "update" })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "delete" })}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      minSize: 40,
      maxSize: 40,
    },
  ];
}
