import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import React from "react";

const TableRecipes = React.lazy(
  () => import("@/modules/dashboard/recipes/components/table")
);

const Page = () => {
  return (
    <div className="">
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            filterCount={3}
            cellWidths={[
              "10rem",
              "30rem",
              "10rem",
              "10rem",
              "6rem",
              "6rem",
              "6rem",
            ]}
            shrinkZero
          />
        }
      >
        <TableRecipes />
      </React.Suspense>
    </div>
  );
};

export default Page;
