import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import React from "react";

const TableIngredients = React.lazy(
  () => import("@/modules/dashboard/ingredients/components/table")
);

const Page = () => {
  return (
    <div className="">
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            filterCount={2}
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
        <TableIngredients />
      </React.Suspense>
    </div>
  );
};

export default Page;
