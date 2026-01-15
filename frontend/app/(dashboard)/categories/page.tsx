import { DataTableSkeleton } from '@/components/table/data-table-skeleton';
import React from 'react';
const TableCategories = React.lazy(
  () => import('@/modules/dashboard/categories/components/table'),
);

const Page = () => {
  return (
      <div className=''>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={7}
              filterCount={2}
              cellWidths={[
                '10rem',
                '30rem',
                '10rem',
                '10rem',
                '6rem',
                '6rem',
                '6rem',
              ]}
              shrinkZero
            />
          }
        >
          <TableCategories />
        </React.Suspense>
      </div>
  );
};

export default Page;
