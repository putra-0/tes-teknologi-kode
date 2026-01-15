import type { DataTableConfig } from "@/config/data-table";
import type { FilterItemSchema } from "@/lib/parsers";
import type {
  Column,
  ColumnSort,
  Row,
  RowData,
  Table,
} from "@tanstack/react-table";
import React from "react";

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  interface ColumnMeta<TData extends RowData, TValue> {
    alignHeader?:
      | "start"
      | "end"
      | "left"
      | "right"
      | "center"
      | "justify"
      | "match-parent";
    alignCell?:
      | "start"
      | "end"
      | "left"
      | "right"
      | "center"
      | "justify"
      | "match-parent";
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }
}

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  logo?: React.ReactNode;
  subLabel?: string;
}

export type FilterOperator = DataTableConfig["operators"][number];
export type FilterVariant = DataTableConfig["filterVariants"][number];
export type JoinOperator = DataTableConfig["joinOperators"][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: "update" | "delete" | "view" | "update-status";
}

export type Status = {
  code: string;
  name: string;
};

export type Category = {
  name: string;
};

export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  multiple?: boolean;
  table: Table<TData>;
}
