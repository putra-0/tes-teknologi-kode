import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";

import { formatDate } from "@/lib/format";
import type { Recipe } from "../data/type";

export function getRecipeTableColumns(): ColumnDef<Recipe>[] {
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
      id: "category",
      accessorFn: (row) => row.category?.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      enableSorting: false,
      enableColumnFilter: true,
      meta: {
        label: "Category",
        variant: "categoryList",
        options: [],
      },
      cell: ({ row }) => <span>{row.original.category?.name}</span>,
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      enableSorting: false,
      enableColumnFilter: false,
      meta: {
        label: "Description",
      },
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-md">
          {row.original.description ?? "-"}
        </span>
      ),
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
      enableColumnFilter: false,
      meta: {
        label: "Created At",
        alignHeader: "end",
        alignCell: "end",
      },
      cell: ({ row }) => (
        <div className="flex justify-end">
          {formatDate(row.original.createdAt)}
        </div>
      ),
    },
    {
      id: "ingredients",
      accessorFn: () => null,
      header: "Ingredients",
      enableSorting: false,
      enableColumnFilter: true,
      enableHiding: false,
      meta: {
        label: "Ingredient",
        variant: "ingredientList",
        options: [],
      },
      cell: () => null,
      size: 0,
      minSize: 0,
      maxSize: 0,
    },
  ];
}
