import { useListTaskStatus } from "@/hooks/lists/use-list-task-status";
import { DataTableFacetedFilterProps } from "@/types/data-table";
import { Skeleton } from "../ui/skeleton";
import { DataTableFacetedFilter } from "../table/data-table-faceted-filter";
import { TaskStatus } from "@/types/list-types";

export default function TaskStatusFilter<TData, TValue>({ table, column, title }: DataTableFacetedFilterProps<TData, TValue>) {
  const { data, isLoading } = useListTaskStatus();

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-8 w-20.5 bg-foreground/20" />
      ) : (
        <DataTableFacetedFilter
          table={table}
          column={column}
          title={title}
          options={
            data?.items.map((type: TaskStatus) => {
              return { label: type.name, value: type.code };
            }) ?? []
          }
          multiple={false}
        />
      )}
    </>
  );
}