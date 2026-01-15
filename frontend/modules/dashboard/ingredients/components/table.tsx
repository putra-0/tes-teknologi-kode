"use client";

import { DataTable } from "@/components/table/data-table";
import React, { useEffect } from "react";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { DataTableRowAction } from "@/types/data-table";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { Ingredient } from "../data/type";
import { useIngredients } from "../hooks/use-ingredients";
import { useAddIngredient } from "../hooks/use-add-ingredient";
import { useUpdateIngredient } from "../hooks/use-update-ingredient";
import { useDeleteIngredient } from "../hooks/use-delete-ingredient";

import { getIngredientTableColumns } from "./columns";
import { FormDialog } from "./form-dialog";
import { DeleteConfirmDialog } from "./delete-form-dialog";
import { DataTableSortList } from "@/components/table/data-table-sort-list";

export default function TableIngredients() {
  const { data, isLoading, isRefetching } = useIngredients();
  const { dialog, isLoading: isLoadingAdd, setDialog, onSubmit } =
    useAddIngredient();
  const { isLoading: isLoadingUpdate, onUpdateSubmit } = useUpdateIngredient();
  const { isLoading: isLoadingDelete, onDeleteSubmit } = useDeleteIngredient();

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Ingredient> | null>(null);

  const columns = getIngredientTableColumns({ setRowAction });
  const { table } = useDataTable({
    data: data?.items ?? [],
    columns: columns,
    pageCount: data?.lastPage ?? 0,
    initialState: {
      columnPinning: { right: ["actions"] },
      sorting: [{ id: "createdAt", desc: true }],
    },
    shallow: false,
    clearOnDefault: true,
  });

  useEffect(() => {
    table.setGlobalFilter(isRefetching || isLoading);
  }, [table, isRefetching, isLoading]);

  return (
    <>
      <div className="container min-w-full mx-auto mt-3">
        <div className="mb-5 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="page-header">Ingredients</h2>
          </div>
          <div className="flex gap-2">
            <Button className="space-x-1" onClick={() => setDialog(true)}>
              <span>Add</span> <Plus />
            </Button>
          </div>
        </div>

        <DataTable table={table} isLoading={isLoading}>
          <DataTableToolbar table={table}>
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
        </DataTable>
      </div>

      <FormDialog
        open={dialog}
        mode="create"
        isLoadingSubmit={isLoadingAdd}
        onOpenChange={(open) => setDialog(open)}
        onSubmit={(formData, setError) => onSubmit(formData, setError)}
      />

      <FormDialog
        open={rowAction?.variant === "update"}
        mode="edit"
        defaultValues={{ name: rowAction?.row.original.name ?? "" }}
        isLoadingSubmit={isLoadingUpdate}
        onOpenChange={(open) => {
          if (!open) setRowAction(null);
        }}
        onSubmit={(formData, setError) => {
          const uuid = rowAction?.row.original.uuid;
          if (!uuid) return;
          onUpdateSubmit(uuid, formData, setError, () => setRowAction(null));
        }}
      />

      <DeleteConfirmDialog
        currentRow={rowAction?.row.original}
        open={rowAction?.variant === "delete"}
        isLoading={isLoadingDelete}
        onOpenChange={() => setRowAction(null)}
        onConfirm={(uuid) => onDeleteSubmit(uuid, () => setRowAction(null))}
      />
    </>
  );
}
