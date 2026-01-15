"use client";

import React, { useEffect } from "react";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { DataTableSortList } from "@/components/table/data-table-sort-list";

import { useDataTable } from "@/hooks/use-data-table";

import { useRecipes } from "../hooks/use-recipes";
import { getRecipeTableColumns } from "./columns";

export default function TableRecipes() {
  const { data, isLoading, isRefetching } = useRecipes();

  const options = [{ label: "Name", value: "name" }];

  const columns = getRecipeTableColumns();
  const { table } = useDataTable({
    data: data?.items ?? [],
    columns,
    pageCount: data?.lastPage ?? 0,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnVisibility: {
        ingredients: false,
      },
    },
    shallow: false,
    clearOnDefault: true,
  });

  useEffect(() => {
    table.setGlobalFilter(isRefetching || isLoading);
  }, [table, isRefetching, isLoading]);

  return (
    <div className="container min-w-full mx-auto mt-3">
      <div className="mb-5 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="page-header">Recipes</h2>
        </div>
      </div>

      <DataTable table={table} isLoading={isLoading}>
        <DataTableToolbar table={table} options={options} isSearch>
          <DataTableSortList table={table} align="end" />
        </DataTableToolbar>
      </DataTable>
    </div>
  );
}
