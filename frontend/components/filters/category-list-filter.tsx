import { useListCategories } from "@/hooks/lists/use-list-categories";
import { DataTableFacetedFilterProps } from "@/types/data-table";
import { CategoryListItem } from "@/types/list-types";

import { Skeleton } from "../ui/skeleton";
import { DataTableFacetedFilter } from "../table/data-table-faceted-filter";

export default function CategoryListFilter<TData, TValue>({
  table,
  column,
  title,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const { data, isLoading } = useListCategories();

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-8 w-[82px] bg-foreground/20" />
      ) : (
        <DataTableFacetedFilter
          table={table}
          column={column}
          title={title}
          options={
            data?.items.map((item: CategoryListItem) => ({
              label: item.name,
              value: item.uuid,
            })) ?? []
          }
          multiple={false}
        />
      )}
    </>
  );
}
