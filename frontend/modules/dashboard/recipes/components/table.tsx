"use client";

import React, { useEffect } from "react";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { DataTableSortList } from "@/components/table/data-table-sort-list";
import { Button } from "@/components/ui/button";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTableRowAction } from "@/types/data-table";

import { useRecipes } from "../hooks/use-recipes";
import { useAddRecipe } from "../hooks/use-add-recipe";
import { useUpdateRecipe } from "../hooks/use-update-recipe";
import { useDeleteRecipe } from "../hooks/use-delete-recipe";
import { Recipe } from "../data/type";
import { getRecipeTableColumns } from "./columns";
import { FormDialog } from "./form-dialog";
import { DeleteConfirmDialog } from "./delete-form-dialog";

export default function TableRecipes() {
  const { data, isLoading, isRefetching } = useRecipes();

  const { dialog, isLoading: isLoadingAdd, setDialog, onSubmit } =
    useAddRecipe();
  const { isLoading: isLoadingUpdate, onUpdateSubmit } = useUpdateRecipe();
  const { isLoading: isLoadingDelete, onDeleteSubmit } = useDeleteRecipe();

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Recipe> | null>(null);

  const editDefaultValues = React.useMemo(
    () => ({
      name: rowAction?.row.original.name ?? "",
      description: rowAction?.row.original.description ?? "",
    }),
    [rowAction?.row.original.name, rowAction?.row.original.description]
  );

  const options = [{ label: "Name", value: "name" }];

  const columns = React.useMemo(
    () => getRecipeTableColumns({ setRowAction }),
    [setRowAction]
  );
  const { table } = useDataTable({
    data: data?.items ?? [],
    columns,
    pageCount: data?.lastPage ?? 0,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        ingredients: false,
      },
    },
    shallow: true,
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
            <h2 className="page-header">Recipes</h2>
          </div>
          <div className="flex gap-2">
            <Button className="space-x-1" onClick={() => setDialog(true)}>
              <span>Add</span> <Plus />
            </Button>
          </div>
        </div>

        <DataTable table={table} isLoading={isLoading}>
          <DataTableToolbar table={table} options={options} isSearch>
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
        </DataTable>
      </div>

      <FormDialog
        open={dialog}
        mode="create"
        isLoadingSubmit={isLoadingAdd}
        onOpenChange={(open) => setDialog(open)}
        onSubmit={(payload, setError) => onSubmit(payload as any, setError)}
      />

      <FormDialog
        open={rowAction?.variant === "update"}
        mode="edit"
        defaultValues={editDefaultValues}
        isLoadingSubmit={isLoadingUpdate}
        onOpenChange={(open) => {
          if (!open) setRowAction(null);
        }}
        onSubmit={(payload, setError) => {
          const uuid = rowAction?.row.original.uuid;
          if (!uuid) return;
          onUpdateSubmit(uuid, payload as any, setError as any, () =>
            setRowAction(null)
          );
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
