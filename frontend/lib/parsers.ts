import { createParser } from "nuqs/server";
import { z } from "zod";

import { dataTableConfig } from "@/config/data-table";

import type {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from "@/types/data-table";
import { format } from "date-fns";
import { Sort } from "@/types/api-types";

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export interface OptionsParseDate {
  intialStartDate: Date | null;
  initialEndDate: Date | null;
}

export const getSortingStateParser = <TData>(
  columnIds?: string[] | Set<string>
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(sortingItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (item, index) =>
          item.id === b[index]?.id && item.desc === b[index]?.desc
      ),
  });
};

const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

export const getFiltersStateParser = <TData>(
  columnIds?: string[] | Set<string>
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(filterItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnFilter<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (filter, index) =>
          filter.id === b[index]?.id &&
          filter.value === b[index]?.value &&
          filter.variant === b[index]?.variant &&
          filter.operator === b[index]?.operator
      ),
  });
};

export const parseCreatedAtToDateRange = (
  createdAtArray: number[],
  options?: OptionsParseDate
): { startDate: string | null; endDate: string | null } => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  if (createdAtArray.length === 0) {
    if (options) {
      return {
        startDate: options.intialStartDate
          ? format(options.intialStartDate, "yyyy-MM-dd")
          : "",
        endDate: options.initialEndDate
          ? format(options.initialEndDate, "yyyy-MM-dd")
          : "",
      };
    }

    return {
      startDate: format(thirtyDaysAgo, "yyyy-MM-dd"),
      endDate: format(today, "yyyy-MM-dd"),
    };
  }

  const [startDate, endDate] = createdAtArray;

  return {
    startDate: format(
      new Date(Number(startDate ?? thirtyDaysAgo)),
      "yyyy-MM-dd"
    ),
    endDate: format(new Date(Number(endDate ?? today)), "yyyy-MM-dd"),
  };
};

export const parseSort = (sort: { id: string; desc: boolean }[]): Sort[] => {
  return sort.length > 0
    ? sort.map((item) => ({
        by: item.id,
        direction: item.desc ? "desc" : "asc",
      }))
    : [{ by: "createdAt", direction: "desc" }];
};
