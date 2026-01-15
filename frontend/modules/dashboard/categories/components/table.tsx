"use client";

import { DataTable } from "@/components/table/data-table";
import React, { useEffect } from "react";
import { getCategoryTableColumns } from "./columns";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { DataTableRowAction } from "@/types/data-table";
import { Category } from "../data/type";
import { useCategories } from "../hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAddCategory } from "../hooks/use-add-category";
import { FormDialog } from "./form-dialog";
import { useUpdateCategory } from "../hooks/use-update-category";
import { DeleteConfirmDialog } from "./delete-form-dialog";
import { useDeleteCategory } from "../hooks/use-delete-category";
import { DataTableSortList } from "@/components/table/data-table-sort-list";

export default function TableCategories() {
  const { data, isLoading, isRefetching } = useCategories();
  const { dialog, isLoading: isLoadingAdd, setDialog, onSubmit } = useAddCategory();
  const { isLoading: isLoadingUpdate, onUpdateSubmit } = useUpdateCategory();
  const { isLoading: isLoadingDelete, onDeleteSubmit } = useDeleteCategory();

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Category> | null>(null);

  const columns = getCategoryTableColumns({ setRowAction });
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
            <h2 className="page-header">Categories</h2>
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
        onSubmit={(data, setError) =>
          onSubmit(
            {
              ...data,
            },
            setError
          )
        }
      />

      <FormDialog
        open={rowAction?.variant === "update"}
        mode="edit"
        defaultValues={{ name: rowAction?.row.original.name ?? "" }}
        isLoadingSubmit={isLoadingUpdate}
        onOpenChange={(open) => {
          if (!open) setRowAction(null);
        }}
        onSubmit={(data, setError) => {
          const uuid = rowAction?.row.original.uuid;
          if (!uuid) return;
          onUpdateSubmit(uuid, data, setError, () => setRowAction(null));
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
