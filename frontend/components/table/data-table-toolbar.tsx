"use client";

import type { Column, Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import * as React from "react";

import { DataTableDateFilter } from "@/components/table/data-table-date-filter";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { DataTableSliderFilter } from "@/components/table/data-table-slider-filter";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import TaskStatusFilter from "../filters/task-status-filter";
import CategoryListFilter from "../filters/category-list-filter";
import IngredientListFilter from "../filters/ingredient-list-filter";
import SearchBy, { SearchByOptions } from "@/components/filters/search-by";

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  options?: SearchByOptions[];
  isSearch?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  options,
  isSearch,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  if (isSearch && !options) {
    throw new Error("if isSearch is true, options must be defined");
  }
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  );

  const [resetSearch, setSearchReset] = React.useState(0);

  const onReset = React.useCallback(() => {
    setSearchReset((prev) => prev + 1);
    table.resetColumnFilters();
  }, [table]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-start justify-between gap-2 p-1",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {isSearch && options && (
          <SearchBy options={options} table={table} reset={resetSearch} />
        )}

        {columns.map((column) => (
          <DataTableToolbarFilter
            table={table}
            key={column.id}
            column={column}
          />
        ))}

        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="outline"
            size="sm"
            className="border-dashed"
            disabled={table.getState().globalFilter}
            onClick={onReset}
          >
            <X />
            Reset
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  table: Table<TData>;
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>({
  column,
  table,
}: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  const onFilterRender = React.useCallback(() => {
    if (!columnMeta?.variant) return null;

    switch (columnMeta.variant) {
      case "text":
        return (
          <Input
            disabled={table.getState().globalFilter}
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-8 w-40 lg:w-56"
          />
        );

      case "number":
        return (
          <div className="relative">
            <Input
              disabled={table.getState().globalFilter}
              type="number"
              inputMode="numeric"
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className={cn("h-8 w-30", columnMeta.unit && "pr-8")}
            />
            {columnMeta.unit && (
              <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                {columnMeta.unit}
              </span>
            )}
          </div>
        );

      case "range":
        return (
          <DataTableSliderFilter
            table={table}
            column={column}
            title={columnMeta.label ?? column.id}
          />
        );

      case "date":
      case "dateRange":
        return (
          <DataTableDateFilter
            table={table}
            column={column}
            title={columnMeta.label ?? column.id}
            multiple={columnMeta.variant === "dateRange"}
          />
        );

      case "select":
      case "multiSelect":
        return (
          <DataTableFacetedFilter
            table={table}
            column={column}
            title={columnMeta.label ?? column.id}
            options={columnMeta.options ?? []}
            multiple={columnMeta.variant === "multiSelect"}
          />
        );
      
      case "taskStatus":
          return (
            <TaskStatusFilter
              table={table}
              column={column}
              title={columnMeta.label ?? column.id}
            />
          );

      case "categoryList":
        return (
          <CategoryListFilter
            table={table}
            column={column}
            title={columnMeta.label ?? column.id}
          />
        );

      case "ingredientList":
        return (
          <IngredientListFilter
            table={table}
            column={column}
            title={columnMeta.label ?? column.id}
          />
        );

      default:
        return null;
    }
  }, [table, column, columnMeta]);

  return onFilterRender();
}
