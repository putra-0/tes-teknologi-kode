import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import type * as React from 'react';
import { DataTablePagination } from '@/components/table/data-table-pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import IndeterminateProgress from '@/components/common/indeterminate-progress';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  pagination?: boolean;
}

export function DataTable<TData>({ table, actionBar, children, isLoading, pagination = true, className, ...props }: DataTableProps<TData>) {
  return (
    <div className={cn('flex w-full flex-col gap-2.5 overflow-auto mb-4', className)} {...props}>
      {children}
      <div className="overflow-hidden rounded-md border">
        {table.getState().globalFilter && <IndeterminateProgress />}

        <Table className="bg-card">
          <TableHeader className={isLoading || table.getState().globalFilter ? 'pointer-events-none' : ''}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                      width: header.column.columnDef.size,
                      textAlign: header.column.columnDef.meta?.alignHeader
                    }}
                    className={isLoading || table.getState().globalFilter ? 'opacity-50' : ''}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {isLoading ? (
            <TableBody>
              {[...Array(table.getState().pagination.pageSize)].map((_, i) => (
                <TableRow key={`loading-${i}`}>
                  {table.getVisibleLeafColumns().map(column => (
                    <TableCell key={column.id} className="p-3">
                      <div className="h-5 bg-foreground/20 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        style={{
                          minWidth: cell.column.columnDef.minSize,
                          maxWidth: cell.column.columnDef.maxSize,
                          width: cell.column.columnDef.size,
                          textAlign: cell.column.columnDef.meta?.alignCell
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      {pagination && (
        <div className="flex flex-col gap-2.5">
          <DataTablePagination table={table} />
          {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
        </div>
      )}
    </div>
  );
}
